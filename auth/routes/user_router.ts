import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import { isAuthorized } from "../middleware/auth";

const router = Router();

router.get("/getUserId", isAuthorized, async (req: Request, res: Response) => {
  try {
    // Is there a session?
    if (!req.user) {
      return res.status(401).json({ message: "No session" });
    }

    return res.status(200).json(req.user.userId);
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export { router as userRouter };
