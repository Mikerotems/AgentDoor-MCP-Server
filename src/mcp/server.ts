import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { weatherTool } from "./tools/weather.tool";
import { customerTool } from "./tools/customer.tool";

import { listOrdersTool } from "./tools/listOrders.tool";
import { getOrderTool } from "./tools/getOrder.tool";

export const mcpServer = new McpServer({
  name: "AgentDoor MCP Server",
  version: "1.0.0",
});

mcpServer.tool(
  listOrdersTool.name,
  listOrdersTool.description,
  listOrdersTool.inputSchema,
  async (args) => {
    const result = await listOrdersTool.execute({ status: args.status,
});
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);

mcpServer.tool(
  getOrderTool.name,
  getOrderTool.description,
  getOrderTool.inputSchema,
  async (args) => {
    const result = await getOrderTool.execute(args);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
);


export const tools = [
  listOrdersTool,
  getOrderTool,
];
