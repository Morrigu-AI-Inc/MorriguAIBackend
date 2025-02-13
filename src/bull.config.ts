import { QueueOptions } from 'bullmq';

export const bullConfig: QueueOptions = {
  connection: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
};