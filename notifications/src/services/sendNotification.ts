import { getSocketIdForUser } from "../utils/biDirectionalMap";
import {io} from "../index";
import { INotification } from "../models/notifications";


export async function sendNotification(receiverId: string, notification: INotification, type: string) {
    try {
      const socketId = await getSocketIdForUser(receiverId);
      console.log(socketId);
      if (socketId) {
        console.log('I LOVE SOCKETS');
        io.to(socketId).emit(type, notification);
      } else {
        console.log(`No socket found for receiver ID ${receiverId}`);
      }
    } catch (error) {
      console.error('Error emitting event:', error);
    }
}

export async function sendCachedNotifications(receiverId: string, notifications: Array<INotification>, type: string){
  try {
    const socketId = await getSocketIdForUser(receiverId);
    if (socketId) {
      io.to(socketId).emit(type, notifications);
    } else {
      console.log(`No socket found for receiver ID ${receiverId}`);
    }
  } catch (error) {
    console.error('Error emitting event:', error);
  }
}