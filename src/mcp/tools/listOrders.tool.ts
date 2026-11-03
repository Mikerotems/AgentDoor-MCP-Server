import { z } from "zod";
import { orderModel } from "../../models/orderModel";
import { logAudit } from "../../services/audit.service";

export const listOrdersTool = {
  name: "list_orders",

  description: "List orders by status",

  inputSchema: {
    status: z
      .enum([
        "pending",
        "paid",
        "refund_requested",
        "refund_approved",
      ])
      .optional(),
  },

  async execute(args: {
    status?:
      "pending" |
    "paid" |
    "refund_requested" |
    "refund_approved" | undefined;
  }) {
    const query: any = {};

    if (args.status) {
      query.status = args.status;
    }

    const orders = await orderModel.find(query);

    await logAudit(
      "agent",
      "list_orders",
      args,
      orders
    );

    return orders;
  },
};