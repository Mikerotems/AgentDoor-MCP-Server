import { z } from "zod";

export const weatherTool = {
  name: "weather",

  description: "Get weather information for a city",

  inputSchema: {
    city: z.string().describe("City name"),
  },

  async execute(args: { city: string }) {
    return {
      city: args.city,
      temperature: "30°C",
      condition: "Sunny",
    };
  },
};