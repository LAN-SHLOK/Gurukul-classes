// Gurukul Classes — Site Script

// ── AI-Powered Search ──────────────────────────────────────
async function handleSearch(event) {
    event.preventDefault();

    const query = document.getElementById('siteSearchInput').value.trim();
    const feedback = document.getElementById('searchFeedback');
    const aiCard = document.getElementById('aiAnswerCard');
    const aiText = document.getElementById('aiAnswerText');

    if (!query) return;

    // Clear old highlights
    document.querySelectorAll('.search-highlight').forEach(el => {
        el.classList.remove('search-highlight');
        el.style.removeProperty('outline');
        el.style.removeProperty('box-shadow');
        el.style.removeProperty('border-radius');
    });

    // Show loading state
    feedback.style.color = 'var(--text-muted)';
    feedback.textContent = '🤖 Thinking...';
    aiCard.style.display = 'none';

    try {
        const res = await fetch('/api/ai-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            feedback.style.color = '#EF4444';
            feedback.textContent = '⚠️ ' + (err.error || 'AI unavailable. Try again shortly.');
            return;
        }
        const data = await res.json();

        // Show AI answer card
        aiText.textContent = data.answer;
        aiCard.style.display = 'block';
        feedback.textContent = '';

    } catch (err) {
        // Fallback: highlight matching content on the page
        feedback.style.color = '#EF4444';
        feedback.textContent = '⚠️ AI unavailable — showing page results instead.';

        const searchTargets = document.querySelectorAll('h2, h3, p, .feature-card, .badge');
        let firstMatch = null;

        searchTargets.forEach(el => {
            if ((el.innerText || el.textContent).toLowerCase().includes(query.toLowerCase())) {
                if (!firstMatch) firstMatch = el;
                el.classList.add('search-highlight');
                el.style.outline = '2px solid var(--primary)';
                el.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.15)';
                el.style.borderRadius = '8px';
            }
        });

        if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        else feedback.textContent = `❌ No results found for "${query}"`;

        setTimeout(() => { feedback.textContent = ''; }, 5000);
    }
}

// ── Mobile Sidebar Logic ───────────────────────────────────
function toggleMobileMenu() {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggleBtn = document.querySelector('.menu-toggle');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');

    // Optional: Transform hamburger icon if you add classes
}

// Close sidebar on link click or overlay click
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
        overlay.addEventListener('click', toggleMobileMenu);
    }

    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });
});

console.log('Gurukul Classes script loaded.');
