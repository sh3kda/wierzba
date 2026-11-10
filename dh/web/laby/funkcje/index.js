'use strict';

(() => {
    const heading = document.getElementById('duzy-tekst');
    const status = document.getElementById('status-akcji');
    const hint = document.getElementById('podpowiedz');
    const dateField = document.getElementById('dzisiejsza-data');

    const STEP_PX = 6;

    function setStatus(message) {
        if (status) {
            status.textContent = message;
        }
    }

    function formatDateDayMonthYear(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    }

    function increaseHeading() {
        if (!heading) {
            return;
        }
        const currentSize = parseFloat(getComputedStyle(heading).fontSize);
        const newSize = currentSize + STEP_PX;
        heading.style.fontSize = `${newSize}px`;
        setStatus(`Powiekszono naglowek do ${Math.round(newSize)} px.`);
    }

    function decreaseHeading() {
        if (!heading) {
            return;
        }
        const currentSize = parseFloat(getComputedStyle(heading).fontSize);
        const newSize = currentSize - STEP_PX;
        heading.style.fontSize = `${newSize}px`;
        setStatus(`Zmniejszono naglowek do ${Math.round(newSize)} px.`);
    }

    function setAccentTheme() {
        document.body.classList.remove('theme-neon');
        document.body.classList.add('theme-accent');
        setStatus('Ustawiono ciemniejsze tlo akcentowe.');
    }

    function setNeonTheme() {
        document.body.classList.remove('theme-accent');
        document.body.classList.add('theme-neon');
        setStatus('Wlaczono tryb neonowy: czarne tlo i neonowy tekst.');
    }

    function resetTheme() {
        document.body.classList.remove('theme-accent', 'theme-neon');
        setStatus('Przywrocono domyslne tlo i kolor tekstu.');
    }

    function setTabTitle() {
        document.title = 'Plac zabaw JavaScript - aktywny';
        setStatus('Zmieniono tytul karty przegladarki.');
    }

    function showAlert() {
        alert('To jest przykladowy alert z laboratorium JS.');
    }

    function logMessage() {
        console.log('[funkcje] Uzytkownik uruchomil akcje testowa.');
        setStatus('Wyslano komunikat do konsoli.');
    }

    function showDate() {
        if (!dateField) {
            return;
        }
        dateField.textContent = formatDateDayMonthYear(new Date());
        setStatus('Wyswietlono date w formacie dzien-miesiac-rok.');
    }

    function bindClick(id, handler) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', handler);
        }
    }

    bindClick('btn-zwieksz', increaseHeading);
    bindClick('btn-zmniejsz', decreaseHeading);
    bindClick('btn-akcent', setAccentTheme);
    bindClick('btn-neon', setNeonTheme);
    bindClick('btn-przywroc', resetTheme);
    bindClick('btn-tytul', setTabTitle);
    bindClick('btn-alert', showAlert);
    bindClick('btn-konsola', logMessage);
    bindClick('btn-data', showDate);

    document.querySelectorAll('.panel[data-hint]').forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            if (hint) {
                hint.textContent = panel.dataset.hint;
            }
        });
    });
})();
