import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

interface DecodedPayload {
  sub: {
    userId: string;
  };
}

export async function isAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token: string | null = null;

  if (!req || !req.cookies["cookie"]) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Gets 'cookie' cookie from requests, decodes it, and converts to a string
    token = Buffer.from(req.cookies["cookie"], "base64").toString("ascii");

    // Parses the string to get the jwt value
    token = JSON.parse(token).jwt;
  } catch (e) {
    return res.status(401).json({ message: "Invalid cookie" });
  }

  if (!token) {
    return res.status(403).json({ message: "No jwt token" });
  }

  try {
    const decoded: unknown = jwt.verify(token, process.env.JWT_KEY);
    const typedDecoded = decoded as DecodedPayload;
    const userId = typedDecoded.sub.userId;
    console.log(userId);

    if (!(await User.findOne({ userId: userId }))) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
  next();
}
