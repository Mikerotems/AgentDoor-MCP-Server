import { Router } from "express";
import {
  createOrder,
  getOrder,
  listOrders,
} from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.post("/", createOrder);

orderRouter.get("/", listOrders);

orderRouter.get("/:id", getOrder);

export default orderRouter;