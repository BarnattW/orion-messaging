import { Redis } from "ioredis";

export const redis = new Redis({
	host: process.env.REDIS_HOST,
	port: 6379,
});

redis.config("SET", "maxmemory", "256mb");
redis.config("REWRITE");
