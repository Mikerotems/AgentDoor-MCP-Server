import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { weatherTool } from "./tools/weather.tool";
import { customerTool } from "./tools/customer.tool";

export const mcpServer = new McpServer({
  name: "AgentDoor MCP Server",
  version: "1.0.0",
});

mcpServer.tool(
  weatherTool.name,
  weatherTool.description,
  weatherTool.inputSchema,
  async ({ city }) => {
    const result = await weatherTool.execute({ city });

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
  customerTool.name,
  customerTool.description,
  customerTool.inputSchema,
  async ({ email }) => {
    const result = await customerTool.execute({ email });

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
  weatherTool,
  customerTool,
];
