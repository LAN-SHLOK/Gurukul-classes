import { Queue } from "bullmq";
import Redis from "ioredis";

// Centralized Redis connection options
const redisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  tls: process.env.REDIS_HOST?.includes("upstash.io") ? {} : undefined, // Enable TLS for Upstash
};

// Singleton Redis connection shared by all queues and workers
export const redisConnection = new Redis(redisOptions);

// Initialize queues with the shared connection
export const noteQueue = new Queue("note-generation", { connection: redisConnection });
export const emailQueue = new Queue("email-notifications", { connection: redisConnection });
