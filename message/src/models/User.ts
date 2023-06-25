import { Schema, model, Types } from "mongoose";

interface IUser {
  _id: Types.ObjectId;
  userId: string;
  username: String;
  conversations: Array<Types.ObjectId>;
}

const UserSchema = new Schema<IUser>({
  userId: {
    type: String,
    index: true
  },
  username: {
    type: String,
  },
  conversations: [{
    type: Schema.Types.ObjectId,
    ref: "Conversation"
  }]
});

export const User = model<IUser>("User", UserSchema);
export { IUser }
