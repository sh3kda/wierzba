/*poczekaj na załadowanie dokumentu plus wlaczenie scislego JSa*/
$(function() {
    'use strict';

    // 1. STOPKA - aktualny rok
    $('#rok').text(new Date().getFullYear());
    
    // 2. ANIMACJE
    const obserwator = new IntersectionObserver((wpisy) => {
        wpisy.forEach(wpis => {
            if (wpis.isIntersecting) $(wpis.target).addClass('widoczny');
        });
    });
    $('.animacjaWejscia').each(function() { obserwator.observe(this); });

    // 3. USŁUGI (ZAKŁADKI)
    const $karty = $('.kartaZabiegu');
    let index = 0;

    function pokazSlajd(nr) {
        if (nr < 0) nr = $karty.length - 1;
        if (nr >= $karty.length) nr = 0;
        index = nr;

        $('.kartaZabiegu, .panelOpisu').removeClass('aktywny');
        
        const $wybrana = $karty.eq(nr);
        $wybrana.addClass('aktywny');
        $('#' + $wybrana.data('target')).addClass('aktywny');

        $('#mobileNumer').text($wybrana.find('.numerZabiegu').text());
        $('#mobileTytul').text($wybrana.find('.nazwaZabiegu').text());
    }

    $karty.click(function() { pokazSlajd($karty.index(this)); });
    $('#nextUsluga').click(() => pokazSlajd(index + 1));
    $('#prevUsluga').click(() => pokazSlajd(index - 1));
    pokazSlajd(0);

    // 4. FORMULARZ 
    const $form = $('#formularzKontaktowy');
    const $status = $('#statusFormularza');

    // Funkcja łącząca CSS z kodem JS
    function oznaczBlad($input, czyJestBlad) {
        $input.toggleClass('blad', czyJestBlad); // Czerwona ramka inputa
        $input.parent().toggleClass('pokazBlad', czyJestBlad); // Pokazanie tekstu błędu
    }

    $form.on('submit', function(e) {
        e.preventDefault();
        
        // Pobieramy wartości
        const imieInput = $('#poleImie');
        const emailInput = $('#poleKontakt');
        const wiadomoscInput = $('#poleWiadomosc');

        const imie = imieInput.val().trim();
        const email = emailInput.val().trim();
        const tresc = wiadomoscInput.val().trim();

        // LOGIKA SPRAWDZANIA BŁĘDÓW
        const bladImie = imie.length < 3;
        const bladEmail = email.indexOf('@') === -1 || email.indexOf('.') === -1;
        const bladTresc = tresc.length < 5;

        // update bledu (czerwone ramki i napisy)
        oznaczBlad(imieInput, bladImie);
        oznaczBlad(emailInput, bladEmail);
        oznaczBlad(wiadomoscInput, bladTresc);

        // BLAD = STOP
        if (bladImie || bladEmail || bladTresc) {
            $status.text("Popraw zaznaczone pola.").addClass('blad').removeClass('sukces');
            return; // Przerywamy funkcję, nic się nie wyśle
        }

        // JEŚLI NIE MA BLEDOW = WYSLIJ
        $status.text("Wysyłanie wiadomości...").removeClass('blad sukces');
        
        $.ajax({
            url: "https://formspree.io/f/xaqyyvyn",
            method: "POST",
            data: $form.serialize(),
            dataType: "json"
        })
        .done(function() {
            $status.text("Wysłano pomyślnie! Dziękuję.").addClass('sukces');
            $form[0].reset();
            $('.blad, .pokazBlad').removeClass('blad pokazBlad'); // czysc style bledow
        })
        .fail(function(err) {
            console.error("Błąd wysyłki:", err); // Podgląd bledu w konsoli
            $status.text("Błąd wysyłki. Sprawdź połączenie.").addClass('blad');
        });
    });
});