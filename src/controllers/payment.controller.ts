import axios from "axios";
import { Request, Response } from "express";
import mongoose from "mongoose";
import squad from "../services/squad.service";
import { orderModel } from "../models/orderModel";
import {
  createPaymentLinkForOrder,
  PaymentLinkError,
} from "../services/paymentLink.service";

export const createPaymentLink = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId, email } = req.body ?? {};
    if (typeof orderId !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid orderId is required",
      });
    }

    const result = await createPaymentLinkForOrder(orderId, email);

    return res.status(201).json({
      success: true,
      paymentUrl: result.paymentUrl,
      data: result.data,
    });
  } catch (error) {
    if (error instanceof PaymentLinkError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    const errorMessage =
      axios.isAxiosError(error) &&
      typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : error instanceof Error
        ? error.message
        : "Unknown error";

    console.error(
      "Failed to create payment link:",
      errorMessage
    );

    return res.status(502).json({
      success: false,
      message: "Failed to create payment link",
      error: errorMessage,
    });
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId } = req.body ?? {};

    if (
      typeof orderId !== "string" ||
      !mongoose.isValidObjectId(orderId)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid orderId is required",
      });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.paymentReference) {
      return res.status(400).json({
        success: false,
        message: "Order has no payment reference",
      });
    }

    const response = await squad().get(
      `/transaction/verify/${order.paymentReference}`
    );

    const paymentData = response.data;

    const transactionStatus =
      paymentData?.data?.transaction_status;

    if (
      transactionStatus === "Success" &&
      order.paymentStatus !== "paid"
    ) {
      order.paymentStatus = "paid";
      order.status = "completed";

      await order.save();
    }

    return res.status(200).json({
      success: true,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
      data: paymentData,
    });
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) &&
      typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : error instanceof Error
        ? error.message
        : "Unknown error";

    console.error(
      "Failed to verify payment:",
      errorMessage
    );

    return res.status(502).json({
      success: false,
      message: "Payment verification failed",
      error: errorMessage,
    });
  }
};