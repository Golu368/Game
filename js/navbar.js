// navbar.js - navigation toggle script
// Hinglish comments included so aap easily samajh sako

// DOM ready: agar aap defer use karte ho, yeh optional hai but safe
document.addEventListener('DOMContentLoaded', () => {
    // menu button aur menu container select karo
    const toggle = document.querySelector('.menu-btn');
    const links = document.querySelector('.menu');

    if (!toggle || !links) return; // agar element nahi mila to exit

    // click pe menu open/close karega
    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        // accessibility: aria-expanded update karo
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // close menu when a link is clicked (mobile friendly)
    links.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            links.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    // click outside to close menu
    document.addEventListener('click', (e) => {
        const nav = document.querySelector('nav');
        if (!nav) return;
        if (!nav.contains(e.target)) {
            if (links.classList.contains('open')) {
                links.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
});
