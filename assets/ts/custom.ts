const slider = document.querySelector<HTMLElement>('[data-hero-slider]');

if (slider) {
    const slides = Array.from(slider.querySelectorAll<HTMLElement>('.hero-slide'));
    const dots = Array.from(slider.querySelectorAll<HTMLButtonElement>('.hero-slider__dot'));
    const previous = slider.querySelector<HTMLButtonElement>('[data-slider-prev]');
    const next = slider.querySelector<HTMLButtonElement>('[data-slider-next]');
    let current = 0;
    let timer: number | undefined;
    let pointerStart = 0;

    const showSlide = (index: number) => {
        if (slides.length < 2) return;
        current = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const active = slideIndex === current;
            slide.classList.toggle('is-active', active);
            slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        });

        dots.forEach((dot, dotIndex) => {
            const active = dotIndex === current;
            dot.classList.toggle('is-active', active);
            dot.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    };

    const stopAutoPlay = () => {
        if (timer !== undefined) window.clearInterval(timer);
        timer = undefined;
    };

    const startAutoPlay = () => {
        stopAutoPlay();
        if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            timer = window.setInterval(() => showSlide(current + 1), 6500);
        }
    };

    previous?.addEventListener('click', () => {
        showSlide(current - 1);
        startAutoPlay();
    });

    next?.addEventListener('click', () => {
        showSlide(current + 1);
        startAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoPlay();
        });
    });

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    slider.addEventListener('focusin', stopAutoPlay);
    slider.addEventListener('focusout', startAutoPlay);
    slider.addEventListener('pointerdown', (event) => {
        pointerStart = event.clientX;
    });
    slider.addEventListener('pointerup', (event) => {
        const distance = event.clientX - pointerStart;
        if (Math.abs(distance) > 50) showSlide(current + (distance < 0 ? 1 : -1));
        startAutoPlay();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAutoPlay();
        else startAutoPlay();
    });

    startAutoPlay();
}

const searchToggle = document.getElementById('top-search-toggle');
const searchForm = document.getElementById('top-search-form');
const searchInput = document.getElementById('top-search-input') as HTMLInputElement | null;

if (searchToggle && searchForm) {
    const closeSearch = () => {
        searchForm.classList.remove('is-open');
        searchToggle.setAttribute('aria-expanded', 'false');
    };

    searchToggle.addEventListener('click', () => {
        const open = searchForm.classList.toggle('is-open');
        searchToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) window.setTimeout(() => searchInput?.focus(), 0);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeSearch();
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            searchToggle.click();
        }
    });

    document.addEventListener('click', (event) => {
        const target = event.target as Node;
        if (!searchForm.contains(target) && !searchToggle.contains(target)) closeSearch();
    });
}
