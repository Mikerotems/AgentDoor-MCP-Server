import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

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
    : `${KEYCLOAK_URL.origin}${configuredPath}/realms/${encodeURIComponent(
        REALM
      )}`;
const JWKS = createRemoteJWKSet(
  new URL(`${ISSUER}/protocol/openid-connect/certs`)
);

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("=== AUTH MIDDLEWARE HIT ===");

  try {
    const authHeader = req.headers.authorization;

    const token = authHeader
      ?.trim()
      .match(/^Bearer\s+(\S+)$/i)?.[1];

    if (!token) {
      return res.status(401).json({
        error: "Invalid authorization header",
      });
    }

    // DEBUG BLOCK
    const parts = token.split(".");

if (parts.length === 3 && parts[1]) {
  const decodedPayload = JSON.parse(
    Buffer.from(parts[1], "base64url").toString()
  );

  console.log("TOKEN ISSUER:", decodedPayload.iss);
  console.log("TOKEN AUDIENCE:", decodedPayload.aud);
}

    const { payload } = await jwtVerify(
      token,
      JWKS,
      {
        issuer: ISSUER,
      }
    );

    req.user = payload;

    next();
  } catch (error: any) {
  console.error("=== JWT VERIFICATION ERROR ===");
  console.error(error);
  console.error("MESSAGE:", error?.message);
  console.error("CODE:", error?.code);

  return res.status(401).json({
    error: "Invalid token",
    message: error?.message,
  });
}
}