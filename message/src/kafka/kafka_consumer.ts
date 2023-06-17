import {
  Consumer,
  EachMessagePayload,
} from "kafkajs";
import { kafka } from "./kafka";
import { createUser } from "../routes/kafka/user_router";
import { createConversation } from "../routes/kafka/conversation_router";

export interface SimpleConsumer {
  connect(): Promise<void>;
  handle(message: EachMessagePayload): Promise<void>;
  disconnect(): Promise<void>;
}

export class messageConsumer implements SimpleConsumer {
  private consumer: Consumer;

  constructor() {
    this.consumer = this.createConsumer();
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
			createConversation(value);
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
