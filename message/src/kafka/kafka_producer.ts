import { Producer } from "kafkajs";
import { kafka } from "./kafka";

export interface SimpleProducer {
	connect(): Promise<void>;
	send(message: any): Promise<void>;
	disconnect(): Promise<void>;
}

export class messageProducer implements SimpleProducer {
	private producer: Producer;

	constructor() {
		this.producer = this.createProducer();
	}

	private createProducer(): Producer {
		return kafka.producer();
	}

	public async connect(): Promise<void> {
		try {
			await this.producer.connect();
		} catch (e) {
			console.log("Error connecting producer", e);
		}
	}

	public async send(message: any): Promise<void> {
		try {
			await this.producer.send({
				topic: "user-created",
				messages: [{ value: message }],
			});
		} catch (e) {
			console.log("Error sending message to Kafka", e);
		}
	}

	public async disconnect(): Promise<void> {
		try {
			await this.producer.disconnect();
		} catch (e) {
			console.log("Error disconnecting producer", e);
		}
	}
}
