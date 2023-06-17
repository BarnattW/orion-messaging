import express from 'express';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cookie from "cookie-parser";
import passport from "passport";
import { googleRouter } from "../src/routes/google_router";
import { PassportConfig } from "../src/config/passport_config";
import { facebookRouter } from "../src/routes/facebook_router";
import { githubRouter } from "../src/routes/github_router";
import { userRouter } from "../src/routes/user_router";
import { logoutRouter } from "../src/routes/logout_router";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
require("dotenv").config({path: "../.env"});

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