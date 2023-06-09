import express from 'express';
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
import mongoose from "mongoose";
import cors from "cors";
import { Kafka, EachMessagePayload } from "kafkajs";

const app = express();
require("dotenv").config();

PassportConfig(passport);

app.use(express.json());
app.use(cookie());
app.use(cors());

mongoose
	.connect(process.env.MONGO_URI!)
	.then(() => {
		console.log("Connected to DB");
	})
	.catch((err) => {
		console.log(err.message);
	});

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
	cookieSession({
		name: "cookie",
		secret: process.env.COOKIE_SECRET,
		secure: false,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
	"/api/auth",
	googleRouter,
	facebookRouter,
	githubRouter,
	userRouter,
	logoutRouter
);

app.listen(3000, () => {
	console.log(`Server Started on Port 3000`);
});