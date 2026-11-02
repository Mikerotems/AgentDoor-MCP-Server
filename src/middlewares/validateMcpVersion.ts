import { Request, Response, NextFunction } from "express";

export function validateMcpVersion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const version = req.header("MCP-Version");

  if (!version) {
    return res.status(400).json({
      error: "Missing MCP-Version header"
    });
  }

  next();
}