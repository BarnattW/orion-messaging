import { Router, Request, Response } from "express";

var router = Router();

router.post("/logout", (req: Request, res: Response) => {
  try {
    console.log("logout received");
    req.logout(function (err: Error) {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Error during logout" });
      }
    });
    req.session = null as any;
    res.clearCookie("cookie");
    res.clearCookie("cookie.sig");
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

export { router as logoutRouter };
