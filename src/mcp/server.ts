import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { refundOrderTool } from "./tools/refundOrder.tool";
import { listOrdersTool } from "./tools/listOrders.tool";
import { getOrderTool } from "./tools/getOrder.tool";
import { getPaymentStatusTool, verifyPaymentTool } from "./tools/payment.tools";

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
    const result = await getOrderTool.execute(args as { orderId: string });

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
  refundOrderTool.name,
  refundOrderTool.description,
  refundOrderTool.inputSchema,
  async (args) => {
    const result =
      await refundOrderTool.execute(args);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            result,
            null,
            2
          ),
        },
      ],
    };
  }
);

mcpServer.tool(
  verifyPaymentTool.name,
  verifyPaymentTool.description,
  verifyPaymentTool.inputSchema.shape,
   async (args) => {
    const result =
      await verifyPaymentTool.execute(args as { orderId: string });
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
  getPaymentStatusTool.name,
  getPaymentStatusTool.description,
  getPaymentStatusTool.inputSchema.shape,
  async (args) => {
    const result = await getPaymentStatusTool.execute(args as { orderId: string });
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
  refundOrderTool,
  verifyPaymentTool,
  getPaymentStatusTool
];