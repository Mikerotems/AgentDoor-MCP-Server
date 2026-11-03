import { z } from "zod";
import { orderModel } from "../../models/orderModel";
import { logAudit } from "../../services/audit.service";
import { pendingActionModel } from "../../models/pendingActionModel";

export const refundOrderTool = {
  name: "refund_order",

  description:
    "Create a refund request that requires human approval before execution.",

  inputSchema: {
    orderId: z.string(),
    reason: z.string().optional(),
  },

  async execute(args: {
    orderId: string;
    reason?: string | undefined;
  }) {
    // Verify order exists
    const order = await orderModel.findById(args.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Prevent duplicate pending refunds
    const existingPendingAction =
      await pendingActionModel.findOne({
        order: args.orderId,
        type: "refund_order",
        status: "pending",
      });

    if (existingPendingAction) {
      return {
        message:
          "Refund request already exists and is awaiting approval",
        actionId: existingPendingAction._id,
      };
    }

    // Update order status
    order.status = "refund_requested";
    await order.save();

    // Expires in 24 hours
    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    const pendingAction =
      await pendingActionModel.create({
        type: "refund_order",
        order: order._id,
        createdBy: "agent",
        expiresAt,
      });

    const result = {
      message:
        "Refund request created successfully",
      actionId: pendingAction._id,
      orderId: order._id,
      status: pendingAction.status,
      expiresAt,
    };

    await logAudit(
      "agent",
      "refund_order",
      args,
      result
    );

    return result;
  },
};