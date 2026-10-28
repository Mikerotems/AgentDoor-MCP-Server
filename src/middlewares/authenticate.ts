import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable must be configured`);
  }
  return value;
}

const KEYCLOAK_BASE_URL = getRequiredEnv("KEYCLOAK_URL");
const REALM = getRequiredEnv("KEYCLOAK_REALM");
const CLIENT_ID = getRequiredEnv("KEYCLOAK_CLIENT_ID");

const JWKS = createRemoteJWKSet(
  new URL(
    `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/certs`
  )
);

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: "Missing authorization header"
      });
    }

    const token =
      authHeader.replace(
        "Bearer ", ""
      );

    const { payload } =
      await jwtVerify(
        token,
        JWKS,
        {
          issuer:
            `${KEYCLOAK_BASE_URL}/realms/${REALM}`,
          audience: CLIENT_ID
        }
      );

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token"
    });
  }
}