import { Request, Response } from "express";
import { orderModel } from "../models/orderModel";
import { customerModel } from "../models/customerModel";

export async function createOrder(
  req: Request,
  res: Response
) {
  try {
    const {
      customerId,
      amountKobo,
      note,
    } = req.body;

    const customer =
      await customerModel.findById(
        customerId
      );

    if (!customer) {
      return res.status(404).json({
        error: "Customer not found",
      });
    }

    const order =
      await orderModel.create({
        customerId,
        amountKobo,
        note,
        status: "pending",
        paymentStatus: "unpaid",
      });

    return res.status(201).json(order);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to create order",
    });
  }
}