import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Addition Server",
  version: "1.0.0"
});

server.tool(
    "Addition-Tool",
    "Add two numbers",
    {
        a: z.number(),
        b: z.number()
    },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a*b) }]
    })
);

// Start the server with stdio transport
async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ MCP Addition Server started and ready to receive requests");
}

startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
