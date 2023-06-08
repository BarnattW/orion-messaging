import { Schema, model, Types } from "mongoose";

interface IMessage {
  senderId: Types.ObjectId;
  message: String;
  timestamp: String;
}

const MessageSchema = new Schema<IMessage>({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
