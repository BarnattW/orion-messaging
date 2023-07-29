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

export async function handleGroups() {

    await consumer.connect();
    await consumer.subscribe({ topic: 'groups', fromBeginning: true });
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        //@ts-ignore
        const parseMessage = JSON.parse(message.value?.toString());
        const { messageType, value } = parseMessage;

        if (messageType && value){   
            if (topic === "groups" && messageType === "requestCreated"){
                const {receiverId, senderUsername, groupName} = value;
                const receiver = await User.findOne({userId: receiverId});
                if (receiver && receiver.receiveNotifications){
                  if (!receiver.onlineStatus){
                    const notifi = new Notifications();
                    notifi.message = `${senderUsername} invited you to ${groupName}`;
                    notifi.type = "groups"
                    notifi.receiverId = receiverId;
                    notifi.conversationName = groupName;
                    notifi.save();
                    console.log(notifi);
                  }
                  const notifi = {
                    senderUsername: senderUsername,
                    receiverId: receiverId,
                    type: NotificationType.Groups,
                    conversationName: senderUsername,
                    message: `${senderUsername} invited you to ${groupName}`
                  }
                  await sendNotification(receiverId, notifi, "groupRequestReceived");
                } 
            }
        }
      },
    });
  }


  

