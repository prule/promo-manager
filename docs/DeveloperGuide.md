# Developer Guide

This guide explains how to run, test, and deploy the Promo Manager locally.

## Prerequisites

*   **Node.js**: Ensure you have Node.js installed.
*   **Netlify CLI**: Install the Netlify CLI globally:
    ```bash
    npm install -g netlify-cli
    ```

## Project Structure

*   `netlify/edge-functions/`: Contains the server-side logic (Edge Functions).
*   `netlify/promos.json`: The "database" of available promos and their rules.
*   `src/client.js`: The client-side script to be embedded in websites.
*   `netlify.toml`: Netlify configuration file.

## Running Locally

You can run the Netlify Edge Functions locally using the Netlify CLI.

1.  **Start the Dev Server**:
    ```bash
    netlify dev
    ```
    This will start a local server, typically at `http://localhost:8888`.

2.  **Test the API**:
    You can use `curl` or a browser to test the promo endpoint:
    ```bash
    curl -v http://localhost:8888/promo
    ```
    *   Note: When running locally with `curl`, the `Origin` header might be missing. The code defaults to `localhost` in this case.
    *   To test specific origins or geo-locations, you might need to mock headers or use Netlify's dev features.

## Testing Scenarios

### 1. Basic Promo Fetch
*   Run `curl http://localhost:8888/promo`
*   **Expected**: A JSON response containing a promo object.

### 2. Filtering by Site (CORS & Rules)
*   Test with a specific origin:
    ```bash
    curl -H "Origin: https://example.com" -v http://localhost:8888/promo
    ```
*   **Expected**:
    *   If `example.com` is allowed, you get a 200 OK and the JSON.
    *   If `example.com` is NOT allowed, you might get a 204 No Content (if filtered out) or a response without the CORS header.

### 3. Geo-Targeting
*   Netlify Dev tries to mock geo-location. You can sometimes override this or rely on the default "XX" or your local IP's location.
*   To strictly test, you might need to temporarily hardcode a country code in `promo.ts` or deploy to a live Netlify draft URL.

### 4. Client-Side Integration
*   Create a simple `index.html` file in the root (or anywhere served):
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Promo Test</title>
        <style>
            .promo-banner {
                background: #f0f0f0;
                padding: 20px;
                border: 1px solid #ccc;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        </style>
    </head>
    <body>
        <h1>My Website</h1>
        
        <!-- Default Promo -->
        <div id="promo-banner" class="promo-banner">
            <div class="promo-content">
                <span>Default Promo Text</span>
                <a href="#">Default Link</a>
            </div>
            <button id="close-promo-btn">&times;</button>
        </div>

        <!-- Load Client Script -->
        <script src="src/client.js"></script> 
        <!-- Note: You might need to adjust the fetch URL in client.js to http://localhost:8888/promo for local testing -->
    </body>
    </html>
    ```
*   Open this file in your browser.
*   **Expected**: The default text should be replaced by the promo fetched from your local server.

## Deployment

1.  **Push to Git**: Commit your changes and push to your connected Git repository.
2.  **Netlify**: Connect the repo to Netlify. It will automatically detect `netlify.toml` and deploy the Edge Functions.
3.  **Environment Variables**: If you add any secrets later, configure them in the Netlify UI.

## Modifying Promos

Edit `netlify/promos.json` to add, remove, or update promos.
*   **id**: Unique identifier.
*   **content**: Text and links.
*   **rules**:
    *   `startDate` / `endDate`: ISO 8601 format.
    *   `allowedSites`: Array of hostnames or `"*"` for all.
    *   `allowedCountries`: Array of ISO country codes (e.g., "US", "GB") or `"*"` for all.
    *   `weight`: Integer for weighted randomization (higher = more frequent).
