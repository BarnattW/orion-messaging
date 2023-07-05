import { redis } from '../redis/redis';
import { consumer } from '../kafka/kafka_consumer';
import { getKeySocketPairs } from '../utils/sockets';

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
                const {receiverId, senderUsername} = value
                await sendFriendRequestNotification(receiverId, `You have a new friend request from ${senderUsername}`);
            }
        }
      },
    });
  }

  async function sendFriendRequestNotification(receiverId: string, message: string) {
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

