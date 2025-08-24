# Gmail MCP Server

## Available Tools

### Addition Tool (Testing/Learning)
The Addition Server provides a simple tool for testing and learning MCP server functionality.

### Gmail Tool - Read Last 10 Emails

The Gmail MCP server provides a tool to read the last 10 emails from your inbox.

### Tool Details:
- **Name**: `read-emails`
- **Description**: Read emails from inbox
- **Parameters**: None (reads last 10 emails by default)
- **Returns**: JSON formatted email data with From, Subject, Date, and Snippet

## Setup Steps

### 1. Get Token
First, run `getToken.js` to authenticate and get your Gmail access token:
```bash
node getToken.js
```

This will:
- Use your `credentials.json` file
- Open a browser for Gmail authorization
- Save the token to `token.json`

### 2. Start the Server
After getting the token, run the Gmail MCP server:
```bash
node gmail.js
```

## Claude Desktop Configuration

Add this to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "Addition Server": {
      "command": "node",
      "args": ["/Users/prince/princekumarcode/mcp-weather/add.js"]
    },
    "Gmail Server": {
      "command": "node",
      "args": ["/Users/prince/princekumarcode/mcp-weather/gmail.js"]
    }
  }
}
```