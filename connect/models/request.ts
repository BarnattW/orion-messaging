import mongoose, {Schema, model} from 'mongoose';

interface IRequest{
    sender: Schema.Types.ObjectId;
    receiver: Schema.Types.ObjectId;
    type: 'friend' | 'group' 
    status: 'pending' | 'accepted' | 'rejected';
}

const RequestSchema = new Schema<IRequest>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: Schema.Types.ObjectId,
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