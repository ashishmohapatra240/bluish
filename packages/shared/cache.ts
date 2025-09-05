import { Redis } from "ioredis";

export const redis = new Redis({
  host: "localhost",
  port: 6379,
});
    
export const cacheWrapper = {
  set: async (key: string, value: any, ttl?: number) => {
    const serializedValue = JSON.stringify(value);
    if (ttl) await redis.set(key, serializedValue, "EX", ttl);
    else await redis.set(key, serializedValue);
  },
  get: async <T>(key: string): Promise<T | null> => {        //<T> declares the type parameter T
    const serializedValue = await redis.get(key);            //Promise<T | null> uses the declared type parameter T to define the return type
    if (!serializedValue) return null;
    return JSON.parse(serializedValue);
  },
};
