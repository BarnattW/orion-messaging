import mongoose, {Schema, model} from 'mongoose';

export interface IUser{
    userId: string
    receiveNotifications: boolean
    onlineStatus: boolean
}

const UserSchema = new Schema<IUser>({
	userId: {
		type: String,
		required: true,
	},
	receiveNotifications: {
		type: Boolean,
		default: true
	},
	onlineStatus: {
		type: Boolean,
		default: true
	}
});


export const User = model<IUser>('User', UserSchema);