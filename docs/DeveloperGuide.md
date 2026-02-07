# Developer Guide

This guide explains how to run, test, and deploy the Promo Manager locally.

## Prerequisites

*   **Node.js**: Ensure you have Node.js installed.
*   **Netlify CLI**: Install the Netlify CLI globally:
    ```bash
    npm install -g netlify-cli
    ```

## Project Structure

*   `netlify/`: Contains all Netlify-specific logic and data.
    *   `edge-functions/promo.ts`: The server-side logic for selecting a promo.
    *   `promos.json`: The "database" of available promos and their rules.
*   `public/`: Contains all static assets that will be deployed.
    *   `index.html`: A sample page for local testing.
    *   `client.js`: The client-side script to be embedded in websites.
    *   `promo-style.css`: Styles for the promo banner.
*   `netlify.toml`: The main Netlify configuration file. It's set to publish the `public` directory.

## Running Locally

You can run the project locally using the Netlify CLI.

1.  **Start the Dev Server**:
    ```bash
    netlify dev
    ```
    This will start a local server, typically at `http://localhost:8888`. It serves files from the `public` directory and runs the edge functions.

2.  **Test the Application**:
    *   Open your browser and navigate to `http://localhost:8888`. You should see the `index.html` page with the promo banner at the bottom.
    *   The client script (`client.js`) will fetch a promo from the `/promo` endpoint.

## Testing Scenarios

### 1. Test the API Endpoint
*   Use `curl` or a browser to test the promo endpoint directly:
    ```bash
    curl -v http://localhost:8888/promo
    ```
*   **Expected**: A JSON response containing a valid promo object.

### 2. Test Filtering Rules
*   To test site-specific filtering, use `curl` with an `Origin` header:
    ```bash
    curl -H "Origin: https://example.com" -v http://localhost:8888/promo
    ```
*   **Expected**: You should receive a promo that is valid for `example.com`. If no promos are valid, you should get a `204 No Content` response.

### 3. Test Geo-Targeting
*   The Netlify CLI provides mock geo-location data. You can test different locations by running:
    ```bash
    netlify dev --geo=US
    netlify dev --geo=GB
    ```
*   This will set the country code for the context object in the edge function.

## Deployment

1.  **Push to Git**: Commit your changes and push to your repository (e.g., GitHub).
2.  **Netlify**: Connect the repository to a Netlify site. Netlify will automatically detect `netlify.toml` and configure the build settings.
    *   **Publish directory**: `public`
    *   **Edge Functions**: `netlify/edge-functions`
3.  Your site will be deployed, and the promo endpoint will be live.

## Modifying Promos

Edit `netlify/promos.json` to add, remove, or update promos. The fields are:
*   `id`: Unique identifier for the promo.
*   `content`: An object with `text`, `link`, and `linkText`.
*   `rules`:
    *   `startDate` / `endDate`: The promo's validity period (ISO 8601 format).
    *   `allowedSites`: An array of hostnames (e.g., "example.com") or `"*"` for all sites.
    *   `allowedCountries`: An array of 2-letter ISO country codes (e.g., "US", "GB") or `"*"` for all countries.
    *   `weight`: A number to control randomization frequency (higher means more likely to be chosen).
