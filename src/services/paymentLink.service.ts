import mongoose from "mongoose";
import { customerModel } from "../models/customerModel";
import { orderModel } from "../models/orderModel";
import squad from "./squad.service";

export class PaymentLinkError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "PaymentLinkError";
  }
}

export async function createPaymentLinkForOrder(
  orderId: string,
  email?: string
) {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new PaymentLinkError(400, "A valid orderId is required");
  }

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new PaymentLinkError(404, "Order not found");
  }

  const customer = await customerModel.findById(order.customerId);

  if (!customer) {
    throw new PaymentLinkError(404, "Order customer not found");
  }

  const paymentEmail =
    typeof email === "string" && email.trim()
      ? email.trim()
      : typeof customer.email === "string"
      ? customer.email.trim()
      : "";

  if (!paymentEmail) {
    throw new PaymentLinkError(
      400,
      "A customer email is required to create a payment link"
    );
  }

  const transactionRef = `ORD-${Date.now()}`;
  const response = await squad().post("/transaction/initiate", {
    email: paymentEmail,
    amount: order.amountKobo,
    transaction_ref: transactionRef,
    currency: "NGN",
    initiate_type: "inline",
  });

  const paymentUrl = response.data?.data?.checkout_url;

  if (typeof paymentUrl !== "string" || !paymentUrl) {
    throw new PaymentLinkError(
      502,
      "Squad did not return a checkout URL"
    );
  }

  order.paymentReference = transactionRef;
  order.paymentStatus = "pending";
  await order.save();

  return {
    order,
    paymentReference: transactionRef,
    paymentUrl,
    data: response.data,
  };
}
