import { Kafka, Message } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'connect',
    brokers: ['kafka-srv:9092']
});

interface CustomMessage extends Message {
  messageType: string;
  value: any;
}
const producer = kafka.producer();


// Helper function to publish messages to Kafka
export async function publishMessage(topic: string, value: any, messageType: string) {
  const message: CustomMessage = {
    value: value,
    messageType: messageType
  };

  await producer.send({
    topic: topic,
    messages: [message]
  });
}

export const consumer = kafka.consumer({groupId: 'auth-consumer'});

