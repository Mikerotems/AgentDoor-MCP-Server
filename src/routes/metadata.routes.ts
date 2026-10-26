import { Router } from "express";

export const metadataRouter = Router();

metadataRouter.get(
  "/.well-known/oauth-protected-resource",
  (req, res) => {
    res.json({
      resource: "http://localhost:5000",
      authorization_servers: [
        "http://localhost:8080/realms/AgentDoor",
      ],
    });
  }
);
