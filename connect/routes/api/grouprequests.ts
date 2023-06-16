import mongoose from "mongoose";
import { User } from "../../models/user";
import { request } from "../../models/request";
import express, { Request, Response } from "express";
import { publishMessage } from "./idkwhattonamethis/kafkaproducer";
import { insertionSort } from "./idkwhattonamethis/sort";

import { sendRequest } from "./friendrequests";

const router = express.Router();

router.post("/api/connect/sendGroupRequest", (req: Request, res: Response) =>
	sendRequest(req, res, "group")
);