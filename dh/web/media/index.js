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
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
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
