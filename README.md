# AgentDoor MCP Server

## Deploy to Render

The `render.yaml` Blueprint builds and starts the server from this GitHub
repository. Push the changes to GitHub, then in Render choose **New → Blueprint**
and select the repository. Render will build with `npm ci && npm run build` and
start the service with `npm start`.

Set these values in the Render service's environment:

- `DBURI`: MongoDB connection string.
- `MCP_API_KEY`: a long, unique secret used to authorize MCP requests.
- `KEYCLOAK_URL`, `KEYCLOAK_REALM`, and `KEYCLOAK_CLIENT_ID`: required by the
  existing API authentication middleware for the server to start.
- `SQUAD_BASE_URL` and `SQUAD_SECRET_KEY`: required when using the payment-link
  tool.

The Blueprint marks these values as secrets to be entered in Render; do not
commit them to this repository. Once the service is live, its MCP endpoint is:

```text
https://<your-render-service>.onrender.com/mcp
```

The service root (`/`) is used for Render's health check.

## Connect with MCP Inspector

The server runs on Render; Inspector runs on your computer and connects to the
deployed endpoint. Start Inspector with:

```sh
npx -y @modelcontextprotocol/inspector
```

In the Inspector UI, select **Streamable HTTP**, enter the MCP endpoint above,
and add this request header using the same secret configured as `MCP_API_KEY` in
Render:

```text
Authorization: Bearer <your-MCP_API_KEY>
```

Connect, then use the **Tools** tab to inspect and call the available tools.
