# Federal Reserve Economic Data MCP Server

[![smithery badge](https://smithery.ai/badge/@stefanoamorelli/fred-mcp-server)](https://smithery.ai/server/@stefanoamorelli/fred-mcp-server)

> [!IMPORTANT]
> *Disclaimer*: This open-source project is not affiliated with, sponsored by, or endorsed by the *Federal Reserve* or the *Federal Reserve Bank of St. Louis*. "FRED" is a registered trademark of the *Federal Reserve Bank of St. Louis*, used here for descriptive purposes only.

A Model Context Protocol (`MCP`) server for accessing Federal Reserve Economic Data ([FRED®](https://fred.stlouisfed.org/)) financial datasets.

https://github.com/user-attachments/assets/66c7f3ad-7b0e-4930-b1c5-a675a7eb1e09

> [!TIP]
> If you use this project in your research or work, please cite it using the [CITATION.cff](CITATION.cff) file, or the APA format below:

`Amorelli, S. (2025). Federal Reserve Economic Data MCP (Model Context Protocol) Server [Computer software]. GitHub. https://github.com/stefanoamorelli/fred-mcp-server`


## Installation

### Installing via Smithery

To install Federal Reserve Economic Data Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@stefanoamorelli/fred-mcp-server):

```bash
npx -y @smithery/cli install @stefanoamorelli/fred-mcp-server --client claude
```

### Manual Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/stefanoamorelli/fred-mcp-server.git
    cd fred-mcp-server
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Build the project:
    ```bash
    pnpm build
    ```

## Configuration

This server requires a FRED® API key. You can obtain one from the [FRED® website](https://fred.stlouisfed.org/docs/api/api_key.html).

Install the server, for example, on [Claude Desktop](https://claude.ai/download), modify the `claude_desktop_config.json` file and add the following configuration:

```json
{
  "mcpServers": {
    "FRED MCP Server": {
      "command": "/usr/bin/node",
      "args": [
        "<PATH_TO_YOUR_CLONED_REPO>/fred-mcp-server/build/index.js"
      ],
      "env": {
        "FRED_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

## Available Tools

<details>
<summary>Common Parameters</summary>

All tools accept these optional parameters:

* `start_date` (string): Start date in `YYYY-MM-DD` format.
* `end_date` (string): End date in `YYYY-MM-DD` format.
* `limit` (number): Maximum number of observations to return.
* `sort_order` ("asc" | "desc"): Sort order of observations.

</details>
The following endpoints fetch individual FRED® series using these parameters.

### `RRPONTSYD`

*   **Description**: Retrieve data for *Overnight Reverse Repurchase Agreements* (`RRPONTSYD`)

### `CPIAUCSL`

*   **Description**: Retrieve data for *Consumer Price Index for All Urban Consumers* (`CPIAUCSL`)

### `MORTGAGE30US`

*   **Description**: Retrieve data for *30-Year Fixed Rate Mortgage Average in the United States* (`MORTGAGE30US`)

### `T10Y2Y`

*   **Description**: Retrieve data for *10-Year Treasury Constant Maturity Minus 2-Year Treasury Constant Maturity* (`T10Y2Y`)

### `UNRATE`

*   **Description**: Retrieve data for *Unemployment Rate* (`UNRATE`)

### `WALCL`

*   **Description**: Retrieve data for *Federal Reserve Total Assets* (`WALCL`)

### `GDP`

*   **Description**: Retrieve data for *Gross Domestic Product* (`GDP`)

### `GDPC1`

*   **Description**: Retrieve data for *Real Gross Domestic Product* (`GDPC1`)

### `DGS10`

*   **Description**: Retrieve data for *10-Year Treasury Constant Maturity Rate* (`DGS10`)

### `CSUSHPINSA`

*   **Description**: Retrieve data for *S&P/Case-Shiller U.S. National Home Price Index* (`CSUSHPINSA`)

### `BAMLH0A0HYM2`

*   **Description**: Retrieve data for *ICE BofA US High Yield Index Option-Adjusted Spread* (`BAMLH0A0HYM2`)

### `T10YIE`

*   **Description**: Retrieve data for *10-Year Breakeven Inflation Rate* (`T10YIE`)

### `FPCPITOTLZGUSA`

*   **Description**: Retrieve data for *Inflation, consumer prices for the United States* (`FPCPITOTLZGUSA`)

### `MSPUS`

*   **Description**: Retrieve data for *Median Sales Price of Houses Sold for the United States* (`MSPUS`)

### `M1SL`

*   **Description**: Retrieve data for *M1 Money Stock* (`M1SL`)

### `DRCCLACBS`

*   **Description**: Retrieve data for *Delinquency Rate on Credit Card Loans, All Commercial Banks* (`DRCCLACBS`)

### `DFII10`

*   **Description**: Retrieve data for *Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity, Inflation-Indexed (Daily)* (`DFII10`)

### `FII10`

*   **Description**: Retrieve data for *Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity, Inflation-Indexed (Monthly)* (`FII10`)

### `WFII10`

*   **Description**: Retrieve data for *Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity, Inflation-Indexed (Weekly)* (`WFII10`)

### `RIFLGFCY10XIINA`

*   **Description**: Retrieve data for *Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity, Inflation-Indexed (Annual)* (`RIFLGFCY10XIINA`)

## Testing

See [TESTING.md](./TESTING.md) for more details.

```bash
# Run all tests
pnpm test

# Run specific tests
pnpm test:registry
```

## 📄 License

[Apache 2.0 License](LICENSE) © 2025 [Stefano Amorelli](https://amorelli.tech)
