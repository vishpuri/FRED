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
  },
  "T10Y2Y": {
    title: "10-Year Treasury Constant Maturity Minus 2-Year Treasury Constant Maturity",
    description: "This series represents the spread between 10-Year Treasury Constant Maturity and 2-Year Treasury Constant Maturity. This spread is often used as an indicator of economic health, with negative values potentially signaling an upcoming recession.",
    units: "Percentage Points"
  },
  "MORTGAGE30US": {
    title: "30-Year Fixed Rate Mortgage Average in the United States",
    description: "The 30-Year Fixed Rate Mortgage Average tracks the average interest rate for 30-year fixed-rate mortgages in the United States, providing a key indicator of housing affordability and lending conditions.",
    units: "Percent"
  },
  "M2SL": {
    title: "M2 Money Stock",
    description: "M2 is a measure of the money supply that includes cash, checking deposits, and easily convertible near money. M2 is a broader measure than M1, which just includes cash and checking deposits.",
    units: "Billions of Dollars"
  },
  "UNRATE": {
    title: "Unemployment Rate",
    description: "The unemployment rate represents the number of unemployed as a percentage of the labor force. Labor force data are restricted to people 16 years of age and older, who currently reside in 1 of the 50 states or the District of Columbia, who do not reside in institutions, and who are not on active duty in the Armed Forces.",
    units: "Percent"
  },
  "WALCL": {
    title: "Assets: Total Assets: Total Assets (Less Eliminations from Consolidation): Wednesday Level",
    description: "This series shows the total assets held by the Federal Reserve. It includes all securities, loans, and other assets held by the Federal Reserve Banks, and is a key indicator of monetary policy implementation.",
    units: "Millions of Dollars"
  },
  "GDP": {
    title: "Gross Domestic Product",
    description: "Gross Domestic Product (GDP) measures the value of final goods and services produced in the United States in a given period. This measure is the most comprehensive measure of overall economic activity.",
    units: "Billions of Dollars"
  },
  "T10Y3M": {
    title: "10-Year Treasury Constant Maturity Minus 3-Month Treasury Constant Maturity",
    description: "This series represents the spread between 10-Year Treasury Constant Maturity and 3-Month Treasury Constant Maturity. Similar to the 10Y-2Y spread, this indicator is used to assess the yield curve and potential economic conditions, with negative values often interpreted as a recession signal.",
    units: "Percentage Points"
  },
  "DGS10": {
    title: "10-Year Treasury Constant Maturity Rate",
    description: "This data represents the yield on U.S. Treasury securities at 10-year constant maturity, quoted on investment basis. It is a widely watched benchmark for interest rates and a key indicator of government borrowing costs.",
    units: "Percent"
  },
  "GDPC1": {
    title: "Real Gross Domestic Product",
    description: "Real Gross Domestic Product (GDPC1) measures the inflation-adjusted value of all goods and services produced by the economy. This quarterly series is adjusted for inflation using the corresponding implicit price deflator.",
    units: "Billions of Chained 2017 Dollars"
  },
  "CSUSHPINSA": {
    title: "S&P/Case-Shiller U.S. National Home Price Index",
    description: "The S&P/Case-Shiller Home Price Indices are the leading measures of U.S. residential real estate prices, tracking changes in the value of residential real estate nationally. This index measures the average change in home prices in the United States.",
    units: "Index Jan 2000=100"
  },
  "T10YIE": {
    title: "10-Year Breakeven Inflation Rate",
    description: "This series represents a measure of expected inflation derived from 10-Year Treasury Constant Maturity Securities and 10-Year Treasury Inflation-Indexed Constant Maturity Securities. The latest value implies what market participants expect inflation to be in the next 10 years, on average.",
    units: "Percent"
  },
  "BAMLH0A0HYM2": {
    title: "ICE BofA US High Yield Index Option-Adjusted Spread",
    description: "This series represents the Option-Adjusted Spread (OAS) of the ICE BofA US High Yield Index, which tracks the performance of US dollar denominated below investment grade corporate debt publicly issued in the US domestic market. The spread is a measure of the risk premium required by investors to hold high yield bonds compared to risk-free securities.",
    units: "Percent"
  },
  "FPCPITOTLZGUSA": {
    title: "Inflation, consumer prices for the United States",
    description: "This indicator is measured as the annual growth rate of the Consumer Price Index (CPI) for the United States. The CPI measures changes in the prices of goods and services that households consume.",
    units: "Percent"
  },
  "MSPUS": {
    title: "Median Sales Price of Houses Sold for the United States",
    description: "This series tracks the median sales price of houses sold in the United States. It provides a key indicator of housing market trends and affordability.",
    units: "Dollars"
  },
  "M1SL": {
    title: "M1 Money Stock",
    description: "M1 consists of currency outside the U.S. Treasury, Federal Reserve Banks, and the vaults of depository institutions; demand deposits at commercial banks; and other liquid deposits.",
    units: "Billions of Dollars"
  },
  "DRCCLACBS": {
    title: "Delinquency Rate on Credit Card Loans, All Commercial Banks",
    description: "This series measures the percentage of credit card loans that are delinquent across all commercial banks in the United States. It provides insights into consumer financial health, credit card loan performance, and potential economic stress. This indicator is frequently used to track trends in consumer credit risk and serves as a potential leading indicator of economic conditions.",
    units: "Percent, Seasonally Adjusted"
  },
  "DFII10": {
    title: "Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity, Quoted on an Investment Basis, Inflation-Indexed",
    description: "This series measures the inflation-adjusted interest rates on 10-year Treasury securities. It provides daily data on real yield for Treasury Inflation-Protected Securities (TIPS), allowing investors to understand the real return on these securities without the effects of inflation. It is an important indicator for market expectations of real interest rates over a 10-year period.",
    units: "Percent, Not Seasonally Adjusted"
  },
  "FII10": {
    title: "Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity, Quoted on an Investment Basis, Inflation-Indexed",
    description: "This series measures the monthly inflation-adjusted interest rates on 10-year Treasury Inflation-Protected Securities (TIPS). Similar to DFII10 but at a monthly frequency, it represents the real yield investors require above inflation. This data helps in comparing real yields across different time periods and is crucial for understanding market expectations for real interest rates.",
    units: "Percent, Not Seasonally Adjusted"
  },
  "WFII10": {
    title: "Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity, Quoted on an Investment Basis, Inflation-Indexed",
    description: "This series measures the weekly inflation-adjusted interest rates on 10-year Treasury Inflation-Protected Securities (TIPS). Updated weekly with values ending on Friday, it provides more frequent observations than the monthly FII10 series but less granular than the daily DFII10 series. It helps track real interest rate movements over time, providing investors with insights into inflation-adjusted Treasury yields.",
    units: "Percent, Not Seasonally Adjusted"
  },
  "RIFLGFCY10XIINA": {
    title: "Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity, Quoted on an Investment Basis, Inflation-Indexed",
    description: "This series provides the annual average yield of 10-year Treasury Inflation-Protected Securities (TIPS). It represents the average real interest rate for each year, derived from daily figures. The series is particularly useful for analyzing long-term trends in real interest rates and comparing year-over-year changes in inflation-adjusted government borrowing costs.",
    units: "Percent, Not Seasonally Adjusted"
  }
};