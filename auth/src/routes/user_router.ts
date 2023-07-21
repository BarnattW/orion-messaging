import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import { isAuthorized } from "../middleware/auth";

const router = Router();

router.get("/getUserId", isAuthorized, async (req: Request, res: Response) => {
  try {
    return res.status(200).json(res.locals.userId);
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export { router as userRouter };
