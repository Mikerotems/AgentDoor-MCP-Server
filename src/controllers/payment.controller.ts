import axios from "axios";
import { Request, Response } from "express";
import mongoose from "mongoose";
import squad from "../services/squad.service";
import { customerModel } from "../models/customerModel";
import { orderModel } from "../models/orderModel";

export const createPaymentLink = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId, email } = req.body ?? {};

    if (
      typeof orderId !== "string" ||
      !mongoose.isValidObjectId(orderId)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid orderId is required",
      });
    }

    const order = await orderModel
      .findById(orderId)
      .populate("customerId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const customer = await customerModel.findById(
      order.customerId
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Order customer not found",
      });
    }

    const paymentEmail =
      typeof email === "string" && email.trim()
        ? email.trim()
        : typeof customer.email === "string"
        ? customer.email.trim()
        : "";

    if (!paymentEmail) {
      return res.status(400).json({
        success: false,
        message:
          "A customer email is required to create a payment link",
      });
    }

    const txRef = `ORD-${Date.now()}`;

    const response = await squad().post(
      "/transaction/initiate",
      {
        email: paymentEmail,
        amount: order.amountKobo,
        transaction_ref: txRef,
        currency: "NGN",
        initiate_type: "inline",
      }
    );

    const checkoutUrl =
      response.data?.data?.checkout_url;

    if (
      typeof checkoutUrl !== "string" ||
      !checkoutUrl
    ) {
      return res.status(502).json({
        success: false,
        message: "Squad did not return a checkout URL",
      });
    }

    order.paymentReference = txRef;
    order.paymentStatus = "pending";

    await order.save();

    return res.status(201).json({
      success: true,
      paymentUrl: checkoutUrl,
      data: response.data,
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