
import { redisClient } from '../redis/redis';
import { consumer } from '../kafka/kafka_consumer';
import { User } from '../models/user';
import { sendNotification, sendSocketEvent } from './sendNotification';
import { Notifications } from '../models/notifications';

export async function handleNotifications() {
	await consumer.connect();
	await consumer.subscribe({ topic: "friends", fromBeginning: true });
	await consumer.subscribe({ topic: "messages", fromBeginning: true });
	await consumer.subscribe({ topic: "groups", fromBeginning: true });
	await consumer.subscribe({ topic: "user-created", fromBeginning: true });

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
                const {receiverId, senderId, _id} = parseMessage.value;
                console.log("receiverId: ", receiverId);
                const receiver = await User.findOne({userId: receiverId});
                console.log("friend request sent")
                console.log(receiver);
                console.log("-----", receiver?.receiveNotifications)
                if (receiver && receiver.receiveNotifications){
                    const notifi = new Notifications();
                    notifi.requestId = _id;
                    notifi.timestamp = new Date();
                    notifi.senderId = senderId;
                    notifi.type = "friends";
                    notifi.receiverId = receiverId;
                    notifi.save();
                    console.log(notifi);
                if (receiver.onlineStatus){
                  await sendNotification(receiverId, notifi, "friendRequestReceived");
                }
                } 
            }
            if (topic === "groups" && messageType === "requestCreated"){
                const {receiverId, senderId, groupName, _id} = parseMessage;
                const receiver = await User.findOne({userId: receiverId});
                if (receiver && receiver.receiveNotifications){
                    const notifi = new Notifications();
                    notifi.requestId = _id;
                    notifi.timestamp = new Date();
                    notifi.senderId = senderId;
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
                const {timestamp, senderId, message, conversationName, conversationId} = parseMessage;
                const receivers = await User.find({ userId: { $in: message.receiverIds } });
                receivers.forEach(async (receiver) => {
                  if (receiver && receiver.receiveNotifications){
                      const notifi = new Notifications();
                      notifi.conversationId = conversationId;
                      notifi.timestamp = timestamp;
                      notifi.message = message;
                      notifi.type = "messages"
                      notifi.receiverId = receiver.userId;
                      notifi.conversationName = conversationName;
                      notifi.senderId = senderId;
                      notifi.save();
                      console.log(notifi);
                  if (receiver.onlineStatus){
                    await sendNotification(receiver.userId, notifi, "messageReceived");
                  }
                    
                  } 
                });
                
            }
            if (topic === "friends" && messageType === "request-accepted"){
              const{receiverId} = parseMessage;
              const receiver = await User.findOne({userId: receiverId});
              if (receiver){
                const data = {
                  receiverId: receiverId
                }
                await sendSocketEvent(receiverId, data, "friendrequest-accepted");
              }
            }
            if (topic === "friends" && messageType === "request-deleted"){
              const{receiverId} = parseMessage;
              const receiver = await User.findOne({userId: receiverId});
              if (receiver){
                const data = {
                  receiverId: receiverId
                }
                await sendSocketEvent(receiverId, data, "friendrequest-deleted");
              }
            }

        }
      },
    });
  }


