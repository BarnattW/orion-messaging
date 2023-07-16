import Redis from 'ioredis';
import { User } from '../models/user';

const redisClient = new Redis({
    host: 'localhost',
    port: 6379
});

redisClient.config('SET', 'maxmemory', '256mb');
redisClient.config('REWRITE');
redisClient.quit();


const maxSize = 100;
const cacheKey = 'userCache';

export async function getUsername(userId: string){
    // Check the cache for the username
    const cachedUsername = await redisClient.hget('usernames', userId);
  
    if (cachedUsername) {
      // If the username is found in the cache, return it
      await updateRank(userId);
      return cachedUsername;
    }
  
    // Cache miss - fetch the username from the data source
    const user = await User.findOne({userId: userId});
  
    if (user) {
      // Set the fetched username in the cache
      await setUsername(userId, user.username);
      return user.username;
    }
}

export async function setUsername(userId: string, username: string){
    // Check if the username already exists in the cache
    const existingUsername = await redisClient.hget('usernames', userId);
  
    if (existingUsername) {

        await redisClient.hset('usernames', userId, username);
        await updateRank(userId);

    } else {
        
        await redisClient.hset('usernames', userId, username);
        await updateRank(userId);
  
        const cacheSize = await redisClient.zcard(cacheKey);
        
    if (cacheSize > maxSize) {
        await removeLRUItem(cacheSize - maxSize);
    }
    }
}

async function updateRank(userId: string){
    await redisClient.zadd(cacheKey, Date.now(), userId);
}

async function removeLRUItem(count: number){
    await redisClient.zremrangebyrank(cacheKey, 0, count - 1);
}

async function clearCache(){
    await redisClient.del(cacheKey, 'usernames');
}
