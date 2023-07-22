import { redisClient } from "../redis/redis";
import {Socket} from "socket.io";

import { sendFriendRequestNotification } from "../services/friendrequests";
import { Notification } from "../models/notifications";


export function storeKeySocketPair(userId: string, key: string, socket: string) {
  try{
    const store = redisClient.hset(`user:${userId}`, key, socket);
    console.log(`Key-socket pair stored for user ID ${userId}`);
  } catch(error){
        console.error('Error storing key-socket pair:', error);
  }
};


export async function getKeySocketPairs(userId: string, key: string) {
  try{
    const socketString = await redisClient.hget(`user:${userId}`, key)
    if (socketString) {
      const socket = JSON.parse(socketString) as Socket;
      console.log(`Socket for user ID ${userId}:`, socket);
      return socket;
    } else {
      console.log(`No socket found for user ID ${userId}`);
    }
  }catch(error){
    console.error('Error retrieving socket:', error);
  }
};

export async function removeSocketForUser(userId: string, key: string) {
  try {
    const deleted = await redisClient.hdel(userId, key);
    if (deleted) {
      console.log(`Key-socket pair deleted for user ${userId}`);
    } else {
      console.log(`No matching key-socket pair found for user ${userId}`);
    }
  } catch (error) {
    console.error(`Error deleting key-socket pair: ${error}`);
  }

};

export async function pullNotificationsForUser(userId: string) {
  try {
    const cached = await Notification.find({ receiverId: userId });

    if (!cached) {
      console.log("no notifications");
      return;
    }

    cached.forEach((Element) => {
      switch(Element.type){
        case 'friends':
          sendFriendRequestNotification(Element.receiverId.toString(), Element.message);
          Notification.findByIdAndDelete(Element._id);
          break;
        case 'groups':
          break;
        case 'messages':
          break;
      }

    });

  } catch (error) {
    console.error(error);
  }
}

