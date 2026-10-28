import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";

const protectedRouter = Router();

protectedRouter.get(
  "/protected", authenticate, (req, res) => {
    res.json({
      message: "Success",
      user: req.user
    });
  }
);

export default protectedRouter;