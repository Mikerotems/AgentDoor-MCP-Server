import { Router } from "express";
import { squadWebhook } from "../controllers/webhook.controller";

const webhookRouter = Router();

webhookRouter.post("/squad", squadWebhook);

export default webhookRouter;