(function() {
    const promoBanner = document.getElementById('promo-banner');
    if (!promoBanner) return;

    const DISMISS_KEY = 'promo_dismissed';

    // Check if previously dismissed
    try {
        if (localStorage.getItem(DISMISS_KEY)) {
            promoBanner.style.display = 'none';
            return;
        }
    } catch (e) {
        // localStorage might be unavailable
    }

    const closeBtn = document.getElementById('close-promo-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            promoBanner.style.display = 'none';
            try {
                localStorage.setItem(DISMISS_KEY, 'true');
            } catch (e) {}
        });
    }

    const contentDiv = promoBanner.querySelector('.promo-content');
    if (contentDiv) {
        // Setup transition
        contentDiv.style.transition = 'opacity 0.3s ease-in-out';
    }

    // Replace with your actual Netlify URL
    const API_URL = 'https://promo-manager.netlify.app/promo';

    fetch(API_URL)
        .then(response => {
            if (response.status === 204) {
                // No promo matches criteria, hide banner
                promoBanner.style.display = 'none';
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (data && data.content && contentDiv) {
                // Smooth transition
                contentDiv.style.opacity = '0';

                setTimeout(() => {
                    contentDiv.innerHTML = `
                        <span>${data.content.text}</span>
                        <a href="${data.content.link}" target="_blank" rel="noopener noreferrer">${data.content.linkText}</a>
                    `;
                    contentDiv.style.opacity = '1';
                }, 300); // Match transition duration
            }
        })
        .catch(error => {
            console.error('Error loading promo:', error);
            // Keep default promo on error
        });
})();

document.addEventListener('DOMContentLoaded', () => {
    const promoBanner = document.getElementById('promo-banner');
    const closeButton = document.getElementById('close-promo-btn');
    const body = document.body;

    // Function to update body padding based on banner visibility
    function updateBodyPadding() {
        if (promoBanner && window.getComputedStyle(promoBanner).display !== 'none') {
            // Set padding based on the banner's actual height
            const bannerHeight = promoBanner.offsetHeight;
            body.style.paddingBottom = `${bannerHeight}px`;
            body.style.transition = 'padding-bottom 0.3s ease'; // Optional: smooth transition
        } else {
            body.style.paddingBottom = '0';
        }
    }

    // Don't run if the banner doesn't exist
    if (!promoBanner) {
        return;
    }

    // Initial check when the page loads
    // We use a short delay to ensure all styles are applied and we get the correct height
    setTimeout(updateBodyPadding, 100);

    // Add a listener to update padding if the window is resized
    window.addEventListener('resize', updateBodyPadding);

});
