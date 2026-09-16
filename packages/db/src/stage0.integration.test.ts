import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { CreateArtistService } from "@artist-os/core";
import { PgArtistScopeReader } from "./artist-scope";
import { PgArtistWorkspaceWriter } from "./artist-workspace-writer";
import { PgJobQueue } from "./job-queue";
import { PgOutboxConsumer } from "./outbox-dispatcher";
import { createDatabase, type Stage0Database } from "./runtime";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
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
});

afterAll(async () => {
  await runtime.close();
});

describe("Stage 0 PostgreSQL foundation", () => {
  it("atomically creates an artist workspace, ownership, audit and outbox evidence", async () => {
    const userId = `user-${crypto.randomUUID()}`;
    const artistId = crypto.randomUUID();
    const service = new CreateArtistService(new PgArtistWorkspaceWriter(db));

    const result = await service.execute(
      {
        name: "Stage 0 Artist",
        artistName: "Stage 0 Artist",
        timezone: "UTC",
        locale: "en",
        reportingCurrency: "USD"
      },
      {
        commandId: crypto.randomUUID(),
        artistId,
        actor: { type: "USER", id: userId },
        requestedAt: new Date(),
        traceId: `trace-${crypto.randomUUID()}`,
        idempotencyKey: `idem-${crypto.randomUUID()}`
      }
    );

    expect(result.status).toBe("SUCCESS");

    const scopeReader = new PgArtistScopeReader(db);
    await expect(scopeReader.findArtistIdByAuthUserId(userId)).resolves.toBe(artistId);

    const evidence = await db.execute(sql`
      select
        (select count(*)::int from artists where id = ${artistId}::uuid) as artists,
        (select count(*)::int from workspace_settings where artist_id = ${artistId}::uuid) as workspaces,
        (select count(*)::int from artist_memberships where artist_id = ${artistId}::uuid and auth_user_id = ${userId}) as memberships,
        (select count(*)::int from audit_events where artist_id = ${artistId}::uuid) as audits,
        (select count(*)::int from outbox_events where artist_id = ${artistId}::uuid) as outbox
    `);

    expect(evidence.rows[0]).toMatchObject({ artists: 1, workspaces: 1, memberships: 1, audits: 1, outbox: 1 });

    const consumer = new PgOutboxConsumer(db);
    const consumed = await consumer.consumeNext("stage0-integration");
    expect(consumed).toMatchObject({ eventType: "ArtistCreated", artistId, duplicate: false });

    const inbox = await db.execute(sql`
      select
        (select count(*)::int from consumer_inbox where consumer = 'stage0-integration') as inbox,
        (select count(*)::int from outbox_events where artist_id = ${artistId}::uuid and published_at is not null) as published
    `);
    expect(inbox.rows[0]).toMatchObject({ inbox: 1, published: 1 });
  });

  it("retries durable jobs and dead-letters after max attempts", async () => {
    const queue = new PgJobQueue(db);
    const jobId = await queue.enqueue({
      type: "STAGE0_NOOP",
      correlationId: `trace-${crypto.randomUUID()}`,
      maxAttempts: 2
    });

    const first = await queue.claim("worker-a");
    expect(first?.id).toBe(jobId);
    if (!first) throw new Error("first job claim missing");
    await queue.fail(first, "worker-a", 0);

    const second = await queue.claim("worker-b");
    expect(second?.id).toBe(jobId);
    expect(second?.attemptCount).toBe(2);
    if (!second) throw new Error("second job claim missing");
    await queue.fail(second, "worker-b", 0);

    const status = await db.execute(sql`select status from jobs where id = ${jobId}::uuid`);
    expect(status.rows[0]).toMatchObject({ status: "DEAD_LETTER" });
  });
});
