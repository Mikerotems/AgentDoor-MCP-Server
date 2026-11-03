import { z } from "zod";
import { orderModel } from "../../models/orderModel";
import { logAudit } from "../../services/audit.service";

export const getOrderTool = {
  name: "get_order",

  description: "Get a single order by ID",

  inputSchema: {
    orderId: z.string(),
  },

  async execute(args: {
    orderId: string;
  }) {
    const order = await orderModel
      .findById(args.orderId)
      .populate("customerId");

    if (!order) {
      throw new Error("Order not found");
    }

    await logAudit(
      "agent",
      "get_order",
      args,
      order
    );

    return order;
  },
};
