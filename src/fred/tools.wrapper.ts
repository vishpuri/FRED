/**
 * Wrapper module for FRED tool definitions
 * 
 * Provides a testable interface to the tools module
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SERIES_REGISTRY } from "./registry.js";
import { fetchSeriesData, FREDQueryOptions } from "./client.js";
import * as toolsModule from "./tools.js";

/**
 * Wrapper class for FRED tools functionality
 */
export class FREDToolsWrapper {
  // Store original functions from the tools module
  private _registerSeriesTool: typeof toolsModule.registerSeriesTool;
  private _registerDynamicSeriesTool: typeof toolsModule.registerDynamicSeriesTool;
  private _handleDynamicSeries: typeof toolsModule.handleDynamicSeries;
  
  // Dependency for data fetching
  private _fetchSeriesData: typeof fetchSeriesData;
  
  /**
   * Create a new tools wrapper
   * Allows for dependency injection during tests
   */
  constructor(
    registerSeriesTool = toolsModule.registerSeriesTool,
    registerDynamicSeriesTool = toolsModule.registerDynamicSeriesTool,
    handleDynamicSeries = toolsModule.handleDynamicSeries,
    fetchSeriesData_ = fetchSeriesData
  ) {
    this._registerSeriesTool = registerSeriesTool;
    this._registerDynamicSeriesTool = registerDynamicSeriesTool;
    this._handleDynamicSeries = handleDynamicSeries;
    this._fetchSeriesData = fetchSeriesData_;
  }
  
  /**
   * Register a tool for a specific FRED data series
   */
  registerSeriesTool(server: McpServer, seriesId: string): void {
    this._registerSeriesTool(server, seriesId);
  }
  
  /**
   * Register the dynamic series lookup tool
   */
  registerDynamicSeriesTool(server: McpServer): void {
    this._registerDynamicSeriesTool(server);
  }
  
  /**
   * Handle requests to the dynamic series tool
   * This is a testable wrapper around the original function
   */
  async handleDynamicSeries(input: FREDQueryOptions & { series_id: string }) {
    try {
      // Extract the series ID from input
      const { series_id, ...queryParams } = input;
      
      // Call the data fetcher with the extracted parameters
      return await this._fetchSeriesData(series_id, queryParams);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve FRED series data: ${error.message}`);
      }
      throw error;
    }
  }
  
  /**
   * Register a series handler with logging for a specific series
   * This duplicates the functionality in the original module for testing
   */
  createSeriesHandler(seriesId: string) {
    return async (input: any) => {
      console.error(`${seriesId} tool called with params: ${JSON.stringify(input)}`);
      const result = await this._fetchSeriesData(seriesId, input);
      console.error(`${seriesId} tool handling complete`);
      return result;
    };
  }
  
  /**
   * Register a dynamic series handler with logging
   * This duplicates the functionality in the original module for testing
   */
  createDynamicSeriesHandler() {
    return async (input: any) => {
      console.error(`FREDSeries tool called with params: ${JSON.stringify(input)}`);
      const result = await this.handleDynamicSeries(input);
      console.error("FREDSeries tool handling complete");
      return result;
    };
  }
  
  /**
   * Register all standard series tools with a server
   */
  registerAllSeriesTools(server: McpServer, seriesIds: string[]): void {
    seriesIds.forEach(seriesId => this.registerSeriesTool(server, seriesId));
    this.registerDynamicSeriesTool(server);
  }
}

// Export a singleton instance for convenience
export default new FREDToolsWrapper();