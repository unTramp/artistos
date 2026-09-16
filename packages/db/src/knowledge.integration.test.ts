import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import {
  AcceptCandidateKnowledgeService,
  ActivateIdentityVersionService,
  AddToneCorpusItemService,
  CreateCandidateKnowledgeService,
  CreateIdentityDraftService,
  MergeCandidateKnowledgeService,
  RebuildArtistBrainService,
  RejectCandidateKnowledgeService,
  RelabelToneCorpusItemService,
  type CommandContext
} from "@artist-os/core";
import { PgArtistFoundationWriter } from "./artist-foundation-writer";
import { PgKnowledgeReader } from "./knowledge-reader";
import { PgKnowledgeWriter } from "./knowledge-writer";
import { createDatabase, type Stage0Database } from "./runtime";
import { artists } from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();
const userId = `knowledge-user-${crypto.randomUUID()}`;

const context = (overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId,
  actor: { type: "USER", id: userId },
  requestedAt: new Date("2026-09-16T15:00:00.000Z"),
  traceId: `knowledge-trace-${crypto.randomUUID()}`,
  ...overrides
});

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
      artist_brain_snapshots,
      artist_brain_knowledge_items,
      candidate_knowledge,
      tone_corpus_items,
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
  await db.insert(artists).values({ id: artistId, name: "Knowledge Artist", artistName: "Knowledge Artist" });

  const foundation = new PgArtistFoundationWriter(db);
  const draft = await new CreateIdentityDraftService(foundation).execute({ label: "Knowledge Identity" }, context());
  if (draft.status !== "SUCCESS") throw new Error("identity setup failed");
  const active = await new ActivateIdentityVersionService(foundation).execute(draft.data.versionId, context());
  if (active.status !== "SUCCESS") throw new Error("identity activation failed");
});

afterAll(async () => { await runtime.close(); });

describe("Knowledge foundation", () => {
  it("keeps Tone Corpus labels canonical and excludes DO_NOT_COPY/OUTDATED from positive Brain context", async () => {
    const writer = new PgKnowledgeWriter(db);
    const add = new AddToneCorpusItemService(writer);

    const authentic = await add.execute({ textContent: "I prefer plain, emotionally honest wording.", label: "AUTHENTIC", sourceType: "CAPTION", language: "en" }, context());
    await add.execute({ textContent: "Generic launch hype that does not sound like me.", label: "DO_NOT_COPY", sourceType: "CAPTION", language: "en" }, context());
    await add.execute({ textContent: "Old persona language from a retired era.", label: "OUTDATED", sourceType: "CAPTION", language: "en" }, context());
    await add.execute({ textContent: "Short direct sentences with warmth.", label: "GOOD", sourceType: "INTERVIEW", language: "en", isPrivate: true }, context());

    expect(authentic.status).toBe("SUCCESS");
    const rebuilt = await new RebuildArtistBrainService(writer).execute(context());
    expect(rebuilt).toMatchObject({ status: "SUCCESS", data: { versionNumber: 1 } });

    const home = await new PgKnowledgeReader(db).getHome(artistId);
    const payload = home.latestSnapshot?.payload as { toneExamples?: Array<{ label: string; textContent: string; isPrivate: boolean }> };
    expect(payload.toneExamples?.map((item) => item.label).sort()).toEqual(["AUTHENTIC", "GOOD"]);
    expect(payload.toneExamples?.some((item) => item.textContent.includes("Generic launch hype"))).toBe(false);
    expect(payload.toneExamples?.some((item) => item.textContent.includes("Old persona"))).toBe(false);
    expect(payload.toneExamples?.find((item) => item.label === "GOOD")?.isPrivate).toBe(true);
  });

  it("does not promote PENDING CandidateKnowledge until explicit human acceptance", async () => {
    const writer = new PgKnowledgeWriter(db);
    const create = await new CreateCandidateKnowledgeService(writer).execute({
      sourceType: "VOICE_NOTE",
      sourceId: "voice-note-001",
      content: "My public tone should feel kind, open and emotionally direct.",
      destination: "ARTIST_BRAIN"
    }, context());
    if (create.status !== "SUCCESS") throw new Error("candidate setup failed");

    await new RebuildArtistBrainService(writer).execute(context());
    let home = await new PgKnowledgeReader(db).getHome(artistId);
    expect(home.approvedKnowledge.some((item) => item.content.includes("kind, open"))).toBe(false);

    const accepted = await new AcceptCandidateKnowledgeService(writer).execute({ candidateId: create.data.candidateId }, context());
    expect(accepted).toMatchObject({
      status: "SUCCESS",
      data: { status: "ACCEPTED", destination: "ARTIST_BRAIN", promotedEntityType: "ArtistBrainKnowledgeItem" }
    });

    const rebuilt = await new RebuildArtistBrainService(writer).execute(context());
    expect(rebuilt).toMatchObject({ status: "SUCCESS", data: { versionNumber: 3 } });
    home = await new PgKnowledgeReader(db).getHome(artistId);
    expect(home.approvedKnowledge).toEqual(expect.arrayContaining([
      expect.objectContaining({ content: "My public tone should feel kind, open and emotionally direct.", sourceCandidateId: create.data.candidateId })
    ]));
    const payload = home.latestSnapshot?.payload as { approvedKnowledge?: Array<{ sourceCandidateId: string }> };
    expect(payload.approvedKnowledge).toEqual(expect.arrayContaining([expect.objectContaining({ sourceCandidateId: create.data.candidateId })]));
  });

  it("blocks promotion into an owning domain that is not implemented and leaves the candidate PENDING", async () => {
    const writer = new PgKnowledgeWriter(db);
    const create = await new CreateCandidateKnowledgeService(writer).execute({
      sourceType: "AI_SUGGESTION",
      sourceId: "identity-candidate-001",
      content: "Change the core visual identity to neon red.",
      destination: "IDENTITY"
    }, context());
    if (create.status !== "SUCCESS") throw new Error("candidate setup failed");

    const accepted = await new AcceptCandidateKnowledgeService(writer).execute({ candidateId: create.data.candidateId }, context());
    expect(accepted).toMatchObject({ status: "BLOCKED", code: "CANDIDATE_DESTINATION_BLOCKED" });
    const home = await new PgKnowledgeReader(db).getHome(artistId);
    expect(home.candidates.find((item) => item.id === create.data.candidateId)?.status).toBe("PENDING");
  });

  it("retains rejected and merged candidates as auditable lifecycle records", async () => {
    const writer = new PgKnowledgeWriter(db);
    const createService = new CreateCandidateKnowledgeService(writer);
    const rejectedCandidate = await createService.execute({
      sourceType: "RESEARCH",
      sourceId: "research-001",
      content: "Transient claim that should not become durable knowledge.",
      destination: "ARTIST_BRAIN"
    }, context());
    const mergeTarget = await createService.execute({
      sourceType: "VOICE_NOTE",
      sourceId: "voice-merge-target",
      content: "Prefer simple language.",
      destination: "ARTIST_BRAIN"
    }, context());
    const mergeSource = await createService.execute({
      sourceType: "VOICE_NOTE",
      sourceId: "voice-merge-source",
      content: "Use simple language.",
      destination: "ARTIST_BRAIN"
    }, context());
    if (rejectedCandidate.status !== "SUCCESS" || mergeTarget.status !== "SUCCESS" || mergeSource.status !== "SUCCESS") throw new Error("candidate setup failed");

    const rejected = await new RejectCandidateKnowledgeService(writer).execute({ candidateId: rejectedCandidate.data.candidateId, reason: "Unsupported transient claim" }, context());
    expect(rejected).toMatchObject({ status: "SUCCESS", data: { status: "REJECTED" } });

    const merged = await new MergeCandidateKnowledgeService(writer).execute({ candidateId: mergeSource.data.candidateId, targetCandidateId: mergeTarget.data.candidateId }, context());
    expect(merged).toMatchObject({ status: "SUCCESS", data: { status: "MERGED", mergedIntoCandidateId: mergeTarget.data.candidateId } });

    const home = await new PgKnowledgeReader(db).getHome(artistId);
    expect(home.candidates.find((item) => item.id === rejectedCandidate.data.candidateId)?.resolutionReason).toBe("Unsupported transient claim");
    expect(home.approvedKnowledge.some((item) => item.sourceCandidateId === rejectedCandidate.data.candidateId)).toBe(false);
    expect(home.approvedKnowledge.some((item) => item.sourceCandidateId === mergeSource.data.candidateId)).toBe(false);
  });

  it("replays Tone Corpus creation and relabel commands idempotently", async () => {
    const writer = new PgKnowledgeWriter(db);
    const add = new AddToneCorpusItemService(writer);
    const addKey = `tone-add-${crypto.randomUUID()}`;
    const first = await add.execute({ textContent: "Idempotent tone sample.", label: "NEUTRAL", sourceType: "MESSAGE" }, context({ idempotencyKey: addKey }));
    const replay = await add.execute({ textContent: "Changed retry payload.", label: "AUTHENTIC", sourceType: "MESSAGE" }, context({ idempotencyKey: addKey }));
    expect(replay).toEqual(first);
    if (first.status !== "SUCCESS") throw new Error("tone setup failed");

    const relabel = new RelabelToneCorpusItemService(writer);
    const relabelKey = `tone-relabel-${crypto.randomUUID()}`;
    const relabeled = await relabel.execute({ itemId: first.data.itemId, label: "AUTHENTIC" }, context({ idempotencyKey: relabelKey }));
    const relabelReplay = await relabel.execute({ itemId: first.data.itemId, label: "OUTDATED" }, context({ idempotencyKey: relabelKey }));
    expect(relabelReplay).toEqual(relabeled);

    const counts = await db.execute(sql`
      select
        (select count(*)::int from tone_corpus_items where id = ${first.data.itemId}::uuid) as "items",
        (select count(*)::int from outbox_events where aggregate_id = ${first.data.itemId}::uuid) as "events"
    `);
    expect(counts.rows[0]).toMatchObject({ items: 1, events: 2 });
  });
});
