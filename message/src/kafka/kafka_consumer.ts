import {
  Consumer,
  EachMessagePayload,
} from "kafkajs";
import { kafka } from "./kafka";
import { createUser } from "../routes/kafka/user_router";
import { addUser, createConversation, deleteConversation, removeUser, renameConversation } from "../routes/kafka/conversation_router";
import { Server, Socket } from "socket.io";

export interface SimpleConsumer {
  connect(): Promise<void>;
  handle(message: EachMessagePayload): Promise<void>;
  disconnect(): Promise<void>;
}

export class messageConsumer implements SimpleConsumer {
  private io: Server;
  private consumer: Consumer;
  private connectedClients: Map<string, Socket>

  constructor(io: Server, connectedClients: Map<string, Socket>) {
    this.io = io;
    this.consumer = this.createConsumer();
    this.connectedClients = connectedClients
  }

  private createConsumer(): Consumer {
    return kafka.consumer({ groupId: "message-consumer" });
  }

  public async connect(): Promise<void> {
    try {
      await this.consumer
        .connect()
        .then(() => this.consumer.subscribe({ topic: "user-data" }))
        .then(() => this.consumer.subscribe({ topic: "friends" }))
        .then(() => this.consumer.subscribe({ topic: "group" }))
        .then(() =>
          this.consumer.run({
            eachMessage: async (messagePayload: EachMessagePayload) => {
              this.handle(messagePayload);
            },
          })
        );
    } catch (e) {
      console.log("Error creating consumer: ", e);
    }
  }

  public async handle(messagePayload: EachMessagePayload): Promise<void> {
		const { topic, partition, message } = messagePayload;
		console.log(messagePayload);
		//@ts-ignore
		const customMessage = JSON.parse(message.value?.toString());

		const { value, messageType } = customMessage;

		console.log(customMessage, messageType);

		if (topic == "user-data" && messageType == "data") {
			createUser(value);
		}

		if (topic == "friends" && messageType == "request-accepted") {
			createConversation(value, topic, this.io, this.connectedClients);
		}

    if (topic == "group" && messageType == "create") {
      createConversation(value, topic, this.io, this.connectedClients)
    }

    if (topic == "group" && messageType == "accept") {
      addUser(value, this.io, this.connectedClients)
    }

    if (topic == "group" && messageType == "delete") {
      deleteConversation(value, this.io, this.connectedClients)
    }

    if (topic == "group" && messageType == "rename") {
      renameConversation(value, this.io, this.connectedClients)
    }

    if (topic == "group" && messageType == "leave") {
      removeUser(value, this.io, this.connectedClients)
    }
	}

  public async disconnect(): Promise<void> {
    try {
      this.consumer.disconnect();
    } catch (e) {
      console.log("Error disconnecting consumer: ", e);
    }
  }
}
