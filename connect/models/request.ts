import mongoose, {Schema, model} from 'mongoose';

interface IRequest{
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    type: 'friend' | 'group' 
    status: 'pending' | 'accepted' | 'rejected';
}

const RequestSchema = new Schema<IRequest>({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'], 
        default: 'pending' 
    },
    type: {
        type: String,
        enum: ['friend | group'],
    }
});

export const request = model<IRequest>('Request', RequestSchema);