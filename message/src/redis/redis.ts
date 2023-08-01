import { Redis } from "ioredis";

export const redis = new Redis({
	host: process.env.REDIS_HOST,
	port: 6379,
});

redis.ping((e) => {
	if (e) {
		console.log("Error Connecting to Redis:", e);
	} else {
		console.log("Redis Connected");
	}
});
