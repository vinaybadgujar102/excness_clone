import { Job, Worker } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis({ maxRetriesPerRequest: null });

console.log("connection");

const processJob = (job: Job) => {
  console.log("processing job", job.data);
};

const worker = new Worker(
  "bookTicker",
  async (job) => {
    processJob(job);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});
