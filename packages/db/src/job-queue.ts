import { sql } from "drizzle-orm";
import type { Stage0Database } from "./runtime";

export interface ClaimedJob {
  id: string;
  type: string;
  artistId: string | null;
  payloadVersion: number;
  payload: unknown;
  attemptCount: number;
  maxAttempts: number;
  correlationId: string;
  causationId: string | null;
  cancelRequested: boolean;
}

export class PgJobQueue {
  constructor(private readonly db: Stage0Database) {}

  async enqueue(input: {
    type: string;
    artistId?: string;
    payload?: unknown;
    payloadVersion?: number;
    idempotencyKey?: string;
    maxAttempts?: number;
    correlationId: string;
    causationId?: string;
  }) {
    const rows = await this.db.execute(sql`
      insert into jobs (
        artist_id, type, payload, payload_version, idempotency_key,
        max_attempts, correlation_id, causation_id, status
      ) values (
        ${input.artistId ?? null}, ${input.type}, ${JSON.stringify(input.payload ?? {})}::jsonb,
        ${input.payloadVersion ?? 1}, ${input.idempotencyKey ?? null}, ${input.maxAttempts ?? 5},
        ${input.correlationId}, ${input.causationId ?? null}, 'QUEUED'
      )
      on conflict (type, idempotency_key)
      do update set type = excluded.type
      returning id
    `);
    return String((rows.rows[0] as { id: string }).id);
  }

  async claim(workerId: string, leaseSeconds = 60): Promise<ClaimedJob | null> {
    return this.db.transaction(async (tx) => {
      const selected = await tx.execute(sql`
        select id
        from jobs
        where status in ('QUEUED', 'RUNNING')
          and coalesce(next_attempt_at, now()) <= now()
          and cancel_requested = false
          and (status = 'QUEUED' or locked_at < now() - (${leaseSeconds} * interval '1 second'))
        order by created_at asc
        for update skip locked
        limit 1
      `);
      const row = selected.rows[0] as { id?: string } | undefined;
      if (!row?.id) return null;

      const claimed = await tx.execute(sql`
        update jobs
        set status = 'RUNNING',
            locked_at = now(),
            locked_by = ${workerId},
            started_at = coalesce(started_at, now()),
            attempt_count = attempt_count + 1
        where id = ${row.id}::uuid
        returning
          id, type, artist_id as "artistId", payload_version as "payloadVersion", payload,
          attempt_count as "attemptCount", max_attempts as "maxAttempts",
          correlation_id as "correlationId", causation_id as "causationId",
          cancel_requested as "cancelRequested"
      `);
      return (claimed.rows[0] as ClaimedJob | undefined) ?? null;
    });
  }

  async heartbeat(jobId: string, workerId: string) {
    await this.db.execute(sql`
      update jobs set locked_at = now()
      where id = ${jobId}::uuid and status = 'RUNNING' and locked_by = ${workerId}
    `);
  }

  async complete(jobId: string, workerId: string) {
    await this.db.execute(sql`
      update jobs
      set status = 'SUCCEEDED', finished_at = now(), locked_at = null, locked_by = null
      where id = ${jobId}::uuid and status = 'RUNNING' and locked_by = ${workerId}
    `);
  }

  async fail(job: ClaimedJob, workerId: string, retryDelaySeconds = 15) {
    const exhausted = job.attemptCount >= job.maxAttempts;
    await this.db.execute(sql`
      update jobs
      set status = ${exhausted ? "DEAD_LETTER" : "QUEUED"},
          next_attempt_at = ${exhausted ? null : new Date(Date.now() + retryDelaySeconds * 1000)},
          finished_at = ${exhausted ? new Date() : null},
          locked_at = null,
          locked_by = null
      where id = ${job.id}::uuid and status = 'RUNNING' and locked_by = ${workerId}
    `);
  }

  async failPermanently(jobId: string, workerId: string) {
    await this.db.execute(sql`
      update jobs
      set status = 'FAILED', finished_at = now(), locked_at = null, locked_by = null
      where id = ${jobId}::uuid and status = 'RUNNING' and locked_by = ${workerId}
    `);
  }

  async requestCancellation(jobId: string) {
    await this.db.execute(sql`
      update jobs
      set cancel_requested = true,
          status = case when status = 'QUEUED' then 'CANCELLED' else status end,
          finished_at = case when status = 'QUEUED' then now() else finished_at end
      where id = ${jobId}::uuid and status in ('QUEUED', 'RUNNING')
    `);
  }

  async isCancellationRequested(jobId: string): Promise<boolean> {
    const result = await this.db.execute(sql`
      select cancel_requested as "cancelRequested"
      from jobs
      where id = ${jobId}::uuid
      limit 1
    `);
    return Boolean((result.rows[0] as { cancelRequested?: boolean } | undefined)?.cancelRequested);
  }

  async cancelRunning(jobId: string, workerId: string) {
    await this.db.execute(sql`
      update jobs
      set status = 'CANCELLED', cancel_requested = true, finished_at = now(), locked_at = null, locked_by = null
      where id = ${jobId}::uuid and status = 'RUNNING' and locked_by = ${workerId}
    `);
  }
}
