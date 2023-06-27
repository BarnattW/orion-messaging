import { Server, Socket } from "socket.io";
import { Conversation } from "../../models/Conversation";
import { User } from "../../models/User";
import { Types } from "mongoose";
import { socketsInConversation } from "../../lib/utils";

export async function createConversation(data: any, type: string, io: Server, connectedClients: Map<string, Socket>) {
  try {
    let newChat: any = {}
    if (type == "friends") {
      console.log("Friend is being created")
      const { receiverId, senderId }: { receiverId: string; senderId: string } =
        data;

      const users = [receiverId, senderId];
      newChat = {
        conversationType: type,
        users: users
      }
    }

    if (type == "group") {
      console.log("Group is being created")
      const { _id, name, users }: { _id: Types.ObjectId, name: string, users: string} =
        data;

      newChat = {
        groupId: _id,
        conversationType: type,
        title: name,
        users: users
      }
    }

    console.log(newChat);

    const conv = await Conversation.create(newChat);

    await User.updateMany(
      { userId: { $in: conv.users } },
      { $push: { conversations: conv._id } }
    );

    if (!conv) {
      return console.log("Failed to create conversation");
    }

    const result = await socketsInConversation(conv, connectedClients);

    io.to(result as string[]).emit("createdConversation", {
      message: `Conversation of Type ${conv.conversationType} created`,
      data: conv,
    });

    console.log(`Conversation of Type ${conv.conversationType} created`, conv);
  } catch (e) {
    console.log("Unable to create: ", e);
  }
}

export const addUser = async (data: any, io: Server, connectedClients: Map<string, Socket>) => {
    try {

      const {
        groupId,
        newUser,
      }: { groupId: Types.ObjectId; newUser: string } = data;
      console.log(data);

      const conv = await Conversation.findOne( { groupId });
      if (!conv) {
        return console.log("Add User: Conversation not found");
      }

      if (conv.users.includes(newUser)) {
        return console.log("Add User: User already in conversation");
      }

      const user = await User.findOne({ userId: newUser });
      if (!user) {
        return console.log("Add User: User not found");
      }

      conv.users.push(newUser);
      conv.save();

      user.conversations.push(conv._id);
      user.save();

      const result = await socketsInConversation(conv, connectedClients);

      io.to(result as string[]).emit("addedUser", {
        message: `Added user ${newUser} to conversation ${conv._id}`,
        data: conv,
      });
    } catch (e) {
      console.log("Unable to add user: ", e);
    }
  };