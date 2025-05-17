import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerSeriesTool, registerDynamicSeriesTool } from "./fred/tools.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get package.json version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

/**
 * Main FRED MCP Server
 * 
 * Provides access to Federal Reserve Economic Data through the
 * Model Context Protocol
 */
const server = new McpServer({
  name: "fred",
  version: packageJson.version,
  description: "Federal Reserve Economic Data (FRED) MCP Server for retrieving economic data series"
});

// Register individual series tools
registerSeriesTool(server, "RRPONTSYD");  // Overnight Reverse Repurchase Agreements
registerSeriesTool(server, "CPIAUCSL");   // Consumer Price Index

// To add more series, simply add them here:
// registerSeriesTool(server, "GDPC1");    // Gross Domestic Product
// registerSeriesTool(server, "UNRATE");   // Unemployment Rate
// registerSeriesTool(server, "FEDFUNDS"); // Federal Funds Rate

// Register the dynamic series lookup tool
registerDynamicSeriesTool(server);

/**
 * Start the MCP server
 */
async function main() {
  console.error("FRED MCP Server starting...");
  const transport = new StdioServerTransport();

  try {
    await server.connect(transport);
    console.error("FRED MCP Server running on stdio");

    // Keep the process running
    process.on('SIGINT', () => {
      console.error("Server shutting down...");
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
