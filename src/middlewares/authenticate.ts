import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL(
    "http://localhost:8080/realms/AgentDoor/protocol/openid-connect/certs"
  )
);

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Missing token",
      });
    }

    const token = authHeader.slice("Bearer ".length);

    const { payload } = await jwtVerify(token, JWKS, {
      issuer:
        "http://localhost:8080/realms/AgentDoor",
    });

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}