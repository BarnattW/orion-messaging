/// <reference path="../environment.d.ts" />

import passport from 'passport';
import { User } from '../models/User';
import { providers } from '../enum/providers';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';

type PassportType = typeof passport;
type ProviderType = typeof providers;

async function authenticateUser(
    req: Express.Request,
    token: string, 
    tokenSecret: string, 
    profile: passport.Profile, 
    done: Function
) {
    console.log("Trying to get profile");
    console.log(profile);
    try {
        const providerId = providers[profile.provider as keyof ProviderType];

        // Is there a user currently logged in?
        if (req.user) { 
            console.log("User is logged in");
            const userWithProviderId = await User.findOne({ [providerId]: profile.id })

            // Is there a user that already connected this account?
            if (userWithProviderId) {
                return done(undefined, userWithProviderId);
            }

            const userWithId = await User.findById(req.user._id);

            if (!userWithId) {
                return done(undefined);
            }

            userWithId[providerId] = profile.id;
            console.log(userWithId[providerId]);
            
            userWithId.save();

            return done(undefined, userWithId);
        }

        let user = await User.findOne({ [providerId]: profile.id });

        // Does the user exist?
        if (user) { 
            return done(undefined, user);
        }

        var newUser = ({
            [providerId]: profile.id,
        });

        user = await User.create(newUser);
        console.log("User Created");

        return done(undefined, user);
    }
    catch (err) {
        console.error(err);
    }
}

export const PassportConfig = (passport: PassportType) => {

    passport.use(new JwtStrategy({ 
        jwtFromRequest: function(req) {
            var token = null;
            if (req && req.cookies)
            {
                token = req.cookies['jwt'];
            }
            return token;
        },
        secretOrKey: process.env.JWT_KEY,
        algorithms: ['HS256']
    }, async function(jwt_payload, done: Function) {
        console.log("Jwt auth called");
        console.log(jwt_payload);
        if (await User.findById(jwt_payload.sub._id)) {
            return done(null, jwt_payload.sub)
        } else {
            return done(null, false)
        }
    }));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        passReqToCallback: true
    }, authenticateUser));

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: '/api/auth/facebook/callback',
        passReqToCallback: true
    }, authenticateUser));

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/github/callback',
        passReqToCallback: true
    }, authenticateUser));

    passport.serializeUser(function (user: Express.User, done: Function) {
        done(undefined, user._id);
    });

    passport.deserializeUser(async function (id: String, done: Function) {
        try {
            const user = await User.findById(id);
            done(undefined, user);
        } catch (err) {
            done(err);
        }
    });
}