import { redisClient } from '../redis/redis';
import { consumer } from '../kafka/kafka_consumer';
import { getKeySocketPairs } from '../utils/sockets';
import { User } from '../models/user';

import { Notification } from '../models/notifications';

export async function handleFriends() {

    await consumer.connect();
    await consumer.subscribe({ topic: 'friends', fromBeginning: true });
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        //@ts-ignore
        const parseMessage = JSON.parse(message.value?.toString());
        const { messageType, value } = parseMessage;

        if (messageType && value){   
            if (topic === "friends" && messageType === "requestCreated"){
                const {receiverId, senderUsername, } = value;
                const receiver = await User.findOne({userId: receiverId});
                if (receiver && receiver.receiveNotifications){
                  if (!receiver.onlineStatus){
                    const notifi = new Notification();
                    notifi.message = `You have a new friend request from ${senderUsername}`;
                    notifi.type = "friends"
                    notifi.save();
                    console.log(notifi);
                  }
                  await sendFriendRequestNotification(receiverId, `You have a new friend request from ${senderUsername}`);
                } 
            }
        }
      },
    });
  }


  export async function sendFriendRequestNotification(receiverId: string, message: string) {

    try {
      const socketInfo = await getKeySocketPairs(receiverId, "notification");
      if (socketInfo) {
        socketInfo.emit("friendRequestReceived", message);
        console.log(`friend request received for receiver ID ${receiverId}`);
      } else {
        console.log(`No socket found for receiver ID ${receiverId}`);
      }
    } catch (error) {
      console.error('Error emitting event:', error);
    }
  }

