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
                    const notifi = new Notifications();
                    notifi.message = `You have a new friend request from ${senderUsername}`;
                    notifi.type = "friends"
                    notifi.receiverId = receiverId;
                    notifi.conversationName = senderUsername;
                    notifi.save();
                    console.log(notifi);
                  }
                  const notifi = {
                    senderUsername: senderUsername,
                    receiverId: receiverId,
                    type: NotificationType.Friends,
                    conversationName: senderUsername,
                    message: `You have a new friend request from ${senderUsername}`
                  }
                  await sendNotification(receiverId, notifi, "friendRequestReceived");
                } 
            }
        }
      },
    });
  }


  

