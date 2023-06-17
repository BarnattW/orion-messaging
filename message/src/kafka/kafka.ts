import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "message-service",
    brokers: ["localhost:9092"],
});