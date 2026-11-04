# Wierzba

Strony i własny kod: Franciszek 'sh3kda' Dawid. [Autorstwo](humans.txt).
Katalog projektu odpowiada `~/public_html/`.

```bash
bash scripts/reindex.sh --recursive          # odśwież indeksy
bash scripts/reindex.sh --new -- dh/web/nowy # dodaj katalog
bash scripts/deploy.sh --dry-run             # sprawdź zmiany
bash scripts/deploy.sh --apply               # wyślij na serwer
```

`deploy.sh --apply` wysyła pliki, odświeża indeksy i publikuje zmiany na GitHub `main`.
Tylko serwer tworzy automatyczne commity; brak zmian oznacza brak nowego commitu.
Logo strony głównej edytuj w `scripts/reindex.sh`.
Opisy portfolio edytuj w `dh/projekty/index.html` — nowe katalogi nie dodają kart automatycznie.
`.noindex` blokuje generowanie indeksu, nie wysyłanie strony z laptopa.
Nie usuwaj znaczników `DYNAMIC_LINKS` w `dh/index.html`.
Synchronizacja usuwa tylko pliki wskazane w `scripts/deploy.filters`.

Cron o 00:00 czasu serwera; sprawdzenie: `crontab -l`.

```cron
0 0 * * * /bin/bash "$HOME/public_html/scripts/publish.sh" >> "$HOME/wierzba-reindex.log" 2>&1
```

Testy: `node --test scripts/test-indexing.test.cjs`.
Testy publikacji (Linux): `node --test scripts/test-publishing.test.cjs`.

Repozytorium i klucz wdrożeniowy serwera są poza stroną, w `~/.local/state/wierzba/`.
`.env`, ustawienia IDE i pliki połączeń bazodanowych nie trafiają do publicznego repozytorium.
Podejrzane klucze/tokeny i pliki ≥ 100 MiB zatrzymują publikację. Kontrola nie zastępuje przeglądu zmian.
Obce zmiany na GitHub zatrzymują automat zamiast nadpisywać historię.
Ręczna publikacja na serwerze: `bash ~/public_html/scripts/publish.sh`.

`noindex` prosi o nieindeksowanie; nie blokuje kopiowania publicznej treści.
