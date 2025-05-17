/**
 * FRED Series Registry
 * 
 * Central registry of FRED economic data series with metadata
 */

/**
 * Metadata for FRED economic data series
 */
export interface FREDSeriesMetadata {
  title: string;
  description: string;
  units: string;
}

/**
 * Registry of known FRED series with their metadata
 * Key: series ID as used in FRED API
 * Value: human-readable metadata about the series
 */
export const SERIES_REGISTRY: Record<string, FREDSeriesMetadata> = {
  "CPIAUCSL": {
    title: "Consumer Price Index for All Urban Consumers: All Items in U.S. City Average",
    description: "The Consumer Price Index for All Urban Consumers: All Items (CPIAUCSL) is a measure of the average monthly change in the price for goods and services paid by urban consumers between any two time periods.",
    units: "Index 1982-1984=100"
  },
  "RRPONTSYD": {
    title: "Overnight Reverse Repurchase Agreements: Treasury Securities Sold by the Federal Reserve",
    description: "Daily amount value of RRP transactions reported by the New York Fed as part of the Temporary Open Market Operations.",
    units: "Billions of Dollars"
  }
};