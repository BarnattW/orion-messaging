import mongoose, {Schema, model} from 'mongoose';

interface IUser{
    friends: Array<Schema.Types.ObjectId>
    outgoingrequests: Array<Schema.Types.ObjectId>
    incomingrequests: Array<Schema.Types.ObjectId>
}

const UserSchema = new Schema<IUser>({
    friends: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    incomingrequests: [{
        type: Schema.Types.ObjectId,
        ref: 'Request'
    }],
    outgoingrequests: [{
        type: Schema.Types.ObjectId,
        ref: 'Request'
    }],
});

export const User = model<IUser>('User', UserSchema);