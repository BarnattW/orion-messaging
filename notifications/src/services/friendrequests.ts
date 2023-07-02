import { redis } from '../redis/redis';
import { consumer } from '../kafka/kafka_consumer';
import { getKeySocketPairs } from './sockets';

async function handleMessages() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'friends', fromBeginning: true });
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        //@ts-ignore
        const parseMessage = JSON.parse(message.value?.toString());
        const { messageType, value } = parseMessage;
        if (message.value){
            
            if (topic === "friends" && messageType === "requestCreated"){
                const {receiverId, senderUsername} = parseMessage.value
                await sendFriendRequestNotification(receiverId, `You have a new friend request from ${senderUsername}`)
            }
        }
    
      },
    });
  }

  async function sendFriendRequestNotification(receiverId: string, message: string) {

    const socketInfo = getKeySocketPairs(receiverId, "notification");
    
  }