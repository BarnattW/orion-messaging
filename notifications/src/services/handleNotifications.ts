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

export async function handleNotifications() {

    await consumer.connect();
    await consumer.subscribe({ topic: 'friends', fromBeginning: true });
    await consumer.subscribe({ topic: 'messages', fromBeginning: true });
    await consumer.subscribe({ topic: 'groups', fromBeginning: true });
  
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


  
