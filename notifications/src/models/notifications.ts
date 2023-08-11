import mongoose, {Schema, model} from 'mongoose';

export interface INotification{
    type: 'messages' | 'friends' | 'groups';
    receiverId: string,
    senderId: string,
	message: string
    conversationName: string
    timestamp: Date;
    requestId: mongoose.Types.ObjectId;
    conversationId: mongoose.Types.ObjectId;
}

const NotificationSchema = new Schema<INotification>({
	type:{
		type: String,
		enum: ['messages', "friends", "groups"]
	},
	senderId: {
        type: String
    },
    receiverId: {
        type: String,
    },
	message:{
		type: String
	},
    timestamp: {
        type: Date,
        required: true
      },
    requestId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'request'
    },
    conversationId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversation'
    },
});

export const Notifications = model<INotification>('Notifications', NotificationSchema);