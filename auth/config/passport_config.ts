import passport from 'passport';
import { User } from '../models/User';
import { Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2'; 

type PassportType = typeof passport;

async function authenticateUser(req : Express.Request, token : string, tokenSecret : string, profile : any, done: Function) {
    console.log("Trying to get profile");
    console.log(profile);
    try {
        const providerId = profile.provider + 'Id';
        console.log(providerId);
        if (req.user){ // Is there a user currently logged in?
            console.log('hi');
            try {
                const test = await User.findOne({[providerId] : profile.id})
                if (test) return done(undefined, test);
                const user = await User.findById(req.user._id);
                if (!user) return done(undefined);
                user[providerId] = profile.id;
                user.save();
                return done(null, user);
            } catch (err) {
                done(err);
            }
        }
        let user = await User.findOne({ [providerId] : profile.id});
        if (user) { // Does the user exist?
            return done(undefined, user);
        }
        var newUser = ({
            username: profile.displayName,
            [providerId]: profile.id,
        });
        user = await User.create(newUser);
        console.log("User Created");
        return done(undefined, user);
    } catch (err) {
        console.error(err);
    }
}

export const PassportConfig = (passport : PassportType) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        passReqToCallback: true
    }, authenticateUser))

}