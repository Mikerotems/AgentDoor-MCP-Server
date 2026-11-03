import { z } from "zod";
import { orderModel } from "../../models/orderModel";

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

  async execute(args: { status?: string | undefined }) {
    const query: any = {};

    if (args.status) {
      query.status = args.status;
    }

    return await orderModel.find(query);
  },
};