import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "message-service",
    brokers: ["kafka-srv:9092"],
});