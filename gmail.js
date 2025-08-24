import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { google } from 'googleapis';
import fs from "fs";


import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const credentials = JSON.parse(
    fs.readFileSync(path.join(__dirname, "credentials.json"), "utf8")
);


// Create an MCP server
const server = new McpServer({
    name: "Gmail Server",
    version: "1.0.0"
});

const auth = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]
);


// Load previously saved token
let tokens;
try {
    tokens = JSON.parse(fs.readFileSync(path.join(__dirname, "token.json"), "utf8"));
    auth.setCredentials(tokens);
} catch (err) {
    console.error("❌ No token.json found in", path.join(__dirname, "token.json"));
    process.exit(1);
}


// Create Gmail client
const gmail = google.gmail({ version: 'v1', auth });

const readEmails = async () => {
    try {
        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10
        });
        const emails = [];

        for (const msg of res.data.messages) {
            const fullMessage = await gmail.users.messages.get({
                userId: "me",
                id: msg.id,
                format: "metadata",
                metadataHeaders: ["From", "Subject", "Date"],
            });

            const headers = fullMessage.data.payload.headers;

            const from = headers.find((h) => h.name === "From")?.value || "Unknown";
            const subject =
                headers.find((h) => h.name === "Subject")?.value || "(No Subject)";
            const date = headers.find((h) => h.name === "Date")?.value || "";
            const snippet = fullMessage.data.snippet || "";

            emails.push({
                id: msg.id,
                from,
                subject,
                date,
                snippet,
            });
        }

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(emails, null, 2), // Pretty print
                },
            ],
        };
    } catch (error) {
        console.error("❌ Failed to read emails:", error);
        return {
            content: [{ type: "text", text: "Failed to read emails" }]
        }
    }
}

server.tool(
    "read-emails",
    "Read emails from inbox",
    {},
    async () => readEmails()
);

// Start the server with stdio transport
async function startServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("✅ MCP Gmail Server started and ready to receive requests");
}

startServer().catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
});