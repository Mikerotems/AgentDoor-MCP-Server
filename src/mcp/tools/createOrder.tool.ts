import { z } from "zod";
import { customerModel } from "../../models/customerModel";
import { orderModel } from "../../models/orderModel";
import { logAudit } from "../../services/audit.service";

export const createOrderTool = {
  name: "create_order",

  description:
    "Create a pending, unpaid order for an existing customer. Provide the amount in kobo.",

  inputSchema: {
    customerId: z
      .string()
      .regex(/^[a-f\d]{24}$/i, "customerId must be a valid MongoDB ObjectId"),
    amountKobo: z.number().finite().positive(),
    note: z.string().optional(),
  },

  async execute(args: {
    customerId: string;
    amountKobo: number;
    note?: string | undefined;
  }) {
    const customer = await customerModel.findById(args.customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const order = await orderModel.create({
      customerId: args.customerId,
      amountKobo: args.amountKobo,
      note: args.note,
      status: "pending",
      paymentStatus: "unpaid",
    });

    await logAudit("agent", "create_order", args, order);

    return order;
  },
};
