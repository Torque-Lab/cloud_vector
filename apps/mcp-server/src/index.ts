import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import express from "express";

const app = express();
app.use(express.json());

const server = new McpServer({
  name: "example-mcp-server",
  version: "1.0.0",
});

server.registerTool(
  "echo",
  {
    description: "Echoes back whatever input is provided",
    inputSchema: {
      message: z.string(),
    },
  },
  async ({ message }) => {
    return {
      content: [
        { type: "text", text: message }
      ],
    };
  }
);

server.registerTool(
  "weather",
  {
    description: "Fetches weather for a given city (mocked)",
    inputSchema: {
      city: z.string(),
    },
  },
  async ({ city }) => {
    return {
      content: [
        {
          type: "text",
          text: `Weather in ${city}: Sunny, 22°C, humidity 65%`
        }
      ],
    };
  }
);

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,  // optional
  });

  await server.connect(transport);

  // transport expects body to be parsed JSON of the RPC request
  await transport.handleRequest(req, res, req.body)
});

const port = 4000;
app.listen(port, () => {
  console.log(`MCP server listening on http://localhost:${port}/mcp`);
});
