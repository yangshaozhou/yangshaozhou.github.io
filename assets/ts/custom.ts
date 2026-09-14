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
            timer = window.setInterval(() => showSlide(current + 1), 5000);
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

const colorSchemeToggle = document.getElementById('dark-mode-toggle');

if (colorSchemeToggle) {
    const syncColorSchemeLabel = () => {
        const isDark = document.documentElement.dataset.scheme === 'dark';
        const label = isDark ? '切换为浅色模式' : '切换为暗色模式';
        colorSchemeToggle.setAttribute('aria-label', label);
        colorSchemeToggle.setAttribute('title', label);
    };

    syncColorSchemeLabel();
    window.addEventListener('onColorSchemeChange', syncColorSchemeLabel);
}

const photoWall = document.querySelector<HTMLElement>('[data-photo-wall]');
const photoFilters = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-photo-filter]'));
const photoEmpty = document.querySelector<HTMLElement>('[data-photo-empty]');
const photoTitle = document.querySelector<HTMLElement>('[data-photo-title]');
const photoIntro = document.querySelector<HTMLElement>('[data-photo-intro]');
const photoCount = document.querySelector<HTMLElement>('[data-photo-count]');

if (photoWall && photoFilters.length > 0) {
    const photoCards = Array.from(photoWall.querySelectorAll<HTMLElement>('[data-photo-card]'));

    const applyPhotoFilter = (filter: string) => {
        let visibleCount = 0;

        photoFilters.forEach((button) => {
            const active = button.dataset.photoFilter === filter;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        const selected = photoFilters.find((button) => button.dataset.photoFilter === filter);
        if (photoTitle) photoTitle.textContent = selected?.dataset.photoTitle ?? '照片';
        if (photoIntro) photoIntro.textContent = selected?.dataset.photoDescription ?? '从光线、城市和日常里，挑选值得再次凝视的片段。';
        if (photoCount) photoCount.textContent = selected?.dataset.photoCount ?? String(photoCards.length);

        photoCards.forEach((card) => {
            const categories = (card.dataset.photoCategories ?? '').split(',').map((item) => item.trim());
            const visible = filter === 'all' || categories.some((category) => category && category.toLowerCase() === filter.toLowerCase());
            card.hidden = !visible;
            if (visible) visibleCount += 1;
        });

        if (photoEmpty) photoEmpty.hidden = visibleCount > 0;
    };

    photoFilters.forEach((button) => {
        button.addEventListener('click', () => {
            applyPhotoFilter(button.dataset.photoFilter ?? 'all');
        });
    });

    const initialFilter = photoFilters.find((button) => button.classList.contains('is-active'))?.dataset.photoFilter
        ?? photoFilters[0]?.dataset.photoFilter;

    if (initialFilter) applyPhotoFilter(initialFilter);
}
