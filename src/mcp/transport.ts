import crypto from "crypto";
import { StreamableHTTPServerTransport }
from "@modelcontextprotocol/sdk/server/streamableHttp.js";

export function createTransport() {
  return new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });
}