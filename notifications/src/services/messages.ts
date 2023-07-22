import { redisClient } from '../redis/redis';
import { consumer } from '../kafka/kafka_consumer';
import { getKeySocketPairs } from '../utils/sockets';
import { User } from '../models/user';

import { Notification } from '../models/notifications';

export async function handleMessages() {

    await consumer.connect();
    await consumer.subscribe({ topic: 'messages', fromBeginning: true });
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        //@ts-ignore
        const parseMessage = JSON.parse(message.value?.toString());
        const { messageType, value } = parseMessage;

        if (messageType && value){   
            if (topic === "messages" && messageType === "send"){
                const {message, conversationName, receiverIds} = value;
                const truncatedMessage = message.length > 50 ? message.slice(0, 50) + " ..." : message;
                const receivers = await User.find({ userId: { $in: receiverIds } });
                receivers.forEach(async (receiver) => {
                  if (receiver && receiver.receiveNotifications){
                    if (!receiver.onlineStatus){
                      const notifi = new Notification();
                      notifi.message = `You have a new message in ${conversationName} \n ${truncatedMessage}`;
                      notifi.type = "messages"
                      notifi.save();
                      console.log(notifi);
                    }
                    await sendMessageNotification(receiver.userId, `You have a new message in ${conversationName} \n ${truncatedMessage}`);
                  } 
                });
                
            }
        }
      },
    });
  }


  export async function sendMessageNotification(receiverId: string, message: string) {

    try {
      const socketInfo = await getKeySocketPairs(receiverId, "notification");
      if (socketInfo) {
        socketInfo.emit("messageReceived", message);
        console.log(`message received for receiver ID ${receiverId}`);
      } else {
        console.log(`No socket found for receiver ID ${receiverId}`);
      }
    } catch (error) {
      console.error('Error emitting event:', error);
    }
  }

