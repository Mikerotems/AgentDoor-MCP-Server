import { timingSafeEqual } from "node:crypto";
import { Request, Response, NextFunction } from "express";

export function authenticateMcp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const configuredApiKey = process.env.MCP_API_KEY;

  if (!configuredApiKey) {
    return res.status(503).json({
      error: "MCP_API_KEY is not configured",
    });
  }

  const providedApiKey = req
    .header("authorization")
    ?.match(/^Bearer\s+(\S+)$/i)?.[1];

  if (!providedApiKey) {
    return res.status(401).json({
      error: "A Bearer token is required",
    });
  }

  const expected = Buffer.from(configuredApiKey);
  const provided = Buffer.from(providedApiKey);

  if (
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  ) {
    return res.status(401).json({
      error: "Invalid Bearer token",
    });
  }

  next();
}
