import { redisClient } from '../redis/redis';
import { consumer } from '../kafka/kafka_consumer';
import { User } from '../models/user';
import { sendNotification } from './sendNotification';
import { Notifications } from '../models/notifications';

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
        const { messageType, value } = parseMessage;
        if (value){
          if (topic === "user-created"){
            const newUser = new User();
            //@ts-ignore
            newUser.userId = message.value.userId; //assuming message is a json with userId
            newUser.save();
            console.log("user created");
        }
        }
        if (messageType && value){   
            if (topic === "friends" && messageType === "requestCreated"){
                const {receiverId, senderUsername, } = value;
                const receiver = await User.findOne({userId: receiverId});
                if (receiver && receiver.receiveNotifications){
                  const notifi = new Notifications();
                    notifi.message = `You have a new friend request from ${senderUsername}`;
                    notifi.type = "friends"
                    notifi.receiverId = receiverId;
                    notifi.conversationName = senderUsername;
                    notifi.save();
                    console.log(notifi);
                  if (receiver.onlineStatus){
                    await sendNotification(receiverId, notifi, "friendRequestReceived");
                  }
                } 
            }
            if (topic === "groups" && messageType === "requestCreated"){
                const {receiverId, senderUsername, groupName} = value;
                const receiver = await User.findOne({userId: receiverId});
                if (receiver && receiver.receiveNotifications){
                  const notifi = new Notifications();
                    notifi.message = `${senderUsername} invited you to ${groupName}`;
                    notifi.type = "groups"
                    notifi.receiverId = receiverId;
                    notifi.conversationName = groupName;
                    notifi.save();
                    console.log(notifi);
                  if (receiver.onlineStatus){
                    await sendNotification(receiverId, notifi, "groupRequestReceived");
                  }
                } 
            }
            if (topic === "messages" && messageType === "send"){
                const {message, conversationName, receiverIds, senderUsername} = value;
                const receivers = await User.find({ userId: { $in: receiverIds } });
                receivers.forEach(async (receiver) => {
                  if (receiver && receiver.receiveNotifications){
                      const notifi = new Notifications();
                      notifi.message = message;
                      notifi.type = "messages"
                      notifi.receiverId = receiver.userId;
                      notifi.conversationName = conversationName;
                      notifi.save();
                      console.log(notifi);
                    if (receiver.onlineStatus){
                      await sendNotification(receiver.userId, notifi, "messageReceived");
                    }
                    
                  } 
                });
                
            }
        }
      },
    });
  }


  
