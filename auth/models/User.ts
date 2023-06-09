import {Schema, model, Types} from 'mongoose'

interface IUser{
    userId: string;
    username: String;
    googleId: String;
    facebookId: String;
    githubId: String;
}

const UserSchema = new Schema<IUser>({
	userId: {
		type: String,
		default: function () {
			return new Types.ObjectId().toString();
		},
	},
	googleId: {
		type: String,
	},
	facebookId: {
		type: String,
	},
	githubId: {
		type: String,
	},
});

export const User = model<IUser>('User', UserSchema);
