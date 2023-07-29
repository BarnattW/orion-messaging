import { redisClient } from '../redis/redis';
import { consumer } from '../kafka/kafka_consumer';
import { User } from '../models/user';
import { sendNotification } from './sendNotification';
import { Notifications } from '../models/notifications';

enum NotificationType {
  Friends = "friends",
  Messages = "messages",
  Groups = "groups",
}

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
                const {message, conversationName, receiverIds, senderUsername} = value;
                const receivers = await User.find({ userId: { $in: receiverIds } });
                receivers.forEach(async (receiver) => {
                  if (receiver && receiver.receiveNotifications){
                    if (!receiver.onlineStatus){
                      const notifi = new Notifications();
                      notifi.message = message;
                      notifi.type = "messages"
                      notifi.receiverId = receiver.userId;
                      notifi.conversationName = conversationName;
                      notifi.save();
                      console.log(notifi);
                    }
                    const notifi = {
                      senderUsername: senderUsername,
                      receiverId: receiver.userId,
                      type: NotificationType.Messages,
                      conversationName: conversationName,
                      message: message
                    }
                    await sendNotification(receiver.userId, notifi, "messageReceived");
                  } 
                });
                
            }
        }
      },
    });
  }


