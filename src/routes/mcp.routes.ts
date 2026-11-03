import { Router } from "express";
import { createTransport } from "../mcp/transport";
import { mcpServer } from "../mcp/server";

const mcpRouter = Router();

const transport = createTransport();

// Connect ONCE when the app starts
mcpServer.connect(transport).catch(console.error);

mcpRouter.get("/.well-known/mcp", (req, res) => {
  res.json({
    name: "AgentDoor MCP Server",
    version: "1.0.0",
    transport: "http",
  });
});

mcpRouter.post("/mcp", async (req, res) => {
  try {
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "MCP transport error",
    });
  }
});

export default mcpRouter;