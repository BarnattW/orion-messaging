import { Schema, model, Types } from "mongoose";

interface IConversation {
  title: string,
  conversationType: 'group' | 'individual';
  users: Types.Array<Types.ObjectId>;
  messages: Types.Array<Types.Array<Types.ObjectId>>;
}

const ConversationSchema = new Schema<IConversation>({
  title: {
    type: String,
    default: 'New Chat'
  },
  conversationType: {
    type: String,
    enum: ['group', 'individual']
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'Conversation'
  }],
  messages: [[{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }]]
});

ConversationSchema.methods.addMessage = function(message){
  const lastMessages = this.messages[this.messages.length - 1];
  if (this.lastMessages.length === 50) {
    this.nestedArrays.push([]);
  }
  this.nestedArrays[this.messages.length - 1].push(message);
}

export const Conversation = model<IConversation>("Conversation", ConversationSchema);
