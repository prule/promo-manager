# Promo Manager Installation Guide

Follow these instructions to add the promo banner to your website.

## 1. Add Stylesheet

Include the CSS file in the `<head>` of your HTML document:

```html
<link rel="stylesheet" href="https://promo-manager.netlify.app/promo-style.css">
```

## 2. Add HTML Structure

Place the following HTML code inside the `<body>` tag of your page:

```html
<div id="promo-banner" class="promo-banner">
    <div class="promo-content">
        <span></span>
        <a href="" target="_blank" rel="noopener noreferrer"></a>
    </div>
    <button id="close-promo-btn" class="close-promo-btn" aria-label="Close banner">&times;</button>
</div>
```

## 3. Add JavaScript

Include the script file just before the closing `</body>` tag:

```html
<script src="https://promo-manager.netlify.app/client.js"></script>
```

## 4. Layout Adjustment

To prevent the banner from covering your content, add padding to the bottom of the `<body>`:

```css
body {
    padding-bottom: 80px; /* Adjust to match banner height */
}
```
