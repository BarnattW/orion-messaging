import mongoose, {Schema, model} from 'mongoose';

interface IRequest{
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    requestType: 'friend' | 'group' 
    status: 'pending' | 'accepted' | 'rejected';
    senderUsername: string;
    receiverUsername: string;
    groupId: mongoose.Types.ObjectId;
}

const RequestSchema = new Schema<IRequest>({
    senderUsername: {
        type: String,
    },
    receiverUsername:{
        type: String,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'], 
        default: 'pending' 
    },
    requestType: {
        type: String,
        enum: ['friend', 'group'],
    },
    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }
});

export const request = model<IRequest>('Request', RequestSchema);