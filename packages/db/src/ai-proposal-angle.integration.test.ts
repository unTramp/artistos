import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import {
  ActivateIdentityVersionService,
  CreateIdentityDraftService,
  type CommandContext,
  type FoundationEvidence
} from "@artist-os/core";
import { PgAIProposalAngleWriter } from "./ai-proposal-angle-writer";
import { PgArtistFoundationWriter } from "./artist-foundation-writer";
import { createDatabase, type Stage0Database } from "./runtime";
import { artists } from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();
const userId = `ai-proposal-user-${crypto.randomUUID()}`;

const context = (idempotencyKey?: string): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId,
  actor: { type: "USER", id: userId },
  requestedAt: new Date("2026-09-16T19:30:00.000Z"),
  ...(idempotencyKey ? { idempotencyKey } : {}),
  traceId: `trace-${crypto.randomUUID()}`
});

const evidence = (commandContext: CommandContext): FoundationEvidence => ({
  actorType: commandContext.actor.type,
  ...(commandContext.actor.id ? { actorId: commandContext.actor.id } : {}),
  commandId: commandContext.commandId,
  traceId: commandContext.traceId,
  occurredAt: commandContext.requestedAt,
  ...(commandContext.idempotencyKey ? { idempotencyKey: commandContext.idempotencyKey } : {})
});

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
      content_angle_revisions,
      content_angles,
      agent_run_artifacts,
      agent_runs,
      era_identities,
      artist_identity_versions,
      artist_identities,
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
  await db.insert(artists).values({ id: artistId, name: "AI Proposal Artist", artistName: "AI Proposal Artist" });

  const foundation = new PgArtistFoundationWriter(db);
  const draft = await new CreateIdentityDraftService(foundation).execute({ label: "AI proposal identity" }, context());
  if (draft.status !== "SUCCESS") throw new Error("identity draft setup failed");
  const active = await new ActivateIdentityVersionService(foundation).execute(draft.data.versionId, context());
  if (active.status !== "SUCCESS") throw new Error("identity activation setup failed");
});

afterAll(async () => { await runtime.close(); });

describe("AI Content Angle proposal acceptance persistence", () => {
  it("creates exactly one traceable DRAFT and replays the same idempotency key", async () => {
    const writer = new PgAIProposalAngleWriter(db);
    const idempotencyKey = `accept-ai-${crypto.randomUUID()}`;
    const firstContext = context(idempotencyKey);
    const angleId = crypto.randomUUID();
    const input = {
      artistId,
      angleId,
      command: {
        title: "Grounded AI proposal",
        idea: "One honest performance setup grounded in current identity.",
        pillar: "PERFORMANCE" as const,
        mode: "EVERGREEN" as const,
        goal: "Music discovery",
        audience: "Existing listeners",
        platformTargets: ["INSTAGRAM_REELS"],
        requiredAssets: ["performance take"],
        learningValue: "Test qualified attention before performance.",
        why: "Grounded in current identity evidence.",
        identityFitRationale: "Preserves the active identity.",
        productionEffort: "Low"
      },
      provenance: {
        agentRunId: crypto.randomUUID(),
        artifactRef: crypto.randomUUID(),
        proposalIndex: 0,
        promptVersion: "content-angle-strategy.v1"
      }
    };

    const first = await writer.createDraft({ ...input, evidence: evidence(firstContext) });
    expect(first).toMatchObject({ angleId, status: "DRAFT", version: 1 });

    const replay = await writer.createDraft({ ...input, angleId: crypto.randomUUID(), evidence: evidence(context(idempotencyKey)) });
    expect(replay).toEqual(first);

    const rows = await db.execute(sql`
      select id, status, source_type as "sourceType", source_provenance as "sourceProvenance", identity_version_id as "identityVersionId"
      from content_angles where artist_id = ${artistId}::uuid
    `);
    expect(rows.rows).toHaveLength(1);
    expect(rows.rows[0]).toMatchObject({ id: angleId, status: "DRAFT", sourceType: "AI_PROPOSAL" });
    expect(rows.rows[0]?.identityVersionId).toBeTruthy();
    expect(rows.rows[0]?.sourceProvenance).toMatchObject({
      agentRunId: input.provenance.agentRunId,
      artifactRef: input.provenance.artifactRef,
      proposalIndex: 0,
      promptVersion: "content-angle-strategy.v1"
    });

    const audit = await db.execute(sql`
      select action from audit_events where artist_id = ${artistId}::uuid and entity_id = ${angleId}::text
    `);
    expect(audit.rows).toEqual(expect.arrayContaining([expect.objectContaining({ action: "AI_CONTENT_ANGLE_PROPOSAL_ACCEPTED_AS_DRAFT" })]));
  });
});
