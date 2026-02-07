(function() {
    const promoBanner = document.getElementById('promo-banner');
    if (!promoBanner) return;

    const closeBtn = document.getElementById('close-promo-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            promoBanner.style.display = 'none';
        });
    }

    fetch('https://your-netlify-site.netlify.app/promo') // Replace with your actual Netlify URL
        .then(response => response.json())
        .then(data => {
            if (data && data.content) {
                const contentDiv = promoBanner.querySelector('.promo-content');
                if (contentDiv) {
                    contentDiv.innerHTML = `
                        <span>${data.content.text}</span>
                        <a href="${data.content.link}" target="_blank" rel="noopener noreferrer">${data.content.linkText}</a>
                    `;
                }
            }
        })
        .catch(error => console.error('Error loading promo:', error));
})();
