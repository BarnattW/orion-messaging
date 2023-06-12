import { Schema, model, Types } from "mongoose";

interface IMessageContainer {
  messages: Array<Types.ObjectId>;
}

const MessageContainerSchema = new Schema<IMessageContainer>({
  messages: [{
    type: Schema.Types.ObjectId,
    ref: "Message"
  }]
});

export const MessageContainer = model<IMessageContainer>("MessageContainer", MessageContainerSchema);
