import { Schema, model, Types } from "mongoose";

interface IMessage {
  _id: Types.ObjectId;
  senderId: String;
  message: String;
  timestamp: Number;
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
    type: Number,
    required: true
  },
});

export const Message = model<IMessage>("Message", MessageSchema);

export { IMessage };
