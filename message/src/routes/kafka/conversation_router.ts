import { Conversation } from "../../models/Conversation";
import { User } from "../../models/User";

export async function createConversation(data: any) {
  try {
    const { receiverId, senderId }: { receiverId: string; senderId: string } =
      data;

    const users = [receiverId, senderId];

    const newChat = {
      conversationType: "individual",
      users: users,
    };
    console.log(newChat);

    const conv = await Conversation.create(newChat);

    await User.updateMany(
      { userId: { $in: users } },
      { $push: { conversations: conv._id } }
    );

    if (!conv) {
      return console.log("Failed to create conversation");
    }

    console.log(`Conversation of Type ${conv.conversationType} created`, conv);
  } catch (e) {
    console.log("Unable to create: ", e);
  }
}
