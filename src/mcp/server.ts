import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { refundOrderTool } from "./tools/refundOrder.tool";
import { listOrdersTool } from "./tools/listOrders.tool";
import { getOrderTool } from "./tools/getOrder.tool";
import {
  createPaymentLinkTool,
  getPaymentStatusTool,
  verifyPaymentTool,
} from "./tools/payment.tools";
import { createCustomerTool } from "./tools/createCustomer.tool";
import { createOrderTool } from "./tools/createOrder.tool";

export const mcpServer = new McpServer({
  name: "AgentDoor MCP Server",
  version: "1.0.0",
});

mcpServer.tool(
  createCustomerTool.name,
  createCustomerTool.description,
  createCustomerTool.inputSchema,
  async (args) => {
    const result = await createCustomerTool.execute(args);
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
  createOrderTool.name,
  createOrderTool.description,
  createOrderTool.inputSchema,
  async (args) => {
    const result = await createOrderTool.execute(args);
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
  createPaymentLinkTool.name,
  createPaymentLinkTool.description,
  createPaymentLinkTool.inputSchema.shape,
  async (args) => {
    const result = await createPaymentLinkTool.execute(args);
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
  createCustomerTool,
  createOrderTool,
  listOrdersTool,
  getOrderTool,
  refundOrderTool,
  createPaymentLinkTool,
  verifyPaymentTool,
  getPaymentStatusTool
];