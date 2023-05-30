import {Schema, model} from 'mongoose';
import mongoose from 'mongoose';

interface IUser{
    friends: Array<mongoose.Schema.Types.ObjectId>
    requests: Array<mongoose.Schema.Types.ObjectId>
    conversations: Array<mongoose.Schema.Types.ObjectId>
}

const UserSchema = new Schema<IUser>({
    friends: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    }],
});

export const User = model<IUser>('User', UserSchema);