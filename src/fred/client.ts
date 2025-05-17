/**
 * FRED API Client
 * 
 * Core functionality for fetching data from the FRED API
 */
import { FREDSeriesMetadata, SERIES_REGISTRY } from "./registry.js";
import { makeRequest, SeriesObservationsResponse } from "../common/request.js";

/**
 * Options for FRED data queries
 */
export interface FREDQueryOptions {
  start_date?: string;
  end_date?: string;
  limit?: number;
  sort_order?: "asc" | "desc";
}

/**
 * Fetches economic data for a specific FRED series
 * 
 * @param seriesId - FRED series identifier (e.g., "CPIAUCSL")
 * @param options - Query parameters for filtering the data
 * @returns Formatted series data with metadata
 */
export async function fetchSeriesData(
  seriesId: string,
  options: FREDQueryOptions
) {
  try {
    // Prepare query parameters
    const queryParams: Record<string, string | number | boolean> = {
      series_id: seriesId
    };

    // Add optional parameters if provided
    if (options.start_date) queryParams.observation_start = options.start_date;
    if (options.end_date) queryParams.observation_end = options.end_date;
    if (options.limit) queryParams.limit = options.limit;
    if (options.sort_order) queryParams.sort_order = options.sort_order;

    // Make the request to FRED API
    const response = await makeRequest<SeriesObservationsResponse>(
      "series/observations",
      queryParams
    );

    // Get metadata for this series
    const metadata = SERIES_REGISTRY[seriesId] || {
      title: `FRED Data Series: ${seriesId}`,
      description: `Economic data from FRED series ${seriesId}`,
      units: "Value"
    };

    // Transform the data for easier consumption
    const formattedData = response.observations.map(obs => ({
      date: obs.date,
      value: parseFloat(obs.value),
      units: metadata.units,
    }));

    const responseData = {
      title: metadata.title,
      description: metadata.description,
      source: "Federal Reserve Economic Data (FRED)",
      series_id: seriesId,
      total_observations: response.count,
      data: formattedData
    };

    return {
      content: [{ 
        type: "text" as const, 
        text: JSON.stringify(responseData, null, 2) 
      }]
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to retrieve ${seriesId} data: ${error.message}`);
    }
    throw error;
  }
}