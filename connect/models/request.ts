import mongoose, {Schema, model} from 'mongoose';

interface IRequest{
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    requestType: 'friend' | 'group' 
    status: 'pending' | 'accepted' | 'rejected';
}

const RequestSchema = new Schema<IRequest>({
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
    }
});

export const request = model<IRequest>('Request', RequestSchema);