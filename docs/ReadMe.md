I have a few websites where I put a promotional banner at the bottom. The html code looks like this:

```html
<div id="promo-banner" class="promo-banner">
    <div class="promo-content">
        <span>Create beautiful countdown timers</span>
        <a href="https://mycountdownto.com" target="_blank" rel="noopener noreferrer">Visit MyCountdownTo.com</a>
    </div>
    <button id="close-promo-btn" class="close-promo-btn" aria-label="Close banner">&times;</button>
</div>
```

And an example site looks like this:

![dailymotivationalquotes.png](dailymotivationalquotes.png)

I want to build a system where I can manage what promos are available and use a piece of javascript on the websites which will load the promo to display.

The server side part should be a netlify edge route, and needs to be configured with a list of promos and return one when requested for display.

While loading, the site should display a default promo, which is then replaced when the new one is loaded.

One the server side, the list of promos might have details such as start and end period where the promo is valid, a list of include or exclude sites for where the promo should get served etc.

## Planned Features & Considerations

### 1. Analytics & Tracking
*   **Impressions:** Track how many times each promo is loaded.
*   **Clicks:** Track how many users click the link.
*   **CTR (Click-Through Rate):** Calculate effectiveness.

### 2. Advanced Targeting
*   **Geo-Location:** Use Netlify Edge geo-data to show specific promos based on country or region.
*   **Device Type:** Serve different promos for mobile vs. desktop users.
*   **User Status:** Target new vs. returning visitors.

### 3. Selection Logic (Server-Side)
*   **Weighting/Probability:** Assign weights to promos (e.g., Promo A 80%, Promo B 20%).
*   **Priority:** Allow high-priority promos to override others.
*   **Frequency Capping:** Limit how often a user sees a promo.

### 4. User Experience (Client-Side)
*   **Dismissal Persistence:** Save "Close" preference in `localStorage` or cookies.
*   **Animation/Transition:** Smoothly fade in the new promo to avoid layout shifts (CLS).

### 5. Performance & Security
*   **Caching:** Configure `Cache-Control` headers.
*   **CORS:** Allow-list specific domains.

### 6. Content Management
*   **Templates:** Support different promo types (text-only, image-left, etc.).
*   **Scheduling:** Support "Day Parting" (e.g., business hours only).

### 7. Fallback Strategy
*   **Error Handling:** Ensure default promo remains if the Edge function fails.
