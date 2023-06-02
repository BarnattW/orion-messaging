import { Router, Request, Response } from "express";
import passport from "passport";

const router = Router();

router.get(
	"/getUserId",

	async (req: Request, res: Response) => {
		try {
			if (!req.user) {
				return res.status(401).json({ message: "Invalid or missing JWT" });
			}
			console.log(req.user.userId);
			return res.status(200).json(req.user.userId);
		} catch (e) {
			return res.status(500).json({ message: "Internal Server Error" });
		}
	}
);

export { router as userRouter };
