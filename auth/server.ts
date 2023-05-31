import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookie from 'cookie-parser';
import { connect } from 'mongoose';
import passport from 'passport';
import { googleRouter } from './routes/google_router';
import { PassportConfig } from './config/passport_config';
import { facebookRouter } from './routes/facebook_router';
import { githubRouter } from './routes/github_router';
import { userRouter } from './routes/user_router';

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

app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.render('index')
})

app.use("/api/auth", googleRouter, facebookRouter, githubRouter, userRouter);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
})