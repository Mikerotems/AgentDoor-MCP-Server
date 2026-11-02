import { Router } from "express";

const mcpRouter = Router();

mcpRouter.get("/.well-known/mcp", (req, res) => {
  res.json({
    name: "AgentDoor MCP Server",
    version: "1.0.0",
    transport: "http"
  });
});

export default mcpRouter;