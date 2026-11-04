import { Request, Response } from "express";
import { orderModel } from "../models/orderModel";

export const squadWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("SQUAD WEBHOOK:", req.body);

    const { Event, Body } = req.body;

    if (
      Event === "charge_successful" &&
      Body?.transaction_status === "Success"
    ) {
      const txRef = Body.transaction_ref;

      const order = await orderModel.findOne({
        paymentReference: txRef,
      });

      if (
        order &&
        order.paymentStatus !== "paid"
      ) {
        order.paymentStatus = "paid";
        order.status = "completed";

        await order.save();
      }
    }

    res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      received: false,
    });
  }
};