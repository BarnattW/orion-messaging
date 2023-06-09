import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'connect',
    brokers: ['kafka-srv:9092']
});

const producer = kafka.producer();

// Helper function to publish messages to Kafka
export async function publishMessage(topic: string, value: any) {
    await producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(value) }]
    });
}

export const consumer = kafka.consumer({groupId: 'auth-consumer'});

