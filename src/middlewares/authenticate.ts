import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

console.log("AUTH FILE LOADED");

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable must be configured`);
  }
  return value;
}

const KEYCLOAK_URL = new URL(getRequiredEnv("KEYCLOAK_URL"));
const REALM = getRequiredEnv("KEYCLOAK_REALM");
const CLIENT_ID = getRequiredEnv("KEYCLOAK_CLIENT_ID");
const configuredPath = KEYCLOAK_URL.pathname.replace(/\/+$/, "");
const ISSUER =
  /\/realms\/[^/]+$/.test(configuredPath)
    ? `${KEYCLOAK_URL.origin}${configuredPath}`
    : `${KEYCLOAK_URL.origin}${configuredPath}/realms/${encodeURIComponent(REALM)}`;

const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/protocol/openid-connect/certs`));

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("=== AUTH MIDDLEWARE HIT ===");
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.trim().match(/^Bearer\s+(\S+)$/i)?.[1];

    if (!token) {
      return res.status(401).json({
        error: "Invalid authorization header"
      });
    }

    const { payload } =
      await jwtVerify(
        token, JWKS,
        {
          issuer: ISSUER
        }
      );
    req.user = payload;

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({
      error: "Invalid token"
    });
  }
}