import {Schema, model} from 'mongoose'

interface IUser{
    googleId: String;
    facebookId: String;
    githubId: String;
}

const UserSchema = new Schema<IUser>({
    googleId: {
        type: String
    },
    facebookId: {
        type: String
    },
    githubId: {
        type: String
    }
})

export const User = model<IUser>('User', UserSchema);
