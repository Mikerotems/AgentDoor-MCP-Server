import { Router } from "express";

const metadataRouter = Router();

console.log("METADATA ROUTER LOADED");

metadataRouter.get(
  "/.well-known/oauth-protected-resource",
  (req, res) => {
    console.log("METADATA ROUTE HIT");

    res.json({
      resource: "http://localhost:5000",
      authorization_servers: [
        "http://localhost:8080/realms/AgentDoor",
      ],
    });
  }
);

export default metadataRouter;