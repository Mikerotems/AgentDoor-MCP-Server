import { Router } from "express";
import {
  createCustomer,
  getCustomer,
  listCustomers,
} from "../controllers/customer.controller";

const customerRouter = Router();

customerRouter.post("/", createCustomer);

customerRouter.get("/", listCustomers);

customerRouter.get("/:id", getCustomer);

export default customerRouter;