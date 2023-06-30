import { Server, Socket } from "socket.io";
import { Conversation } from "../../models/Conversation";
import { IUser, User } from "../../models/User";
import { Types } from "mongoose";
import { socketsInConversation } from "../../lib/utils";

export async function createConversation(
  data: any,
  type: string,
  io: Server,
  connectedClients: Map<string, Socket>
) {
  try {
    let newChat: any = {};
    if (type == "friends") {
      console.log("Friend is being created");
      const { receiverId, senderId }: { receiverId: string; senderId: string } =
        data;

      const users = [receiverId, senderId];
      newChat = {
        conversationType: type,
        users: users,
      };
    }

    if (type == "group") {
      console.log("Group is being created");
      const {
        _id,
        name,
        users,
      }: { _id: Types.ObjectId; name: string; users: string } = data;

      newChat = {
        groupId: _id,
        conversationType: type,
        title: name,
        users: users,
      };
    }

    console.log(newChat);

    const conv = await Conversation.create(newChat);

    // @ts-ignore
    const userInfo = await conv.userData;

    const conversationWithUserInfo = {
      ...conv.toObject(),
      userInfo,
    };

    await User.updateMany(
      { userId: { $in: conv.users } },
      { $push: { conversations: conv._id } }
    );

    if (!conv) {
      return console.log("Create Conversation: Failed to create conversation");
    }
    
    const result = await socketsInConversation(conv, connectedClients);
    console.log("Connected Clients: ", connectedClients)
    console.log("Result: ", result)
    io.to(result as string[]).emit("createdConversation", {
      message: `Conversation of Type ${conv.conversationType} created`,
      data: conversationWithUserInfo,
    });

    console.log(`Conversation of Type ${conv.conversationType} created`, conv);
  } catch (e) {
    console.log("Unable to create: ", e);
  }
}

export const addUser = async (
  data: any,
  io: Server,
  connectedClients: Map<string, Socket>
) => {
  try {
    const { groupId, newUser }: { groupId: Types.ObjectId; newUser: string } =
      data;
    console.log(data);

    const conv = await Conversation.findOne({ groupId });
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

    // @ts-ignore
    const userInfo = await conv.userData;

    const conversationWithUserInfo = {
      ...conv.toObject(),
      userInfo,
    };

    const result = await socketsInConversation(conv, connectedClients);

    io.to(result as string[]).emit("addedUser", {
      message: `Added user ${newUser} to conversation ${conv._id}`,
      data: conversationWithUserInfo,
    });
  } catch (e) {
    console.log("Unable to add user: ", e);
  }
};

export const removeUser = async (
  data: any,
  io: Server,
  connectedClients: Map<string, Socket>
) => {
  try {

    // Destructures data to get necessary values
    const {
      userId,
      groupId
    }: { userId: string, groupId: Types.ObjectId } = data;

    
    // Finds the conversation and removes the user id from
    // list of users
    const conversation = await Conversation.findOneAndUpdate(
      { groupId: groupId },
      { $pull: { users: userId } }
    );

    if (!conversation) {
      console.log("Remove User: Conversation not found");
      return;
    }

    // Finds a user and removes the conversation id from
    // list of conversations
    const user = await User.findOneAndUpdate(
      { userId: userId },
      { $pull: { conversations: conversation._id } }
    );

    if (!user) {
      console.log("Remove User: User not found");
      return;
    }

    // @ts-ignore
    const userInfo = await conversation.userData

    const conversationWithUserInfo = { 
      ...conversation.toObject(), 
      userInfo
    }
    
    // Finds users connected and emits an event 
    const result = await socketsInConversation(
      conversation,
      connectedClients
    );

    io.to(result as string[]).emit("removedUser", {
      message: `Removed user ${userId} from ${conversation._id}`,
      data: conversationWithUserInfo
    });
  } catch (e) {
    console.log("Unable to remove user: ", e);
  }
}

export const renameConversation = async (
  data: any,
  io: Server,
  connectedClients: Map<string, Socket>
) => {
  try {
    const { groupId, newTitle }: { groupId: Types.ObjectId, newTitle: string} = data;
    
    const conversation = await Conversation.findOneAndUpdate(
      { groupId },
      { title: newTitle },
      { new: true }
    )

    if (!conversation) {
      return console.log(`Rename Conversation: Conversation with groupId: ${groupId} doesn't exist`)
    }

    console.log(conversation)

    // @ts-ignore
    const userInfo = await conversation.userData

    const conversationWithUserInfo = { 
      ...conversation.toObject(), 
      userInfo
    }
    const result = await socketsInConversation(
      conversation,
      connectedClients
    );

    io.to(result as string[]).emit("renamedConversation", {
      message: `Renamed ${conversation.groupId} to ${conversation.title}`,
      data: conversationWithUserInfo
    });
  } catch (e) {
    console.log("Unable to rename conversation: ", e);
  }
}

export const deleteConversation = async (
  data: any,
  io: Server,
  connectedClients: Map<string, Socket>
) => {
  try {
    const { _id }: { _id: Types.ObjectId } = data;

    const conversation = await Conversation.findOneAndDelete({ groupId: _id });

    if (!conversation) {
      return console.log(`Delete Conversation: Conversation with groupId: ${_id} doesn't exist`)
    }

    const result = await socketsInConversation(
      conversation,
      connectedClients
    );

    io.to(result as string[]).emit("deletedConversation", {
      message: `Deleted conversation with groupId: ${conversation.groupId}`,
      data: conversation
    });
  } catch (e) {
    console.log("Unable to delete conversation: ", e);
  }
}