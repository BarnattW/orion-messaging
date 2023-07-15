import mongoose, {Schema, model} from 'mongoose';

export interface INotification{
    type: 'message' | 'friends' | 'groups';
    receiverId: mongoose.Types.ObjectId,
    senderId: mongoose.Types.ObjectId,
	message: string
}

const NotificationSchema = new Schema<INotification>({
	type:{
		type: String,
		enum: ['message', "friends", "groups"]
	},
	senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
	message:{
		type: String
	}
});

export const Notification = model<INotification>('Group', NotificationSchema);