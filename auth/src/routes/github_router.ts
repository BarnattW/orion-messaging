import passport from "passport";
import { Router, Request, Response } from "express";
import { issueJWT } from "../lib/utils";
import { jwtSession } from "../types/jwt_session";

var router = Router();

router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

router.get(
  "/github/callback",
  passport.authenticate("github"),
  function (req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "GitHub Authentication Failed",
        });
      }

      const token = issueJWT(req.user);
      (req.session as jwtSession).jwt = token.token;

      res.redirect(`/dashboard/friends/`);
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

export { router as githubRouter };
