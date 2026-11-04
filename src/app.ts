import "dotenv/config";
import express from "express";

import toolsRouter from "./routes/tools.routes";
import metadataRouter from "./routes/metadata.routes";
import protectedRouter from "./routes/protected.routes";
import mcpRouter from "./routes/mcp.routes";
import approvalRouter from "./routes/approval.routes";
import orderRouter from "./routes/order.routes";
import customerRouter from "./routes/customer.routes";
import paymentRouter from "./routes/payment.routes";
import webhookRouter from "./routes/webhook.routes";


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
app.use("/api", approvalRouter);
app.use("/api/orders", orderRouter);
app.use("/api/customers", customerRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/webhooks", webhookRouter);

export default app;