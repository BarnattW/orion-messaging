import { Schema, model, Types } from "mongoose";

interface IMessage {
  senderId: String;
  message: String;
  timestamp: String;
}

const MessageSchema = new Schema<IMessage>({
  senderId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
});

export const Message = model<IMessage>("Message", MessageSchema);
