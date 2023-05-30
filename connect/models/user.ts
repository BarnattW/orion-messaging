import mongoose, {Schema, model} from 'mongoose';

interface IUser{
    friends: Array<mongoose.Types.ObjectId>
    outgoingrequests: Array<mongoose.Types.ObjectId>
    incomingrequests: Array<mongoose.Types.ObjectId>
}

const UserSchema = new Schema<IUser>({
    friends: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    incomingrequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    }],
    outgoingrequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    }],
});

export const User = model<IUser>('User', UserSchema);