import { z } from "zod";

export const customerTool = {
  name: "search_customer",

  description: "Search customer information",

  inputSchema: {
    email: z.string().email(),
  },

  async execute(args: { email: string }) {
    return {
      email: args.email,
      status: "Active",
      plan: "Premium",
    };
  },
};