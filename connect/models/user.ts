import mongoose, {Schema, model} from 'mongoose';

interface IUser{
    friends: Array<Schema.Types.ObjectId>
    requests: Array<Schema.Types.ObjectId>
}

const UserSchema = new Schema<IUser>({
    friends: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    requests: [{
        type: Schema.Types.ObjectId,
        ref: 'Request'
    }],
});

export const User = model<IUser>('User', UserSchema);