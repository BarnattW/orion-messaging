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
producer.connect();

// Helper function to publish messages to Kafka
export async function publishMessage(
	topic: string,
	value: any,
	messageType: string
) {
	const message: CustomMessage = {
		value: value,
		messageType: messageType,
	};
	console.log(message);
	await producer.send({
		topic: topic,
		messages: [{ value: JSON.stringify(message) }],
	});
}

export const consumer = kafka.consumer({groupId: 'auth-consumer'});

