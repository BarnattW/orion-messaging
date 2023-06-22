import { Schema, model, Types } from "mongoose";

interface IMessage {
  _id: Types.ObjectId;
  senderId: String;
  senderUsername: String;
  message: String;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId: {
    type: String,
    required: true
  },
  senderUsername: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
});

export const Message = model<IMessage>("Message", MessageSchema);

export { IMessage };
