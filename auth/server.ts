import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cookie from 'cookie-parser';
import { connect } from 'mongoose';
import passport from 'passport';
import { googleRouter } from './routes/google_router';
import { PassportConfig } from './config/passport_config';
import { facebookRouter } from './routes/facebook_router';
import { githubRouter } from './routes/github_router';
import { userRouter } from './routes/user_router';
import { logoutRouter } from './routes/logout_router';

const app = express();
require("dotenv").config();

PassportConfig(passport);

app.use(express.json());
app.use(cors());
app.use(cookie());

connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err.message);
})

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cookieSession({
    name: 'cookie',
    secret: process.env.COOKIE_SECRET,
    secure: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", googleRouter, facebookRouter, githubRouter, userRouter, logoutRouter);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
})