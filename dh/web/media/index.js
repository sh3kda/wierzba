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
        themeStatus.textContent = 'Pami\u0119\u0107 przegl\u0105darki jest niedost\u0119pna. Motyw zmieni si\u0119 tylko na tej stronie.';
        themeStatus.hidden = false;
    }

    function updateThemeLabel() {
        const isDark = document.body.classList.contains('dark-theme');
        toggleButton.setAttribute('aria-label', isDark ? 'W\u0142\u0105cz jasny motyw' : 'W\u0142\u0105cz ciemny motyw');
    }

    try {
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.remove('dark-theme');
        }
    } catch (error) {
        reportStorageError(error);
    }
    updateThemeLabel();

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        updateThemeLabel();
        try {
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        } catch (error) {
            reportStorageError(error);
        }
    });

    document.getElementById('last-modified').textContent = document.lastModified;

    const filterInput = document.getElementById('dir-filter');
    const entries = Array.from(document.querySelectorAll('#dir-list [data-entry]'));
    const emptyState = document.getElementById('empty-state');
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
