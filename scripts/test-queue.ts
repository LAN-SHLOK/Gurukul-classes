import { emailQueue } from "../src/lib/queue/client";
import { logger } from "../src/lib/logger";

async function test() {
  logger.info("Adding test job to Email Queue...");
  
  await emailQueue.add("test-inquiry-job", {
    firstName: "Test",
    lastName: "User",
    email: "shlokpatel699@gmail.com",
    className: "Class 12",
    message: "This is a test of the Async Processing system!"
  });

  logger.info("✅ Job Added. Check the worker terminal!");
  process.exit(0);
}

test();
