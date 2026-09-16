import { createLogger } from "@artist-os/infrastructure";

const logger = createLogger({ service: "worker" });
logger.info({ operation: "worker.boot" }, "Artist OS worker started");

const shutdown = (signal: string) => {
  logger.info({ operation: "worker.shutdown", signal }, "Artist OS worker stopping");
  process.exit(0);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
setInterval(() => undefined, 30_000).unref();
