import mongoose, {Schema, model} from 'mongoose';

export interface INotification{
    type: 'messages' | 'friends' | 'groups';
    receiverId: string,
    senderUsername: string,
	message: string
    conversationName: string
}

const NotificationSchema = new Schema<INotification>({
	type:{
		type: String,
		enum: ['messages', "friends", "groups"]
	},
	senderUsername: {
        type: String
    },
    receiverId: {
        type: String,
    },
	message:{
		type: String
	}
});

export const Notifications = model<INotification>('Notifications', NotificationSchema);