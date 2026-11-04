# en Passant — frontend

Gra edukacyjna o cyberbezpieczeństwie. Gracz przechodzi przez 10 rozdziałów, rozmawiając z królem szachowym. Po drodze dowiaduje się o hasłach, phishingu, malware i innych zagrożeniach.

Zbudowane w SvelteKit 5 z routingiem plikowym.

---

## Uruchamianie

```
npm install
npm run dev
```

Otwiera się pod `localhost:5173`. Żeby udostępnić innym w sieci lokalnej:

```
npm run dev -- --host
```

---

## Struktura plików

```
src/routes/
  +page.svelte          — strona główna (menu)
  +layout.svelte        — wspólny layout dla całej aplikacji
  strona1/+page.svelte  — rozdział 1 (wybór gracza)
  strona2/+page.svelte  — rozdział 2 (hasła)
  ...
  strona10/+page.svelte — rozdział 10 (podsumowanie)
  Biblioteka/           — lista zasobów
  Scenariusze/          — lista scenariuszy
  O_projekcie/          — strona o projekcie
```

Każdy rozdział to osobny plik `.svelte`. Nie ma wspólnych komponentów dla okien dialogowych ani obszarów roboczych — każda strona ma własny kod.

---

## Jak działa JavaScript wewnątrz

### Zmienne reaktywne (`$state`, `$derived`)

To jest Svelte 5. Zamiast `let x = 0` piszemy `let x = $state(0)`. Różnica jest taka, że Svelte obserwuje tę zmienną i jak się zmieni, automatycznie aktualizuje HTML który jej używa. Nie trzeba nic ręcznie odświeżać.

`$derived` to zmienna która wylicza się automatycznie z innej zmiennej:

```js
let currentWorkspace = $derived(workspace[currentMessageIndex] ?? null);
```

Za każdym razem gdy `currentMessageIndex` się zmieni, `currentWorkspace` też się zmieni — od razu, bez żadnego dodatkowego kodu.

---

### `typeMessage()` — efekt maszyny do pisania

Ta funkcja pojawia się w każdym rozdziale i robi jedną rzecz: wypisuje tekst wiadomości króla literka po literce.

Działa tak:
1. Czyści poprzedni interwał (gdyby poprzednia wiadomość jeszcze się pisała).
2. Ustawia `displayedText = ''` i `isTyping = true`.
3. Uruchamia `setInterval` co 50 ms, który dokłada jedną literę do `displayedText`.
4. Kiedy wszystkie litery są już wypisane, `setInterval` zatrzymuje się i `isTyping` wraca do `false`.

`setInterval` to wbudowana przeglądarkowa funkcja — wywołuje podany kod co X milisekund, dopóki jej nie zatrzymasz przez `clearInterval`.

---

### `handleAdvance()` — kliknięcie w obszar dialogowy

Wywoływana gdy gracz kliknie w dymek lub wciśnie spację/enter.

Zachowuje się inaczej w zależności od stanu:
- Jeśli tekst się jeszcze pisze (`isTyping = true`) — pomija animację i od razu wyświetla cały tekst.
- Jeśli tekst jest już wyświetlony i nie ma następnej wiadomości — przechodzi do następnego rozdziału (`location.href = '/stronaN'`).
- Jeśli jest następna wiadomość — zwiększa `currentMessageIndex` o 1 i wywołuje `typeMessage()`.

W strona2–10 zapisuje też aktualny indeks do `sessionStorage` żeby gracz mógł wrócić do miejsca gdzie skończył.

---

### `handleBack()` — przycisk cofania

Odwrotność `handleAdvance`. Zmniejsza `currentMessageIndex` o 1. Jeśli indeks wynosi 0 i gracz cofnie się, przechodzi do poprzedniego rozdziału.

Jeśli tekst się właśnie pisze — najpierw go kończy (tak samo jak `handleAdvance`), a dopiero po kolejnym kliknięciu cofa.

---

### `handleKeydown()` — obsługa klawiatury

Nasłuchuje na zdarzenia klawiatury na poziomie całego okna. Reaguje na:
- `Space` / `Enter` — to samo co kliknięcie (wywołuje `handleAdvance`).
- `Escape` — zamyka dialog potwierdzenia wyjścia, jeśli jest otwarty.
- Cyfry `1`, `2` — w strona1 wybierają odpowiedź gracza.

Ignoruje naciśnięcia gdy focus jest na przycisku, polu tekstowym lub innym interaktywnym elemencie.

---

### `onMount()` — co się dzieje po załadowaniu strony

`onMount` to funkcja z biblioteki Svelte. Kod który jej przekażesz wykona się raz, po tym jak strona zostanie wyświetlona w przeglądarce (nie podczas renderowania).

W każdym rozdziale robi trzy rzeczy:
1. Sprawdza `sessionStorage` czy gracz nie wraca do tej strony — jeśli tak, odtwarza zapisany indeks wiadomości.
2. Uruchamia `typeMessage()` żeby zaczął się efekt pisania.
3. Rejestruje `handleKeydown` na `window` żeby obsługiwać klawiaturę.

Na końcu zwraca funkcję porządkującą (cleanup): usuwa nasłuchiwacz klawiatury i zatrzymuje `setInterval`. Svelte wywołuje tę funkcję gdy strona jest opuszczana.

---

### System wyboru w strona1 (najbardziej skomplikowana część)

Strona 1 różni się od pozostałych bo gracz może wybrać odpowiedź. Zamiast prostego `messages[]` + `currentMessageIndex`, strona1 ma dwa tryby wyświetlania i kilka dodatkowych stanów.

Zmienne specyficzne dla strona1:
- `showChoices` — czy pokazać przyciski wyboru
- `choiceSelected` — czy gracz już wybrał
- `selectedChoiceIndex` — który przycisk wybrał (0 lub 1)
- `choiceResponseText` — tekst odpowiedzi króla po wyborze
- `aleText` — tekst "Ale..." który pojawia się jeśli gracz wybrał opcję 2
- `isCentered` — czy layout ma być wyśrodkowany (king nad wyborem) czy normalny (king po lewej)

`isCentered` to `$derived(showChoices || choiceSelected)` — automatycznie się zmienia gdy pokazują się wybory.

**`handleChoice(index)`** — wywoływana po kliknięciu jednego z przycisków:
- Chowa przyciski (`showChoices = false`), zapisuje który wybór (`selectedChoiceIndex = index`).
- Jeśli gracz wybrał opcję 2 (sceptyczną): najpierw literka po literce wypisuje "Ale...", a dopiero po zakończeniu tej animacji uruchamia odpowiedź króla. To jest zrobione przez zagnieżdżony `setInterval` wewnątrz callbacku pierwszego interwału.
- Jeśli gracz wybrał opcję 1: od razu wywołuje odpowiedź króla.

**`startKingResponse(text)`** — wypisuje odpowiedź króla literka po literce, tak samo jak `typeMessage`, ale w zmienną `choiceResponseText`.

Po zakończeniu pisania odpowiedzi, gracz może wcisnąć spację żeby przejść do strona2 (`handleChoiceConfirm`).

---

### Obszar roboczy (`workspace`) w strona2–10

Każdy rozdział ma tablicę `workspace` z 5 wpisami (po jednym na każdą wiadomość). Wpis może być `null` (brak panelu) albo obiektem z polami:

- `tag` — mała etykietka w lewym górnym rogu panelu
- `title` — nagłówek panelu
- `layout` — jaki typ panelu: `'list'`, `'steps'`, `'grid'`, `'stat'`, `'examples'`, `'bars'`
- `content` — opcjonalny akapit z opisem
- `items` — lista punktów (do `layout: 'list'`)
- `steps` — numerowana lista kroków (do `layout: 'steps'`)
- `cards` — karty z nagłówkiem i treścią (do `layout: 'grid'`)
- `stat` — duża liczba/statystyka (do `layout: 'stat'`)
- `stat_label` — opis pod statystyką
- `examples` — porównanie dwóch rzeczy (do `layout: 'examples'`), każde z polem `bad: true/false`
- `bars` — wykres słupkowy (do `layout: 'bars'`), każdy słupek ma `label` i `value` (procent)
- `note` — mała notatka na dole panelu

`currentWorkspace` jest zmienną `$derived` — automatycznie wskazuje na właściwy wpis dla aktualnej wiadomości. HTML renderuje go warunkowo (`{#if currentWorkspace}`) i wyświetla tylko te sekcje których dane są obecne.

---

## Ilość linii kodu

Łącznie we wszystkich plikach `.svelte`, `.js` i `.ts` w katalogu `src/`:

**9147 linii**
