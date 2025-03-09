import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

export const redisConnect = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log("Redis client connected");
  } catch (error) {
    console.error(`Redis Error: ${error}`);
  }
};

export default redisClient;
