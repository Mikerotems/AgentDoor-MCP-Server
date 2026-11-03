import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { getAvailableTools } from "../controllers/tools.controller";

const toolsRouter = Router();

toolsRouter.get(
  "/tools",
  authenticate,
  getAvailableTools
);

export default toolsRouter;