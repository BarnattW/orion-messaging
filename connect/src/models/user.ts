import mongoose, {Schema, model} from 'mongoose';

export interface IUser{
    userId: string
    username: string
    friends: Array<String>
    outgoingrequests: Array<mongoose.Types.ObjectId>
    incomingrequests: Array<mongoose.Types.ObjectId>
}

const UserSchema = new Schema<IUser>({
	userId: {
		type: String,
		required: true,
	},
	username: {
		type: String,
	},
	friends: [
		{
			type: String,
			ref: "User",
		},
	],
	incomingrequests: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Request",
		},
	],
	outgoingrequests: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Request",
		},
	]
});

UserSchema.pre('save', function (next) {

    if (!this.username) {
      const randomUsername = generateRandomUsername();
      this.username = randomUsername;
    }
  
    next();
  });

const generateRandomUsername = () => {
    const randomString = Math.random().toString(36).substring(2, 20);
    return randomString;
}



export const User = model<IUser>('User', UserSchema);