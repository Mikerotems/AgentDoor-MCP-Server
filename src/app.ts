import "dotenv/config";
import express from "express";
import metadataRouter from "./routes/metadata.routes";
import protectedRouter from "./routes/protected.routes";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

app.use("/api", protectedRouter);

app.use("/api", metadataRouter);

export default app;