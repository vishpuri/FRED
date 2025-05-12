import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { handleRRPONTSYD } from "./tools/RRPONTSYD.js";
import { z } from "zod";

// Create server instance with detailed description
const server = new McpServer({
  name: "fred",
  version: "0.1.0",
  description: "Federal Reserve Economic Data (FRED) MCP Server for retrieving economic data series"
});

// Register the RRPONTSYD tool
server.tool(
  "RRPONTSYD",
  "Retrieve data for Overnight Reverse Repurchase Agreements (RRPONTSYD) from FRED",
  {
    start_date: z.string().optional().describe("Start date in YYYY-MM-DD format"),
    end_date: z.string().optional().describe("End date in YYYY-MM-DD format"),
    limit: z.number().optional().describe("Maximum number of observations to return"),
    sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order of observations")
  },
  // Add explicit logging to the handler
  async (input) => {
    console.error(`RRPONTSYD tool called with params: ${JSON.stringify(input)}`);
    const result = await handleRRPONTSYD(input);
    console.error("RRPONTSYD tool handling complete");
    return result;
  }
);

// Run server with connect method and proper error handling
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
