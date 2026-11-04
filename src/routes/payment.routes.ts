import { Router } from "express";
import { createPaymentLink, verifyPayment } from "../controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/link", createPaymentLink);

paymentRouter.post("/verify", verifyPayment);
export default paymentRouter;