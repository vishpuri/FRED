# Federal Reserve Economic Data MCP Server

> [!IMPORTANT]
> *Disclaimer*: This open-source project is not affiliated with, sponsored by, or endorsed by the *Federal Reserve* or the *Federal Reserve Bank of St. Louis*. "FRED" is a registered trademark of the *Federal Reserve Bank of St. Louis*, used here for descriptive purposes only.

A Model Context Protocol (`MCP`) server for accessing Federal Reserve Economic Data ([FRED®](https://fred.stlouisfed.org/)) financial datasets.

--- 

https://github.com/user-attachments/assets/66c7f3ad-7b0e-4930-b1c5-a675a7eb1e09

---


> [!TIP]
> If you use this project in your research or work, please cite it using the [CITATION.cff](CITATION.cff) file, or the APA format below:

`Amorelli, S. (2025). Federal Reserve Economic Data MCP (Model Context Protocol) Server [Computer software]. GitHub. https://github.com/stefanoamorelli/fred-mcp-server`


## Installation

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

### `RRPONTSYD`

*   **Description**: Retrieve data for *Overnight Reverse Repurchase Agreements* (`RRPONTSYD`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `CPIAUCSL`

*   **Description**: Retrieve data for *Consumer Price Index for All Urban Consumers* (`CPIAUCSL`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `MORTGAGE30US`

*   **Description**: Retrieve data for *30-Year Fixed Rate Mortgage Average in the United States* (`MORTGAGE30US`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `T10Y2Y`

*   **Description**: Retrieve data for *10-Year Treasury Constant Maturity Minus 2-Year Treasury Constant Maturity* (`T10Y2Y`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `UNRATE`

*   **Description**: Retrieve data for *Unemployment Rate* (`UNRATE`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `WALCL`

*   **Description**: Retrieve data for *Federal Reserve Total Assets* (`WALCL`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `GDP`

*   **Description**: Retrieve data for *Gross Domestic Product* (`GDP`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `GDPC1`

*   **Description**: Retrieve data for *Real Gross Domestic Product* (`GDPC1`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `DGS10`

*   **Description**: Retrieve data for *10-Year Treasury Constant Maturity Rate* (`DGS10`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `CSUSHPINSA`

*   **Description**: Retrieve data for *S&P/Case-Shiller U.S. National Home Price Index* (`CSUSHPINSA`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `BAMLH0A0HYM2`

*   **Description**: Retrieve data for *ICE BofA US High Yield Index Option-Adjusted Spread* (`BAMLH0A0HYM2`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `T10YIE`

*   **Description**: Retrieve data for *10-Year Breakeven Inflation Rate* (`T10YIE`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `FPCPITOTLZGUSA`

*   **Description**: Retrieve data for *Inflation, consumer prices for the United States* (`FPCPITOTLZGUSA`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `MSPUS`

*   **Description**: Retrieve data for *Median Sales Price of Houses Sold for the United States* (`MSPUS`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

### `M1SL`

*   **Description**: Retrieve data for *M1 Money Stock* (`M1SL`) from FRED®.
*   **Parameters**:
    *   `start_date` _(string, optional)_: Start date in `YYYY-MM-DD` format.
    *   `end_date` _(string, optional)_: End date in `YYYY-MM-DD` format.
    *   `limit` _(number, optional)_: Maximum number of observations to return.
    *   `sort_order` _(enum["asc", "desc"], optional)_: Sort order of observations.

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
