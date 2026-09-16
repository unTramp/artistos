import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import {
  ActivateEraService,
  ActivateIdentityVersionService,
  AddSongBrainStatementService,
  ConfigureSongIdentityContextService,
  CreateEraService,
  CreateIdentityDraftService,
  CreateSongService,
  type CommandContext
} from "@artist-os/core";
import { PgArtistFoundationWriter } from "./artist-foundation-writer";
import { PgSongBrainReader } from "./song-brain-reader";
import { PgSongBrainWriter } from "./song-brain-writer";
import { createDatabase, type Stage0Database } from "./runtime";
import { artists } from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();
const userId = `song-brain-user-${crypto.randomUUID()}`;
let songId: string;
let identityVersionId: string;
let eraId: string;

const context = (overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId,
  actor: { type: "USER", id: userId },
  requestedAt: new Date("2026-09-16T14:00:00.000Z"),
  traceId: `song-brain-trace-${crypto.randomUUID()}`,
  ...overrides
});

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
      song_identity_contexts,
      song_brain_statements,
      era_identities,
      artist_identity_versions,
      artist_identities,
      songs,
      consumer_inbox,
      outbox_events,
      audit_events,
      idempotency_records,
      jobs,
      artist_memberships,
      workspace_settings,
      artists
    restart identity cascade
  `);
  await db.insert(artists).values({ id: artistId, name: "Song Brain Artist", artistName: "Song Brain Artist" });

  const foundation = new PgArtistFoundationWriter(db);
  const identityDraft = await new CreateIdentityDraftService(foundation).execute({ label: "Song Brain Identity" }, context());
  if (identityDraft.status !== "SUCCESS") throw new Error("identity draft setup failed");
  identityVersionId = identityDraft.data.versionId;
  const identityActive = await new ActivateIdentityVersionService(foundation).execute(identityVersionId, context());
  if (identityActive.status !== "SUCCESS") throw new Error("identity activation setup failed");

  const era = await new CreateEraService(foundation).execute({ identityVersionId, name: "Song Brain Era" }, context());
  if (era.status !== "SUCCESS") throw new Error("era setup failed");
  eraId = era.data.eraId;
  const eraActive = await new ActivateEraService(foundation).execute(eraId, context());
  if (eraActive.status !== "SUCCESS") throw new Error("era activation setup failed");

  const song = await new CreateSongService(foundation).execute({ title: "Brain Song", isOriginal: true, language: "en" }, context());
  if (song.status !== "SUCCESS") throw new Error("song setup failed");
  songId = song.data.songId;
});

afterAll(async () => { await runtime.close(); });

describe("Song Brain vertical", () => {
  it("keeps fact, artist interpretation and audience interpretation as independent evidence", async () => {
    const writer = new PgSongBrainWriter(db);
    const add = new AddSongBrainStatementService(writer);

    await expect(add.execute({ songId, statementType: "FACT", statement: "The demo was recorded in one take." }, context()))
      .resolves.toMatchObject({ status: "SUCCESS" });
    await expect(add.execute({ songId, statementType: "ARTIST_INTERPRETATION", statement: "For me this song is about choosing honesty over comfort." }, context()))
      .resolves.toMatchObject({ status: "SUCCESS" });
    await expect(add.execute({ songId, statementType: "AUDIENCE_INTERPRETATION", statement: "Some listeners describe it as a breakup song.", sourceLabel: "Listener notes" }, context()))
      .resolves.toMatchObject({ status: "SUCCESS" });

    const brain = await new PgSongBrainReader(db).getSongBrain(artistId, songId);
    expect(brain?.statements.map((item) => item.statementType)).toEqual([
      "FACT",
      "ARTIST_INTERPRETATION",
      "AUDIENCE_INTERPRETATION"
    ]);
    expect(brain?.statements.find((item) => item.statementType === "ARTIST_INTERPRETATION")?.statement)
      .toBe("For me this song is about choosing honesty over comfort.");
    expect(brain?.statements.find((item) => item.statementType === "AUDIENCE_INTERPRETATION")?.statement)
      .toBe("Some listeners describe it as a breakup song.");
  });

  it("references Identity and Era without copying Artist Identity into Song", async () => {
    const writer = new PgSongBrainWriter(db);
    const configure = new ConfigureSongIdentityContextService(writer);

    const configured = await configure.execute({
      songId,
      identityVersionId,
      eraIdentityId: eraId,
      songSpecificVisualNotes: "Keep the base restraint, but allow warmer evening light.",
      songSpecificAnchors: ["window light"],
      allowedOverrides: ["warmer palette"]
    }, context());
    expect(configured).toMatchObject({ status: "SUCCESS", data: { songId, identityVersionId, eraIdentityId: eraId } });

    const brain = await new PgSongBrainReader(db).getSongBrain(artistId, songId);
    expect(brain?.identityContext).toMatchObject({
      identityVersionId,
      eraIdentityId: eraId,
      eraName: "Song Brain Era",
      songSpecificVisualNotes: "Keep the base restraint, but allow warmer evening light.",
      songSpecificAnchors: ["window light"],
      allowedOverrides: ["warmer palette"]
    });

    const columns = await db.execute(sql`
      select column_name from information_schema.columns
      where table_schema = 'public' and table_name = 'song_identity_contexts'
    `);
    const names = new Set(columns.rows.map((row) => String((row as { column_name: string }).column_name)));
    expect(names.has("identity_version_id")).toBe(true);
    expect(names.has("era_identity_id")).toBe(true);
    expect(names.has("artist_identity_snapshot")).toBe(false);
  });

  it("rejects an Era linked to a different Identity Version", async () => {
    const foundation = new PgArtistFoundationWriter(db);
    const nextDraft = await new CreateIdentityDraftService(foundation).execute({ label: "Future identity" }, context());
    if (nextDraft.status !== "SUCCESS") throw new Error("second identity setup failed");

    const result = await new ConfigureSongIdentityContextService(new PgSongBrainWriter(db)).execute({
      songId,
      identityVersionId: nextDraft.data.versionId,
      eraIdentityId: eraId
    }, context());
    expect(result).toMatchObject({ status: "CONFLICT", code: "SONG_ERA_IDENTITY_MISMATCH" });
  });

  it("replays statement creation idempotently without duplicating evidence", async () => {
    const add = new AddSongBrainStatementService(new PgSongBrainWriter(db));
    const idempotencyKey = `brain-statement-${crypto.randomUUID()}`;

    const first = await add.execute({ songId, statementType: "FACT", statement: "Idempotent fact." }, context({ idempotencyKey }));
    const replay = await add.execute({ songId, statementType: "FACT", statement: "Changed retry payload must not create another statement." }, context({ idempotencyKey }));
    expect(first.status).toBe("SUCCESS");
    expect(replay).toEqual(first);
    if (first.status !== "SUCCESS") throw new Error("statement setup failed");

    const counts = await db.execute(sql`
      select
        (select count(*)::int from song_brain_statements where id = ${first.data.statementId}::uuid) as "statements",
        (select count(*)::int from outbox_events where event_type = 'SongBrainStatementAdded' and aggregate_id = ${first.data.statementId}::uuid) as "events"
    `);
    expect(counts.rows[0]).toMatchObject({ statements: 1, events: 1 });
  });
});
