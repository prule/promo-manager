
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

