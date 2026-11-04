'use strict';

(() => {
    const toggleButton = document.getElementById('theme-toggle');
    const themeStatus = document.getElementById('theme-status');

    function reportStorageError(error) {
        if (!(error instanceof DOMException) ||
            !['SecurityError', 'QuotaExceededError'].includes(error.name)) {
            throw error;
        }
        console.warn('Nie mozna odczytac lub zapisac preferencji motywu.', error);
        if (themeStatus) {
            themeStatus.textContent = 'Pamiec przegladarki jest niedostepna. Motyw zmieni sie tylko na tej stronie.';
            themeStatus.hidden = false;
        }
    }

    function updateThemeLabel() {
        if (!toggleButton) {
            return;
        }
        const isDark = document.body.classList.contains('dark-theme');
        toggleButton.setAttribute('aria-label', isDark ? 'Wlacz jasny motyw' : 'Wlacz ciemny motyw');
    }

    try {
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.remove('dark-theme');
        }
    } catch (error) {
        reportStorageError(error);
    }
    updateThemeLabel();

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            updateThemeLabel();
            try {
                localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
            } catch (error) {
                reportStorageError(error);
            }
        });
    }

    function formatDateTimePl(value) {
        const raw = String(value).trim();

        const slashOrDotMatch = raw.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
        if (slashOrDotMatch) {
            let first = Number(slashOrDotMatch[1]);
            let second = Number(slashOrDotMatch[2]);
            const year = slashOrDotMatch[3];
            const hours = String(Number(slashOrDotMatch[4] || '0')).padStart(2, '0');
            const minutes = String(Number(slashOrDotMatch[5] || '0')).padStart(2, '0');
            const seconds = String(Number(slashOrDotMatch[6] || '0')).padStart(2, '0');

            let day;
            let month;
            if (raw.includes('/')) {
                if (first > 12) {
                    day = first;
                    month = second;
                } else if (second > 12) {
                    day = second;
                    month = first;
                } else {
                    month = first;
                    day = second;
                }
            } else {
                day = first;
                month = second;
            }

            return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year} ${hours}:${minutes}:${seconds}`;
        }

        const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/);
        if (isoMatch) {
            const year = isoMatch[1];
            const month = isoMatch[2];
            const day = isoMatch[3];
            const hours = isoMatch[4] || '00';
            const minutes = isoMatch[5] || '00';
            const seconds = isoMatch[6] || '00';
            return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        }

        const date = new Date(raw);
        if (Number.isNaN(date.getTime())) {
            return raw;
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = formatDateTimePl(document.lastModified);
    }

    const filterInput = document.getElementById('dir-filter');
    const entries = Array.from(document.querySelectorAll('#dir-list [data-entry]'));
    const emptyState = document.getElementById('empty-state');
    if (!filterInput || !emptyState) {
        return;
    }
    const searchableEntries = entries.map(element => ({
        element,
        text: `${element.querySelector('.entry-name').textContent} ${element.dataset.keywords || ''}`
            .normalize('NFC').toLocaleLowerCase('pl')
    }));

    function filterEntries() {
        const query = filterInput.value.trim().normalize('NFC').toLocaleLowerCase('pl');
        let visibleCount = 0;
        searchableEntries.forEach(({ element, text }) => {
            element.hidden = !text.includes(query);
            if (!element.hidden) {
                visibleCount += 1;
            }
        });
        emptyState.textContent = entries.length === 0
            ? '(katalog nie zawiera innych plik\u00f3w ani podfolder\u00f3w)'
            : '(brak pasuj\u0105cych element\u00f3w)';
        emptyState.hidden = visibleCount > 0;
    }

    filterInput.addEventListener('input', filterEntries);
    filterEntries();
})();
