import express from "express";
import {metadataRouter} from "./routes/metadata.routes.js";

export const app = express();

app.use(express.json());
app.use(metadataRouter);


