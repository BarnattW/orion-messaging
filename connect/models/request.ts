import {Schema, model} from 'mongoose';

interface IRequest{
    friend: Boolean
    group: Boolean
    accepted: Boolean
}

const RequestSchema = new Schema<IRequest>({
    friend: { 
        type: Boolean 
    },
    group: {
        type: Boolean
    },
    accepted: {
        type: Boolean
    }
});

export const User = model<IRequest>('Request', RequestSchema);