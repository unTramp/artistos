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

const artistCommand = {
  name: "Stage 0 Artist",
  artistName: "Stage 0 Artist",
  timezone: "UTC",
  locale: "en",
  reportingCurrency: "USD"
} as const;

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
  it("atomically creates an artist workspace, ownership, audit and traceable outbox evidence", async () => {
    const userId = `user-${crypto.randomUUID()}`;
    const artistId = crypto.randomUUID();
    const commandId = crypto.randomUUID();
    const traceId = `trace-${crypto.randomUUID()}`;
    const service = new CreateArtistService(new PgArtistWorkspaceWriter(db));

    const result = await service.execute(artistCommand, {
      commandId,
      artistId,
      actor: { type: "USER", id: userId },
      requestedAt: new Date(),
      traceId,
      idempotencyKey: `idem-${crypto.randomUUID()}`
    });

    expect(result.status).toBe("SUCCESS");

    const scopeReader = new PgArtistScopeReader(db);
    await expect(scopeReader.findArtistIdByAuthUserId(userId)).resolves.toBe(artistId);

    const evidence = await db.execute(sql`
      select
        (select count(*)::int from artists where id = ${artistId}::uuid) as artists,
        (select count(*)::int from workspace_settings where artist_id = ${artistId}::uuid) as workspaces,
        (select count(*)::int from artist_memberships where artist_id = ${artistId}::uuid and auth_user_id = ${userId}) as memberships,
        (select count(*)::int from audit_events where artist_id = ${artistId}::uuid and trace_id = ${traceId}) as audits,
        (select count(*)::int from outbox_events where artist_id = ${artistId}::uuid and correlation_id = ${traceId} and causation_id = ${commandId}) as outbox
    `);

    expect(evidence.rows[0]).toMatchObject({ artists: 1, workspaces: 1, memberships: 1, audits: 1, outbox: 1 });

    const consumer = new PgOutboxConsumer(db);
    const consumed = await consumer.consumeNext("stage0-integration");
    expect(consumed).toMatchObject({ eventType: "ArtistCreated", artistId, correlationId: traceId, duplicate: false });

    const inbox = await db.execute(sql`
      select
        (select count(*)::int from consumer_inbox where consumer = 'stage0-integration') as inbox,
        (select count(*)::int from outbox_events where artist_id = ${artistId}::uuid and published_at is not null) as published
    `);
    expect(inbox.rows[0]).toMatchObject({ inbox: 1, published: 1 });
  });

  it("replays the same user idempotently without duplicating artist or outbox state", async () => {
    const userId = `user-${crypto.randomUUID()}`;
    const idempotencyKey = `idem-${crypto.randomUUID()}`;
    const firstArtistId = crypto.randomUUID();
    const service = new CreateArtistService(new PgArtistWorkspaceWriter(db));

    const first = await service.execute(artistCommand, {
      commandId: crypto.randomUUID(),
      artistId: firstArtistId,
      actor: { type: "USER", id: userId },
      requestedAt: new Date(),
      traceId: `trace-${crypto.randomUUID()}`,
      idempotencyKey
    });
    const replay = await service.execute(artistCommand, {
      commandId: crypto.randomUUID(),
      artistId: crypto.randomUUID(),
      actor: { type: "USER", id: userId },
      requestedAt: new Date(),
      traceId: `trace-${crypto.randomUUID()}`,
      idempotencyKey
    });

    expect(first).toMatchObject({ status: "SUCCESS", data: { artistId: firstArtistId, replayed: false } });
    expect(replay).toMatchObject({ status: "SUCCESS", data: { artistId: firstArtistId, replayed: true } });

    const counts = await db.execute(sql`
      select
        (select count(*)::int from artist_memberships where auth_user_id = ${userId}) as memberships,
        (select count(*)::int from outbox_events where artist_id = ${firstArtistId}::uuid) as outbox,
        (select count(*)::int from audit_events where artist_id = ${firstArtistId}::uuid) as audits
    `);
    expect(counts.rows[0]).toMatchObject({ memberships: 1, outbox: 1, audits: 1 });
  });

  it("does not allow an idempotency key to replay another user's artist scope", async () => {
    const sharedClientKey = `client-key-${crypto.randomUUID()}`;
    const userA = `user-a-${crypto.randomUUID()}`;
    const userB = `user-b-${crypto.randomUUID()}`;
    const artistA = crypto.randomUUID();
    const artistB = crypto.randomUUID();
    const service = new CreateArtistService(new PgArtistWorkspaceWriter(db));

    const resultA = await service.execute(artistCommand, {
      commandId: crypto.randomUUID(), artistId: artistA, actor: { type: "USER", id: userA }, requestedAt: new Date(), traceId: `trace-${crypto.randomUUID()}`, idempotencyKey: sharedClientKey
    });
    const resultB = await service.execute(artistCommand, {
      commandId: crypto.randomUUID(), artistId: artistB, actor: { type: "USER", id: userB }, requestedAt: new Date(), traceId: `trace-${crypto.randomUUID()}`, idempotencyKey: sharedClientKey
    });

    expect(resultA).toMatchObject({ status: "SUCCESS", data: { artistId: artistA, replayed: false } });
    expect(resultB).toMatchObject({ status: "SUCCESS", data: { artistId: artistB, replayed: false } });

    const scopeReader = new PgArtistScopeReader(db);
    await expect(scopeReader.findArtistIdByAuthUserId(userA)).resolves.toBe(artistA);
    await expect(scopeReader.findArtistIdByAuthUserId(userB)).resolves.toBe(artistB);
  });

  it("deduplicates durable job enqueue by type and idempotency key", async () => {
    const queue = new PgJobQueue(db);
    const idempotencyKey = `job-${crypto.randomUUID()}`;
    const first = await queue.enqueue({ type: "STAGE0_IDEMPOTENT", idempotencyKey, correlationId: `trace-${crypto.randomUUID()}` });
    const second = await queue.enqueue({ type: "STAGE0_IDEMPOTENT", idempotencyKey, correlationId: `trace-${crypto.randomUUID()}` });

    expect(second).toBe(first);
    const count = await db.execute(sql`select count(*)::int as count from jobs where type = 'STAGE0_IDEMPOTENT' and idempotency_key = ${idempotencyKey}`);
    expect(count.rows[0]).toMatchObject({ count: 1 });

    await queue.requestCancellation(first);
    const cancelled = await db.execute(sql`select status, cancel_requested as "cancelRequested" from jobs where id = ${first}::uuid`);
    expect(cancelled.rows[0]).toMatchObject({ status: "CANCELLED", cancelRequested: true });
  });

  it("reclaims an expired running lease without losing correlation", async () => {
    const queue = new PgJobQueue(db);
    const correlationId = `trace-${crypto.randomUUID()}`;
    const jobId = await queue.enqueue({ type: "STAGE0_LEASE_RECOVERY", correlationId });

    const first = await queue.claim("worker-lease-a", 60);
    expect(first).toMatchObject({ id: jobId, correlationId, attemptCount: 1 });
    await db.execute(sql`update jobs set locked_at = now() - interval '120 seconds' where id = ${jobId}::uuid`);

    const reclaimed = await queue.claim("worker-lease-b", 60);
    expect(reclaimed).toMatchObject({ id: jobId, correlationId, attemptCount: 2 });
    if (!reclaimed) throw new Error("reclaimed job missing");
    await queue.complete(reclaimed.id, "worker-lease-b");

    const status = await db.execute(sql`select status from jobs where id = ${jobId}::uuid`);
    expect(status.rows[0]).toMatchObject({ status: "SUCCEEDED" });
  });

  it("supports permanent failure and cooperative running cancellation states", async () => {
    const queue = new PgJobQueue(db);

    const failedId = await queue.enqueue({ type: "STAGE0_PERMANENT_FAILURE", correlationId: `trace-${crypto.randomUUID()}` });
    const failedClaim = await queue.claim("worker-failed");
    expect(failedClaim?.id).toBe(failedId);
    if (!failedClaim) throw new Error("permanent failure claim missing");
    await queue.failPermanently(failedClaim.id, "worker-failed");

    const cancelId = await queue.enqueue({ type: "STAGE0_RUNNING_CANCEL", correlationId: `trace-${crypto.randomUUID()}` });
    const cancelClaim = await queue.claim("worker-cancel");
    expect(cancelClaim?.id).toBe(cancelId);
    if (!cancelClaim) throw new Error("cancellation claim missing");
    await queue.requestCancellation(cancelId);
    await expect(queue.isCancellationRequested(cancelId)).resolves.toBe(true);
    await queue.cancelRunning(cancelId, "worker-cancel");

    const states = await db.execute(sql`
      select id, status from jobs where id in (${failedId}::uuid, ${cancelId}::uuid) order by id
    `);
    const byId = Object.fromEntries(states.rows.map((row) => [String((row as { id: string }).id), String((row as { status: string }).status)]));
    expect(byId[failedId]).toBe("FAILED");
    expect(byId[cancelId]).toBe("CANCELLED");
  });

  it("retries durable jobs and dead-letters after max attempts", async () => {
    const queue = new PgJobQueue(db);
    const correlationId = `trace-${crypto.randomUUID()}`;
    const jobId = await queue.enqueue({
      type: "STAGE0_NOOP",
      correlationId,
      maxAttempts: 2
    });

    const first = await queue.claim("worker-a");
    expect(first).toMatchObject({ id: jobId, correlationId, attemptCount: 1 });
    if (!first) throw new Error("first job claim missing");
    await queue.fail(first, "worker-a", 0);

    const second = await queue.claim("worker-b");
    expect(second).toMatchObject({ id: jobId, correlationId, attemptCount: 2 });
    if (!second) throw new Error("second job claim missing");
    await queue.fail(second, "worker-b", 0);

    const status = await db.execute(sql`select status from jobs where id = ${jobId}::uuid`);
    expect(status.rows[0]).toMatchObject({ status: "DEAD_LETTER" });
  });
});
