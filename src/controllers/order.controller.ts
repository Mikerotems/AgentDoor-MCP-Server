import { Request, Response } from "express";
import { customerModel } from "../models/customerModel";
import { orderModel } from "../models/orderModel";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { customerId, amount, amountKobo, note } = req.body ?? {};
    const orderAmount = Number(amountKobo ?? amount);

    if (!customerId || !Number.isFinite(orderAmount) || orderAmount <= 0) {
      res.status(400).json({
        success: false,
        message: "customerId and a positive amountKobo are required",
      });
      return;
    }

    const customer = await customerModel.findById(customerId);

    if (!customer) {
      res.status(404).json({
        success: false,
        message: "Customer not found",
      });
      return;
    }

    const order = await orderModel.create({
      customerId,
      amountKobo: orderAmount,
      note,
      status: "pending",
      paymentStatus: "unpaid",
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const listOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await orderModel.find();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};