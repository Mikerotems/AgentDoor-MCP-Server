import { Request, Response } from "express";

import { tools } from "../mcp/server";

export async function getAvailableTools(
  req: Request,
  res: Response
) {
  res.json(
    tools.map((tool:any) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }))
  );
}