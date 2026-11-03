import { z } from "zod";
import { orderModel } from "../../models/orderModel";

export const getOrderTool = {
  name: "get_order",

  description: "Get a single order",

  inputSchema: {
    orderId: z.string(),
  },

  async execute(args: { orderId: string }) {
    return await orderModel
      .findById(args.orderId)
      .populate("customerId");
  },
};