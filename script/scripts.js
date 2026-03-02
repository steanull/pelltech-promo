'use strict';

(() => {
    const menuLinks = document.querySelectorAll('.menu__link[href^="#"]');

    if (!menuLinks.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const closeMobileMenu = () => {
        const burger = document.querySelector('.menu__bar span');
        const menuWrapper = document.querySelector('.menu__wrapper');

        if (burger) {
            burger.classList.remove('active');
        }

        if (menuWrapper) {
            menuWrapper.classList.remove('animate');
        }
    };

    menuLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const hash = link.getAttribute('href');

            if (!hash || hash === '#') {
                return;
            }

            const target = document.querySelector(hash);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });

            history.pushState(null, '', hash);
            closeMobileMenu();
        });
    });
})();
