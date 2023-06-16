import { Conversation } from "../../models/Conversation";
import { User } from "../../models/User";

export async function createConversation(data: any) {
	try {
		const { receiverId, senderId } = data;

		const newChat = {
			conversationType: "individual",
			users: [receiverId, senderId],
		};
		console.log(newChat);

		const users = [receiverId, senderId];

		const conv = await Conversation.create(newChat);
		const user = await User.updateMany(
			{ userId: { $in: users } },
			{ $push: { conversations: conv._id } }
		);

		if (!conv) {
			return console.log("Failed to create conversation");
		}

		console.log("Conversation Created");

		console.log(`Conversation of Type ${conv.conversationType} created`, conv);
	} catch (e) {
		console.log("Unable to create: ", e);
	}
}
