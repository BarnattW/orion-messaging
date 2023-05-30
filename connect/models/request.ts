import mongoose, {Schema, model} from 'mongoose';

interface IRequest{
    sender: String;
    receiver: String;
    requestType: 'friend' | 'group' 
    status: 'pending' | 'accepted' | 'rejected';
}

const RequestSchema = new Schema<IRequest>({
    sender: {
        type: String
    },
    receiver: {
        type: String
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