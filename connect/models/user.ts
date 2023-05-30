import mongoose, {Schema, model} from 'mongoose';

interface IUser{
    ID: string
    friends: Array<mongoose.Types.ObjectId>
    outgoingrequests: Array<mongoose.Types.ObjectId>
    incomingrequests: Array<mongoose.Types.ObjectId>
}

const UserSchema = new Schema<IUser>({
    ID: {
        type: String,
        required: true
    },
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
},{
    _id: false
});

export const User = model<IUser>('User', UserSchema);