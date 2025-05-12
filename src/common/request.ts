import { z } from "zod";
import fetch from "node-fetch";

const BASE_URL = "https://api.stlouisfed.org/fred";

/**
 * Utility for making requests to the FRED API
 */
export const makeRequest = async <T>(
  endpoint: string,
  queryParams: Record<string, string | number | boolean> = {}
): Promise<T> => {
  // For development, use a demo API key if none is provided in environment
  const apiKey = process.env.FRED_API_KEY || "abcdefghijklmnopqrstuvwxyz123456";

  const url = new URL(`${BASE_URL}/${endpoint}`);

  // Add all query parameters
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  // Add the API key
  url.searchParams.append("api_key", apiKey);

  // Add common parameters
  url.searchParams.append("file_type", "json");

  console.error(`Fetching FRED API: ${url.toString().replace(/api_key=[^&]+/, "api_key=***")}`);

  const response = await fetch(url.toString(), {
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FRED API error (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<T>;
};

// Observation schema for the series/observations endpoint
export const ObservationSchema = z.object({
  realtime_start: z.string(),
  realtime_end: z.string(),
  date: z.string(),
  value: z.string()
});

// Schema for the series/observations API response
export const SeriesObservationsResponseSchema = z.object({
  realtime_start: z.string(),
  realtime_end: z.string(),
  observation_start: z.string(),
  observation_end: z.string(),
  units: z.string(),
  output_type: z.number(),
  file_type: z.string(),
  order_by: z.string(),
  sort_order: z.string(),
  count: z.number(),
  offset: z.number(),
  limit: z.number(),
  observations: z.array(ObservationSchema)
});

// Export types based on the schemas
export type Observation = z.infer<typeof ObservationSchema>;
export type SeriesObservationsResponse = z.infer<typeof SeriesObservationsResponseSchema>;
