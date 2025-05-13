import { z } from "zod";
import { makeRequest, SeriesObservationsResponse } from "../common/request.js";

/**
 * Handler for retrieving Consumer Price Index for All Urban Consumers data from FRED
 */
export async function handleCPIAUCSL(
  input: { start_date?: string; end_date?: string; limit?: number; sort_order?: "asc" | "desc" }
) {
  try {
    // CPIAUCSL is the series ID for Consumer Price Index for All Urban Consumers
    const seriesId = "CPIAUCSL";

    // Prepare query parameters
    const queryParams: Record<string, string | number | boolean> = {
      series_id: seriesId
    };

    // Add optional parameters if provided
    if (input.start_date) queryParams.observation_start = input.start_date;
    if (input.end_date) queryParams.observation_end = input.end_date;
    if (input.limit) queryParams.limit = input.limit;
    if (input.sort_order) queryParams.sort_order = input.sort_order;

    // Make the request to FRED API
    const response = await makeRequest<SeriesObservationsResponse>(
      "series/observations",
      queryParams
    );

    // Transform the data for easier consumption
    const formattedData = response.observations.map(obs => ({
      date: obs.date,
      value: parseFloat(obs.value),
      units: "Index 1982-1984=100",
    }));

    const responseData = {
      title: "Consumer Price Index for All Urban Consumers: All Items in U.S. City Average",
      description: "The Consumer Price Index for All Urban Consumers: All Items (CPIAUCSL) is a measure of the average monthly change in the price for goods and services paid by urban consumers between any two time periods.",
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
      throw new Error(`Failed to retrieve CPIAUCSL data: ${error.message}`);
    }
    throw error;
  }
}