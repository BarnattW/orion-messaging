import { Schema, model, Types, Model } from "mongoose";
import { IMessageContainer, MessageContainer } from "./MessageContainer";
import { IMessage, Message } from "./Message";
import { User } from "./User";

interface IConversationDocument {
  _id: Types.ObjectId;
  title: string;
  conversationType: "group" | "friends";
  groupId: Types.ObjectId
  users: Types.Array<string>;
  messages: Types.Array<Types.Array<Types.ObjectId>>;
  latestMessageTimestamp: Date;
}

interface IConversation extends IConversationDocument {
  addMessage(message: IMessage): Promise<void>;
}

const ConversationSchema = new Schema<IConversation>({
	title: {
		type: String,
	},
	conversationType: {
		type: String,
		enum: ["group", "friends"],
	},
  groupId: {
    type: Schema.Types.ObjectId
  },
	users: [
		{
			type: String,
		},
	],
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: "MessageContainer",
			index: true,
		},
	],
	latestMessageTimestamp: {
		type: Date,
		default: new Date(),
	},
});

ConversationSchema.virtual('conversationUsers', {
  ref: "User",
  localField: "users",
  foreignField: 'userId',
  justOne: false
})

ConversationSchema.method("addMessage", async function (message: IMessage) {
  const latestContainer = await MessageContainer.findById(this.messages[this.messages.length - 1]);
  if (latestContainer && latestContainer.messages.length < 50) {
    latestContainer.messages.push(message._id);
    await latestContainer.save();
  } else {
    const container = new MessageContainer({
      messages: [message._id],
      timeCreated: message.timestamp
    });
    await container.save();
    this.messages.push(container);
  }
  this.latestMessageTimestamp = message.timestamp;
  await this.save()
});

ConversationSchema.pre('deleteOne', async function () {
  const conversationQuery = this.getQuery();
  const conversation = await this.model.findOne(conversationQuery);

  const messageContainers = conversation.messages;

  console.log(messageContainers);
  await Promise.all(messageContainers.map(async (_id: Types.ObjectId) => {
    const container = await MessageContainer.findById(_id);
    if (container){
      await Message.deleteMany({ _id: {$in: container.messages}})
      await MessageContainer.deleteOne({_id: _id});
      await User.updateMany(
        { _id: {$in: conversation.users}}),
        { $pull: {conversations: conversation._id}}
    }
  }))
})

ConversationSchema.virtual('userInfo').get(async function() {
  const userInfo: Array<{ userId: string | undefined, username: string | undefined}> = await Promise.all(this.users.map(async userId => {
    const user = await User.findOne({ userId });
    const data = { userId: user?.userId, username: user?.username};
    return data
  }))
  return Promise.all(userInfo);
})

export const Conversation = model<IConversation>(
  "Conversation",
  ConversationSchema
);

export { IConversation };