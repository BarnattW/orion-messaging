import mongoose, {Schema, model} from 'mongoose';

interface IRequest{
    senderID: mongoose.Types.ObjectId;
    receiverID: mongoose.Types.ObjectId;
    requestType: 'friend' | 'group' 
    status: 'pending' | 'accepted' | 'rejected';
}

const RequestSchema = new Schema<IRequest>({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverID: {
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