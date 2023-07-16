import {Kafka } from "kafkajs";

// Create Kafka client instance
export const kafka = new Kafka({
    clientId: 'notification-service',
    brokers: ['kafka-srv:9092']
});

export const consumer = kafka.consumer({ groupId: 'notification-group' });

