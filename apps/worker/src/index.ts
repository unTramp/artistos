import { PgJobQueue, PgOutboxConsumer, createDatabase, type ClaimedJob } from "@artist-os/db";
import { createLogger, getRuntimeEnv } from "@artist-os/infrastructure";

const env = getRuntimeEnv();
const logger = createLogger({ service: "worker" });
const runtime = createDatabase(env.DATABASE_URL);
const queue = new PgJobQueue(runtime.db);
const outbox = new PgOutboxConsumer(runtime.db);
const workerId = `worker-${process.pid}-${crypto.randomUUID()}`;
const outboxConsumerName = "stage0-worker";
let stopping = false;

const handlers: Record<string, (job: ClaimedJob) => Promise<void>> = {
  STAGE0_NOOP: async (job) => {
    logger.info({ operation: "job.stage0_noop", traceId: job.correlationId, jobId: job.id }, "Stage 0 no-op job executed");
  }
};

async function processOutboxOnce() {
  const event = await outbox.consumeNext(outboxConsumerName);
  if (!event) return false;

  logger.info(
    {
      operation: "outbox.consumed",
      traceId: event.correlationId,
      eventId: event.id,
      eventType: event.eventType,
      artistId: event.artistId,
      duplicate: event.duplicate
    },
    "Outbox event consumed"
  );
  return true;
}

async function processJobOnce() {
  const job = await queue.claim(workerId);
  if (!job) return false;

  try {
    const handler = handlers[job.type];
    if (!handler) throw new Error(`No handler registered for ${job.type}`);
    await handler(job);
    await queue.complete(job.id, workerId);
  } catch (error) {
    logger.error({ operation: "job.failed", traceId: job.correlationId, jobId: job.id, error: error instanceof Error ? error.message : "Unknown error" }, "Job failed");
    await queue.fail(job, workerId);
  }
  return true;
}

async function runLoop() {
  logger.info({ operation: "worker.boot", workerId }, "Artist OS worker started");
  while (!stopping) {
    const consumedEvent = await processOutboxOnce();
    const processedJob = await processJobOnce();
    if (!consumedEvent && !processedJob) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

async function shutdown(signal: string) {
  stopping = true;
  logger.info({ operation: "worker.shutdown", signal, workerId }, "Artist OS worker stopping");
  await runtime.close();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
void runLoop().catch(async (error) => {
  logger.fatal({ operation: "worker.crash", error: error instanceof Error ? error.message : "Unknown error" }, "Worker crashed");
  await runtime.close();
  process.exit(1);
});
