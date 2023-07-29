import { redisClient } from "../redis/redis";

export function addToMap(userId: string, socketId: string) {
    try {
      redisClient.sadd("usersToSockets", userId, socketId);
      redisClient.sadd("socketsToUsers", socketId, userId);
      console.log(`Bidirectional map for userId: ${userId} and socketId: ${socketId}`);
    } catch (error) {
      console.error('Error adding to bidirectional map:', error);
    }
  }
  
  export async function getSocketIdForUser(userId: string){
    try {
      const members = await redisClient.smembers("usersToSockets");
  
      for (const member of members) {
        if (member.includes(userId)) {
          const socketId = member.split(":")[1];
          console.log(`Socket ID for userId ${userId}:`, socketId);
          return socketId;
        }
      }
  
      console.log(`No socket found for userId ${userId}`);
      return null;
    } catch (error) {
      console.error('Error retrieving socketId:', error);
      return null;
    }
  }
  
  export async function getUserIdForSocket(socketId: string){
    try {
      const members = await redisClient.smembers("socketsToUsers");
  
      for (const member of members) {
        if (member.includes(socketId)) {
          const userId = member.split(":")[0];
          console.log(`User ID for socketId ${socketId}:`, userId);
          return userId;
        }
      }
  
      console.log(`No userId found for socketId ${socketId}`);
      return null;
    } catch (error) {
      console.error('Error retrieving userId:', error);
      return null;
    }
  }
  
  export function removeFromMap(userId: string, socketId: string) {
    try {
      redisClient.srem("usersToSockets", userId, socketId);
      redisClient.srem("socketsToUsers", socketId, userId);
      console.log(`Bidirectional mapping removed for userId: ${userId} and socketId: ${socketId}`);
    } catch (error) {
      console.error('Error removing bidirectional mapping:', error);
    }
  }