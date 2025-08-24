import fs from "fs";
import readline from "readline";
import { google } from "googleapis";

const credentials = JSON.parse(fs.readFileSync("credentials.json", "utf8"));

// 👇 Destructure from installed
const { client_id, client_secret, redirect_uris } = credentials.installed;

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = "token.json";

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0] // "http://localhost"
);

// Step 1: Generate auth URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("Authorize this app by visiting this URL:\n", authUrl);

// Step 2: Prompt user for code
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nEnter the code from that page here: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log(`✅ Token stored in ${TOKEN_PATH}`);
  } catch (err) {
    console.error("❌ Error retrieving access token", err);
  }
  rl.close();
});
