import { GoogleGenAI } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const transport = new StreamableHTTPClientTransport(
  new URL("http://localhost:4000/mcp"),
  {
    requestInit: {
      headers: {
        Authorization: `Bearer ${process.env.MCP_API_KEY || ""}`,
      },
    },
  }
);

const mcpClient = new Client({
  name: "my-client",
  version: "1.0.0",
  transport,
});

async function connectToServer() {
  await mcpClient.connect(transport);
}
await connectToServer();

const tools = await mcpClient.listTools();
console.log("Available tools:", tools);

// async function chatWithGemini(userInput: string) {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: userInput,
//   });
//   console.log('Gemini response:', response);
// }

// chatWithGemini('Fetch weather data for New York');
