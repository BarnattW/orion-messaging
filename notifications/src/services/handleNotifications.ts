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
    await consumer.subscribe({ topic: 'user-created', fromBeginning: true });
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(message.value?.toString())
        //@ts-ignore
        const parseMessage = JSON.parse(message.value?.toString());
        console.log(parseMessage);
        const { messageType } = parseMessage;
        if (parseMessage){
          if (topic === "user-created"){
            const newUser = new User();
            //@ts-ignore
            newUser.userId = parseMessage.userId; //assuming message is a json with userId
            newUser.save();
            console.log("user created");
            console.log(newUser);
        }
        }
        if (messageType){   
            if (topic === "friends" && messageType === "requestCreated"){
                const {receiverId, senderUsername, } = parseMessage.value;
                console.log("receiverId: ", receiverId);
                const receiver = await User.findOne({userId: receiverId});
                console.log("friend request sent")
                console.log(receiver);
                console.log("-----", receiver?.receiveNotifications)
                if (receiver && receiver.receiveNotifications){
                  console.log("step 2")
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
                  console.log(notifi);
                  await sendNotification(receiverId, notifi, "friendRequestReceived");
                } 
            }
            if (topic === "groups" && messageType === "requestCreated"){
                const {receiverId, senderUsername, groupName} = parseMessage;
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
                const {message, conversationName, receiverIds, senderUsername} = parseMessage;
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


  
