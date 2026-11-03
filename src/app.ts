import "dotenv/config";
import express from "express";

import toolsRouter from "./routes/tools.routes";
import metadataRouter from "./routes/metadata.routes";
import protectedRouter from "./routes/protected.routes";
import mcpRouter from "./routes/mcp.routes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "AgentDoor MCP Server Running",
  });
});

app.use("/api", metadataRouter);
app.use("/api", protectedRouter);
app.use("/api", toolsRouter);
app.use("/", mcpRouter);

export default app;