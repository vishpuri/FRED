import { z } from "zod";
import { makeRequest, SeriesObservationsResponse } from "../common/request.js";

/**
 * Handler for retrieving Overnight Reverse Repurchase Agreements data from FRED
 */
export async function handleRRPONTSYD(
  input: { start_date?: string; end_date?: string; limit?: number; sort_order?: "asc" | "desc" }
) {
  try {
    // RRPONTSYD is the series ID for Overnight Reverse Repurchase Agreements
    const seriesId = "RRPONTSYD";

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
      units: "Billions of Dollars",
    }));

    const responseData = {
      title: "Overnight Reverse Repurchase Agreements: Treasury Securities Sold by the Federal Reserve",
      description: "Daily amount value of RRP transactions reported by the New York Fed as part of the Temporary Open Market Operations.",
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
      throw new Error(`Failed to retrieve RRPONTSYD data: ${error.message}`);
    }
    throw error;
  }
}
