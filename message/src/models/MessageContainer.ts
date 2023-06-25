import { Schema, model, Types } from "mongoose";
import { Conversation } from "./Conversation";

interface IMessageContainer {
  _id: Types.ObjectId;
  messages: Array<Types.ObjectId>;
  timeCreated: Date
}

const MessageContainerSchema = new Schema<IMessageContainer>({
  messages: [{
    type: Schema.Types.ObjectId,
    ref: "Message"
  }],
  timeCreated: {
    type: Date
  }
});

MessageContainerSchema.post('findOneAndUpdate', async function(doc: IMessageContainer) {
  const messageContainer: IMessageContainer | null = await this.model.findOne({_id: doc._id});

  if (messageContainer && messageContainer.messages.length == 0) {
    await this.model.deleteOne({_id: messageContainer._id});
    await Conversation.updateOne(
      { messages: messageContainer._id},
      { $pull: { messages: messageContainer._id}}
    )
  }
})

export const MessageContainer = model<IMessageContainer>("MessageContainer", MessageContainerSchema);
export { IMessageContainer }
