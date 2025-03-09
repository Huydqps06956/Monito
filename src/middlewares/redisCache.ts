import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

export const cacheMiddleware = (expireTime = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        const data = JSON.parse(cachedData);
        return res.json(data);
      }

      // Store the original res.json method
      const originalJson = res.json;

      // Override res.json method
      res.json = function (body) {
        // Cache response
        redisClient.set(key, JSON.stringify(body), {
          EX: expireTime,
        });

        // Call original json method with the body
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error("Redis cache error:", error);
      next();
    }
  };
};

// Clear cache when data is modified
export const clearCache = async (pattern: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cache cleared for pattern: ${pattern}`);
    }
  } catch (error) {
    console.error("Cache clearing error:", error);
  }
};
