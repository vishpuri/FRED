/**
 * MCP Tool Definitions for FRED API
 * 
 * Defines and registers MCP tools for accessing FRED data
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SERIES_REGISTRY } from "./registry.js";
import { fetchSeriesData, FREDQueryOptions } from "./client.js";

/**
 * Schema for FRED data query parameters
 */
const QUERY_PARAMS_SCHEMA = {
  start_date: z.string().optional().describe("Start date in YYYY-MM-DD format"),
  end_date: z.string().optional().describe("End date in YYYY-MM-DD format"),
  limit: z.number().optional().describe("Maximum number of observations to return"),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order of observations")
};

/**
 * Schema for the dynamic series tool that requires a series_id parameter
 */
const DYNAMIC_TOOL_SCHEMA = {
  series_id: z.string().describe("The FRED series ID to retrieve"),
  ...QUERY_PARAMS_SCHEMA
};

/**
 * Registers a tool for a specific FRED data series
 */
export function registerSeriesTool(server: McpServer, seriesId: string) {
  // Get metadata for the series
  const metadata = SERIES_REGISTRY[seriesId] || {
    title: `FRED Data Series: ${seriesId}`,
    description: `Economic data from FRED series ${seriesId}`,
    units: "Value"
  };

  // Register the series-specific tool
  server.tool(
    seriesId, 
    `Retrieve data for ${metadata.title} (${seriesId}) from FRED`,
    QUERY_PARAMS_SCHEMA,
    // Handler with logging
    async (input) => {
      console.error(`${seriesId} tool called with params: ${JSON.stringify(input)}`);
      const result = await fetchSeriesData(seriesId, input);
      console.error(`${seriesId} tool handling complete`);
      return result;
    }
  );
}

/**
 * Handles requests to the dynamic series tool
 */
export async function handleDynamicSeries(
  input: FREDQueryOptions & { series_id: string }
) {
  try {
    // Extract the series ID from input
    const { series_id, ...queryParams } = input;
    
    // Call the data fetcher with the extracted parameters
    return await fetchSeriesData(series_id, queryParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to retrieve FRED series data: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Registers the dynamic series tool that can access any FRED series
 */
export function registerDynamicSeriesTool(server: McpServer) {
  server.tool(
    "FREDSeries",
    "Retrieve data for any FRED data series by providing its series ID",
    DYNAMIC_TOOL_SCHEMA,
    async (input) => {
      console.error(`FREDSeries tool called with params: ${JSON.stringify(input)}`);
      const result = await handleDynamicSeries(input);
      console.error("FREDSeries tool handling complete");
      return result;
    }
  );
}