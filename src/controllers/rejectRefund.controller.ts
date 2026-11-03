import { Request, Response } from "express";
import { pendingActionModel } from "../models/pendingActionModel";

export async function rejectRefund(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const { reason } = req.body;

    const pendingAction =
      await pendingActionModel.findById(id);

    if (!pendingAction) {
      return res.status(404).json({
        error: "Pending action not found",
      });
    }

    if (pendingAction.executedAt) {
      return res.status(409).json({
        error:
          "Action already executed",
      });
    }

    pendingAction.status =
      "rejected";

    pendingAction.approvedBy =
      "human-admin";

    pendingAction.rejectionReason =
      reason || "No reason provided";

    pendingAction.executedAt =
      new Date();

    await pendingAction.save();

    return res.status(200).json({
      message:
        "Refund request rejected",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "Failed to reject refund",
    });
  }
}