import { Kafka, Producer } from "kafkajs";

export interface SimpleProducer {
	connect(): Promise<void>;
	send(message: any): Promise<void>;
	disconnect(): Promise<void>;
}

const kafka = new Kafka({
	clientId: "auth-service",
	brokers: ["kafka-srv:9092"],
});

export class authProducer implements SimpleProducer {
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
				messages: [{ value: JSON.stringify({value: message}) }],
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
