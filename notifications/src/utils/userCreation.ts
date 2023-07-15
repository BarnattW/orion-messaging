import { User } from "../models/user";
import { consumer } from "../kafka/kafka_consumer";
import { KafkaMessage } from "kafkajs";


export async function addUser() {

    await consumer.connect();
    await consumer.subscribe({ topic: 'user-created', fromBeginning: true });
  
    await consumer.run({
		eachMessage: async ({ topic, partition, message }: {
			topic: string,
			partition: number,
			message: KafkaMessage
		  }) => {
			if (message.value){
				const newUser = new User();
				//@ts-ignore
				newUser.userId = message.value; //assuming message is a json with userId
				newUser.save();
			}
			
		},
	});
  }
