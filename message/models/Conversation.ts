import { Schema, model, Types, Model } from "mongoose";
import { MessageContainer } from "./MessageContainer";

interface IConversationDocument {
  title: string;
  conversationType: "group" | "individual";
  users: Types.Array<Types.ObjectId>;
  messages: Types.Array<Types.Array<Types.ObjectId>>;
  latestMessage: Types.ObjectId;
}

interface IConversation extends IConversationDocument {
  addMessage(message: Types.ObjectId): null;
}

const ConversationSchema = new Schema<IConversation>({
  title: {
    type: String,
    default: "New Chat",
  },
  conversationType: {
    type: String,
    enum: ["group", "individual"],
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },
  ],
  messages: [
    {
        type: Schema.Types.ObjectId,
        ref: "MessageContainer",
    },
  ],
  latestMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message"
  }
});

ConversationSchema.method("addMessage", async function (message: Types.ObjectId) {
  const latestContainer = await MessageContainer.findById(this.messages[this.messages.length - 1]);
  if (latestContainer && latestContainer.messages.length < 50) {
    latestContainer.messages.push(message);
    await latestContainer.save();
  } else {
    const container = new MessageContainer({messages: [message]});
    await container.save();
    this.messages.push(container);
    await this.save();
  }
});

export const Conversation = model<IConversation>(
  "Conversation",
  ConversationSchema
);

export { IConversation };