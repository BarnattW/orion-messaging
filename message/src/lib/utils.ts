import { Socket } from "socket.io";
import { IConversation } from "../models/Conversation";
import { redis } from "../redis/redis";

export async function socketsInConversation(
  conv: IConversation,
) {
  try {
    const usersInConversation = conv.users;
    const pipeline = redis.pipeline();
    usersInConversation.forEach((userId) => {
      console.log(`${userId}`)
      pipeline.smembers(`${userId}:sockets:message`);
    })
    const results = await pipeline.exec();

    if (results == null) {
      console.log("Pipeline execution failed or no commands queued.");
      return;
    }
    console.log(results)
    const socketIds = results.map((result) => result[1]) as (string | null)[];
    const validSockets = socketIds.filter((socketId: string | null) => socketId != null)
    const flattendArray = validSockets.flat();
    console.log("socket: ", flattendArray)
    return flattendArray;
  } catch (e) {
    console.log('Unable to get sockets')
  }
}
 