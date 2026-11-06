import { z } from "zod";
import { customerModel } from "../../models/customerModel";
import { logAudit } from "../../services/audit.service";

export const createCustomerTool = {
  name: "create_customer",

  description: "Create a customer with a name and email address.",

  inputSchema: {
    name: z.string().trim().min(1),
    email: z.string().trim().email(),
  },

  async execute(args: {
    name: string;
    email: string;
  }) {
    const existingCustomer = await customerModel.findOne({
      email: args.email,
    });

    if (existingCustomer) {
      throw new Error("Customer already exists");
    }

    const customer = await customerModel.create(args);

    await logAudit("agent", "create_customer", args, customer);

    return customer;
  },
};
