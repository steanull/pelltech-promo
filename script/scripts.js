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

(() => {
    const gallery = document.querySelector('.gallery__inner');

    if (!gallery) {
        return;
    }

    const links = Array.from(gallery.querySelectorAll('a[href]'));

    if (!links.length) {
        return;
    }

    const popup = document.createElement('div');
    popup.className = 'gallery-popup';
    popup.setAttribute('aria-hidden', 'true');

    const image = document.createElement('img');
    image.className = 'gallery-popup__image';
    image.alt = '';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'gallery-popup__button gallery-popup__button_close';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.textContent = '\u00d7';

    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.className = 'gallery-popup__button gallery-popup__button_prev';
    prevButton.setAttribute('aria-label', 'Previous certificate');
    prevButton.textContent = '\u2039';

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'gallery-popup__button gallery-popup__button_next';
    nextButton.setAttribute('aria-label', 'Next certificate');
    nextButton.textContent = '\u203a';

    popup.append(closeButton, prevButton, nextButton, image);
    document.body.appendChild(popup);

    let currentIndex = 0;

    const updateImage = (index) => {
        const safeIndex = (index + links.length) % links.length;
        const link = links[safeIndex];
        const thumbnail = link.querySelector('img');

        currentIndex = safeIndex;
        image.src = link.href;
        image.alt = thumbnail ? thumbnail.alt : 'Certificate';
    };

    const openPopup = (index) => {
        updateImage(index);
        popup.classList.add('gallery-popup_opened');
        popup.setAttribute('aria-hidden', 'false');
        document.body.classList.add('page_popup-opened');
    };

    const closePopup = () => {
        popup.classList.remove('gallery-popup_opened');
        popup.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('page_popup-opened');
        image.removeAttribute('src');
    };

    links.forEach((link, index) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            openPopup(index);
        });
    });

    prevButton.addEventListener('click', () => {
        updateImage(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        updateImage(currentIndex + 1);
    });

    closeButton.addEventListener('click', closePopup);

    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!popup.classList.contains('gallery-popup_opened')) {
            return;
        }

        if (event.key === 'Escape') {
            closePopup();
        } else if (event.key === 'ArrowLeft') {
            updateImage(currentIndex - 1);
        } else if (event.key === 'ArrowRight') {
            updateImage(currentIndex + 1);
        }
    });
})();
