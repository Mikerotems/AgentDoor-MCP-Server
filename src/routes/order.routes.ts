import { Router } from "express";
console.log("ORDER ROUTER LOADED");
import {
  createOrder,
} from "../controllers/order.controller";

import {
  createCustomer,
} from "../controllers/customer.controller";

const orderRouter = Router();

orderRouter.post(
  "/customers",
  createCustomer
);

orderRouter.post(
  "/orders",
  createOrder
);

export default orderRouter;