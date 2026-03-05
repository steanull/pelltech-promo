'use strict';

(() => {
    const init = () => {
        const yearEl = document.getElementById('current-year');
        if (yearEl) {
            yearEl.textContent = String(new Date().getFullYear());
        }

        if (window.CI360 && typeof window.CI360.init === 'function') {
            window.CI360.init();
        }

        if (typeof window.ChiefSlider === 'function') {
            const sliders = document.querySelectorAll('[data-slider="chiefslider"]');
            sliders.forEach((slider) => {
                new window.ChiefSlider(slider);
            });
        }

        const menuBar = document.querySelector('.menu__bar');
        const burger = menuBar ? menuBar.querySelector('span') : null;
        const menuWrapper = document.querySelector('.menu__wrapper');

        if (menuBar && burger && menuWrapper) {
            menuBar.addEventListener('click', () => {
                burger.classList.toggle('active');
                menuWrapper.classList.toggle('animate');
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
        return;
    }

    init();
})();

(() => {
    const menuLinks = document.querySelectorAll('.menu__link[href^="#"]');
    const burger = document.querySelector('.menu__bar span');
    const menuWrapper = document.querySelector('.menu__wrapper');

    if (!menuLinks.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const closeMobileMenu = () => {
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
    const form = document.querySelector('.callback__form');

    if (!form) {
        return;
    }

    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');

    if (!nameInput || !phoneInput) {
        return;
    }

    const createToast = () => {
        const toast = document.createElement('div');
        toast.className = 'callback-toast';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        document.body.appendChild(toast);
        return toast;
    };

    const toast = createToast();
    let hideToastTimer;

    const showToast = (messages) => {
        toast.innerHTML = messages.map((message) => `<p class="callback-toast__line">${message}</p>`).join('');
        toast.classList.add('callback-toast_visible');
        clearTimeout(hideToastTimer);
        hideToastTimer = setTimeout(() => {
            toast.classList.remove('callback-toast_visible');
        }, 4000);
    };

    const getPhoneDigits = (value) => {
        let digits = value.replace(/\D/g, '');

        if (digits.startsWith('7') || digits.startsWith('8')) {
            digits = digits.slice(1);
        }

        return digits.slice(0, 10);
    };

    const formatPhone = (digitsValue) => {
        const digits = getPhoneDigits(digitsValue);
        let result = '+7';

        if (digits.length > 0) {
            result += ` (${digits.slice(0, 3)}`;
        }

        if (digits.length >= 3) {
            result += ')';
        }

        if (digits.length > 3) {
            result += ` ${digits.slice(3, 6)}`;
        }

        if (digits.length > 6) {
            result += `-${digits.slice(6, 8)}`;
        }

        if (digits.length > 8) {
            result += `-${digits.slice(8, 10)}`;
        }

        return result;
    };

    const toggleError = (input, hasError) => {
        input.classList.toggle('callback__input_error', hasError);
    };

    phoneInput.addEventListener('focus', () => {
        if (!phoneInput.value.trim()) {
            phoneInput.value = '+7';
        }
    });

    phoneInput.addEventListener('input', () => {
        phoneInput.value = formatPhone(phoneInput.value);
        toggleError(phoneInput, false);
    });

    phoneInput.addEventListener('blur', () => {
        if (getPhoneDigits(phoneInput.value).length === 0) {
            phoneInput.value = '';
        }
    });

    nameInput.addEventListener('input', () => {
        toggleError(nameInput, false);
    });

    form.addEventListener('submit', (event) => {
        const errors = [];
        const isNameEmpty = !nameInput.value.trim();
        const phoneDigitsLength = getPhoneDigits(phoneInput.value).length;
        const isPhoneEmpty = phoneDigitsLength === 0;
        const isPhoneIncomplete = !isPhoneEmpty && phoneDigitsLength < 10;

        toggleError(nameInput, isNameEmpty);
        toggleError(phoneInput, isPhoneEmpty || isPhoneIncomplete);

        if (isNameEmpty) {
            errors.push('Заполните поле "Имя".');
        }

        if (isPhoneEmpty) {
            errors.push('Заполните поле "Телефон".');
        } else if (isPhoneIncomplete) {
            errors.push('Введите телефон полностью: +7 (999) 999-99-99.');
        }

        if (errors.length) {
            event.preventDefault();
            showToast(errors);
        }
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
