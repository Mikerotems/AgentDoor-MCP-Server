import { Request, Response } from "express";
import { orderModel } from "../models/orderModel";
import { pendingActionModel } from "../models/pendingActionModel";

export async function approveRefund(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const pendingAction =
      await pendingActionModel.findById(id);

    if (!pendingAction) {
      return res.status(404).json({
        error: "Pending action not found",
      });
    }

    // Already executed
    if (pendingAction.executedAt) {
      return res.status(409).json({
        error:
          "This refund action has already been executed",
      });
    }

    // Expired
    if (pendingAction.expiresAt < new Date()) {
      pendingAction.status = "expired";

      await pendingAction.save();

      return res.status(400).json({
        error: "Approval request has expired",
      });
    }

    // Approve
    pendingAction.status = "approved";

    pendingAction.approvedAt =
      new Date();

    pendingAction.executedAt =
      new Date();

    pendingAction.approvedBy =
      "human-admin";

    await pendingAction.save();

    // Update Order
    const order =
      await orderModel.findById(
        pendingAction.order
      );

    if (order) {
      order.status =
        "refund_approved";

      await order.save();
    }

    return res.status(200).json({
      message:
        "Refund approved successfully",
      actionId: pendingAction._id,
      orderId:
        pendingAction.order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "Failed to approve refund",
    });
  }
}