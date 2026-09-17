import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { CreateDecisionService, type CommandContext } from "@artist-os/core";
import { createDatabase, type Stage0Database } from "./runtime";
import { artists } from "./schema";
import { PgDecisionReader } from "./decision-memory-reader";
import { PgDecisionWriter } from "./decision-memory-writer";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();
const userId = `decision-user-${crypto.randomUUID()}`;

const context = (overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId,
  actor: { type: "USER", id: userId },
  requestedAt: new Date("2026-09-17T08:00:00.000Z"),
  traceId: `trace-${crypto.randomUUID()}`,
  ...overrides
});

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
      decision_state_history,
      decisions,
      planning_objectives,
      operational_actions,
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
  await db.insert(artists).values({ id: artistId, name: "Decision Artist", artistName: "Decision Artist" });
});

afterAll(async () => { await runtime.close(); });

describe("Decision Memory persistence", () => {
  it("persists canonical Decision fields and forward-compatible references", async () => {
    const create = new CreateDecisionService(new PgDecisionWriter(db));
    const subjectId = crypto.randomUUID();
    const result = await create.execute({
      title: "Use Trastevere as next release",
      decision: "Make Trastevere the next release focus.",
      reason: "It is the most release-ready song in the current context.",
      scope: "music.release",
      decisionKey: "song.next-release",
      references: [{ refType: "SONG", refId: subjectId, relation: "SUBJECT" }],
      reviewAt: "2026-10-01T10:00:00.000Z"
    }, context({ idempotencyKey: `decision-${crypto.randomUUID()}` }));
    expect(result.status).toBe("SUCCESS");
    if (result.status !== "SUCCESS") throw new Error("decision missing");

    const stored = await new PgDecisionReader(db).getDecision(artistId, result.data.decisionId);
    expect(stored).toMatchObject({
      title: "Use Trastevere as next release",
      scope: "music.release",
      decisionKey: "song.next-release",
      status: "ACTIVE",
      supersedesDecisionId: null,
      references: [{ refType: "SONG", refId: subjectId, relation: "SUBJECT" }]
    });
  });

  it("surfaces a deterministic conflict without silently replacing the prior Decision", async () => {
    const create = new CreateDecisionService(new PgDecisionWriter(db));
    const result = await create.execute({
      title: "Change next release",
      decision: "Use Always on My Mind as the next release.",
      reason: "Testing a different release order.",
      scope: "music.release",
      decisionKey: "song.next-release"
    }, context());

    expect(result).toMatchObject({
      status: "CONFLICT",
      code: "DECISION_CONFLICT",
      fieldErrors: { conflictingDecisionId: expect.any(String) }
    });

    const active = await new PgDecisionReader(db).listDecisions(artistId, { statuses: ["ACTIVE"] });
    expect(active.filter((decision) => decision.decisionKey === "song.next-release" && decision.scope === "music.release")).toHaveLength(1);
    expect(active[0]?.title).toBe("Use Trastevere as next release");
  });

  it("allows an explicit human override, reverses the prior Decision and preserves lineage", async () => {
    const reader = new PgDecisionReader(db);
    const [prior] = await reader.listDecisions(artistId, { statuses: ["ACTIVE"], scope: "music.release" });
    if (!prior) throw new Error("prior decision missing");

    const create = new CreateDecisionService(new PgDecisionWriter(db));
    const result = await create.execute({
      title: "Change next release",
      decision: "Use Always on My Mind as the next release.",
      reason: "The release schedule now favors the finished master.",
      scope: "music.release",
      decisionKey: "song.next-release",
      overrideDecisionId: prior.id,
      overrideRationale: "The schedule changed and Always on My Mind can ship earlier."
    }, context({ requestedAt: new Date("2026-09-18T09:00:00.000Z") }));
    expect(result.status).toBe("SUCCESS");
    if (result.status !== "SUCCESS") throw new Error("override decision missing");

    const previous = await reader.getDecision(artistId, prior.id);
    const current = await reader.getDecision(artistId, result.data.decisionId);
    expect(previous?.status).toBe("REVERSED");
    expect(current).toMatchObject({
      status: "ACTIVE",
      decisionKey: "song.next-release",
      supersedesDecisionId: prior.id
    });
    expect(current?.references).toContainEqual({ refType: "DECISION", refId: prior.id, relation: "SUPERSEDES" });

    const history = await reader.listHistory(artistId, prior.id);
    expect(history.at(-1)).toMatchObject({
      fromStatus: "ACTIVE",
      toStatus: "REVERSED",
      rationale: "The schedule changed and Always on My Mind can ship earlier."
    });
  });

  it("does not invent conflicts across different scopes or for ad-hoc Decisions without a key", async () => {
    const create = new CreateDecisionService(new PgDecisionWriter(db));
    const differentScope = await create.execute({
      title: "Campaign-specific release choice",
      decision: "Use a campaign-specific release order.",
      reason: "This applies only to the campaign context.",
      scope: "campaign:launch-2026",
      decisionKey: "song.next-release"
    }, context());
    expect(differentScope.status).toBe("SUCCESS");

    const adHoc = await create.execute({
      title: "Creative exception",
      decision: "Publish the imperfect home performance.",
      reason: "Authenticity matters more than polish for this one post.",
      scope: "content"
    }, context());
    expect(adHoc.status).toBe("SUCCESS");
  });
});
