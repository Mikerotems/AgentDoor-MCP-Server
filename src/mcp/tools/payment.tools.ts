import { z } from "zod";
import { orderModel } from "../../models/orderModel";
import squad from "../../services/squad.service";

export const verifyPaymentTool = {
  name: "verify_payment",

  description:
    "Verify an order payment directly with Squad and update the order status.",

  inputSchema: z.object({
    orderId: z.string(),
  }),

  execute: async ({
    orderId,
  }: {
    orderId: string;
  }) => {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return {
        success: false,
        message: "Order not found",
      };
    }

    if (!order.paymentReference) {
      return {
        success: false,
        message: "No payment reference found for this order",
      };
    }

    const response = await squad().get(
      `/transaction/verify/${order.paymentReference}`
    );

    const transactionStatus =
      response.data?.data?.transaction_status;

    if (
      transactionStatus === "Success" &&
      order.paymentStatus !== "paid"
    ) {
      order.paymentStatus = "paid";
      order.status = "completed";

      await order.save();
    }

    return {
      success: true,
      orderId: order._id,
      paymentReference: order.paymentReference,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
      squadResponse: response.data,
    };
  },
};

export const getPaymentStatusTool = {
  name: "get_payment_status",

  description:
    "Get the payment status of an order.",

  inputSchema: z.object({
    orderId: z.string(),
  }),

  execute: async ({
    orderId,
  }: {
    orderId: string;
  }) => {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return {
        success: false,
        message: "Order not found",
      };
    }

    return {
      success: true,
      orderId: order._id,
      paymentReference: order.paymentReference,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
    };
  },
};