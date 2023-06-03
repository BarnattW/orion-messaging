import mongoose, {Schema, model} from 'mongoose';

interface IUser{
    userId: string
    username: string
    friends: Array<mongoose.Types.ObjectId>
    outgoingrequests: Array<mongoose.Types.ObjectId>
    incomingrequests: Array<mongoose.Types.ObjectId>
    onlineStatus: boolean
}

const UserSchema = new Schema<IUser>({
    onlineStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    username:{
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
});

UserSchema.pre('save', function (next) {

    if (!this.username) {
      const randomUsername = generateRandomUsername();
      this.username = randomUsername;
    }
  
    next();
  });

const generateRandomUsername = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    return randomString;
}



export const User = model<IUser>('User', UserSchema);