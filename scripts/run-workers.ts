import { noteWorker, emailWorker } from "../src/lib/queue/worker";
import { logger } from "../src/lib/logger";

logger.info("Starting Background Workers...");

noteWorker.on("ready", () => logger.info("✅ Note Worker Ready"));
emailWorker.on("ready", () => logger.info("✅ Email Worker Ready"));

process.on("SIGINT", async () => {
  logger.info("Shutting down workers...");
  await Promise.all([noteWorker.close(), emailWorker.close()]);
  process.exit(0);
});
