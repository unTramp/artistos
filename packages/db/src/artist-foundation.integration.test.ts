import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import {
  ActivateEraService,
  ActivateIdentityVersionService,
  CreateEraService,
  CreateIdentityDraftService,
  CreateSongService,
  EndEraService,
  type CommandContext
} from "@artist-os/core";
import { PgArtistFoundationWriter } from "./artist-foundation-writer";
import { createDatabase, type Stage0Database } from "./runtime";
import { artists } from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();
const userId = `foundation-user-${crypto.randomUUID()}`;

const context = (overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId,
  actor: { type: "USER", id: userId },
  requestedAt: new Date("2026-09-16T13:10:00.000Z"),
  traceId: `trace-${crypto.randomUUID()}`,
  ...overrides
});

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
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
  await db.insert(artists).values({ id: artistId, name: "Foundation Artist", artistName: "Foundation Artist" });
});

afterAll(async () => { await runtime.close(); });

describe("Artist Foundation vertical", () => {
  it("versions identity explicitly and preserves prior active history", async () => {
    const writer = new PgArtistFoundationWriter(db);
    const createDraft = new CreateIdentityDraftService(writer);
    const activate = new ActivateIdentityVersionService(writer);

    const first = await createDraft.execute({ label: "Base identity" }, context());
    expect(first.status).toBe("SUCCESS");
    if (first.status !== "SUCCESS") throw new Error("first identity draft missing");
    expect(first.data).toMatchObject({ versionNumber: 1, status: "DRAFT" });

    const firstActive = await activate.execute(first.data.versionId, context());
    expect(firstActive).toMatchObject({ status: "SUCCESS", data: { versionNumber: 1, status: "ACTIVE" } });

    const second = await createDraft.execute({ label: "Refined identity" }, context());
    expect(second.status).toBe("SUCCESS");
    if (second.status !== "SUCCESS") throw new Error("second identity draft missing");
    expect(second.data).toMatchObject({ identityId: first.data.identityId, versionNumber: 2, status: "DRAFT" });

    const secondActive = await activate.execute(second.data.versionId, context());
    expect(secondActive).toMatchObject({ status: "SUCCESS", data: { versionNumber: 2, status: "ACTIVE" } });

    const versions = await db.execute(sql`
      select version_number as "versionNumber", status from artist_identity_versions
      where artist_id = ${artistId}::uuid order by version_number
    `);
    expect(versions.rows).toEqual([
      expect.objectContaining({ versionNumber: 1, status: "ARCHIVED" }),
      expect.objectContaining({ versionNumber: 2, status: "ACTIVE" })
    ]);

    const projection = await db.execute(sql`
      select ai.active_version_id as "activeVersionId", count(*) filter (where aiv.status = 'ACTIVE')::int as "activeCount"
      from artist_identities ai
      join artist_identity_versions aiv on aiv.identity_id = ai.id
      where ai.artist_id = ${artistId}::uuid
      group by ai.active_version_id
    `);
    expect(projection.rows[0]).toMatchObject({ activeVersionId: second.data.versionId, activeCount: 1 });
  });

  it("requires explicit Era closure before another Era can become active", async () => {
    const writer = new PgArtistFoundationWriter(db);
    const versionRow = await db.execute(sql`
      select id from artist_identity_versions where artist_id = ${artistId}::uuid and status = 'ACTIVE' limit 1
    `);
    const identityVersionId = String((versionRow.rows[0] as { id: string }).id);

    const createEra = new CreateEraService(writer);
    const activateEra = new ActivateEraService(writer);
    const endEra = new EndEraService(writer);

    const first = await createEra.execute({ identityVersionId, name: "Chapter One", narrativeChapter: "A focused first chapter." }, context());
    expect(first.status).toBe("SUCCESS");
    if (first.status !== "SUCCESS") throw new Error("first era missing");
    await expect(activateEra.execute(first.data.eraId, context())).resolves.toMatchObject({ status: "SUCCESS", data: { status: "ACTIVE" } });

    const second = await createEra.execute({ identityVersionId, name: "Chapter Two" }, context());
    expect(second.status).toBe("SUCCESS");
    if (second.status !== "SUCCESS") throw new Error("second era missing");

    await expect(activateEra.execute(second.data.eraId, context())).resolves.toMatchObject({ status: "CONFLICT", code: "ERA_ACTIVE_EXISTS" });
    await expect(endEra.execute(first.data.eraId, context())).resolves.toMatchObject({ status: "SUCCESS", data: { status: "ENDED" } });
    await expect(activateEra.execute(second.data.eraId, context())).resolves.toMatchObject({ status: "SUCCESS", data: { status: "ACTIVE" } });

    const active = await db.execute(sql`select count(*)::int as count from era_identities where artist_id = ${artistId}::uuid and status = 'ACTIVE'`);
    expect(active.rows[0]).toMatchObject({ count: 1 });
  });

  it("creates Song as the Brain namespace without legacy release lifecycle fields", async () => {
    const writer = new PgArtistFoundationWriter(db);
    const createSong = new CreateSongService(writer);
    const isrc = "QZABC2600001";

    const created = await createSong.execute({
      title: "Foundation Song",
      type: "SONG",
      isOriginal: true,
      language: "en",
      story: "A private song story.",
      meaning: "A human-authored meaning.",
      isrc,
      platformLinks: { spotify: "https://open.spotify.com/track/example" }
    }, context());
    expect(created).toMatchObject({ status: "SUCCESS", data: { title: "Foundation Song", isOriginal: true } });

    const duplicate = await createSong.execute({ title: "Duplicate import", isOriginal: true, isrc }, context());
    expect(duplicate).toMatchObject({ status: "CONFLICT", code: "SONG_DUPLICATE_ISRC" });

    const columns = await db.execute(sql`
      select column_name from information_schema.columns where table_schema = 'public' and table_name = 'songs'
    `);
    const names = new Set(columns.rows.map((row) => String((row as { column_name: string }).column_name)));
    expect(names.has("release_status")).toBe(false);
    expect(names.has("release_date")).toBe(false);
    expect(names.has("upc")).toBe(false);

    const evidence = await db.execute(sql`
      select
        count(*) filter (where event_type = 'IdentityVersionActivated')::int as "identityActivated",
        count(*) filter (where event_type = 'EraActivated')::int as "eraActivated",
        count(*) filter (where event_type = 'SongCreated')::int as "songCreated"
      from outbox_events where artist_id = ${artistId}::uuid
    `);
    expect(evidence.rows[0]).toMatchObject({ identityActivated: 2, eraActivated: 2, songCreated: 1 });
  });

  it("replays Artist Foundation mutations idempotently within command + artist + actor scope", async () => {
    const writer = new PgArtistFoundationWriter(db);
    const createSong = new CreateSongService(writer);
    const idempotencyKey = `foundation-idem-${crypto.randomUUID()}`;

    const first = await createSong.execute(
      { title: "Idempotent Song", isOriginal: true },
      context({ idempotencyKey, traceId: "trace-idem-first" })
    );
    const replay = await createSong.execute(
      { title: "Changed title must not create a second mutation", isOriginal: true },
      context({ idempotencyKey, traceId: "trace-idem-retry" })
    );

    expect(first.status).toBe("SUCCESS");
    expect(replay.status).toBe("SUCCESS");
    if (first.status !== "SUCCESS" || replay.status !== "SUCCESS") throw new Error("idempotent song result missing");
    expect(replay.data).toEqual(first.data);

    const counts = await db.execute(sql`
      select
        count(*) filter (where title = 'Idempotent Song')::int as "songs",
        count(*) filter (where event_type = 'SongCreated' and aggregate_id = ${first.data.songId}::uuid)::int as "events",
        (select count(*)::int from idempotency_records where command_name = 'CreateSong' and artist_id = ${artistId}::uuid and key = ${idempotencyKey}) as "records"
      from songs s
      left join outbox_events o on o.artist_id = s.artist_id
      where s.artist_id = ${artistId}::uuid
    `);
    expect(counts.rows[0]).toMatchObject({ songs: 1, events: 1, records: 1 });
  });
});
