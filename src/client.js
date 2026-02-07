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
    const API_URL = 'https://your-netlify-site.netlify.app/promo'; 

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
