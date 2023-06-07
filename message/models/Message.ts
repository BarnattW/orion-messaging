import { Schema, model, Types } from "mongoose";

interface IMessage {
  senderId: Types.ObjectId;
  message: String;
  timestamp: String;
}

const MessageSchema = new Schema<IMessage>({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: String,
  },
  timestamp: {
    type: String,
  }
});

export const Message = model<IMessage>("Message", MessageSchema);
