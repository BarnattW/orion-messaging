import { Schema, model, Types, Model } from "mongoose";

interface IConversationDocument {
  title: string;
  conversationType: "group" | "individual";
  users: Types.Array<Types.ObjectId>;
  messages: Types.Array<Types.Array<Types.ObjectId>>;
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
    [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  ],
});

ConversationSchema.method("addMessage", function (message: Types.ObjectId) {
  const lastMessages = this.messages[this.messages.length - 1];
  if (!lastMessages || lastMessages.length === 50) {
    this.messages.push([]);
  }
  this.messages[this.messages.length - 1].push(message);
});

export const Conversation = model<IConversation>(
  "Conversation",
  ConversationSchema
);
