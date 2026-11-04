# Wierzba

Strony i własny kod: Franciszek 'sh3kda' Dawid. [Autorstwo](humans.txt).
Katalog projektu odpowiada `~/public_html/`.

```bash
bash scripts/reindex.sh --recursive          # odśwież indeksy
bash scripts/reindex.sh --new -- dh/web/nowy # dodaj katalog
bash scripts/deploy.sh --dry-run             # sprawdź zmiany
bash scripts/deploy.sh --apply               # wyślij na serwer
```

Po wysłaniu uruchom reindeksowanie także na serwerze.
Logo strony głównej edytuj w `scripts/reindex.sh`.
Opisy portfolio edytuj w `dh/projekty/index.html` — nowe katalogi nie dodają kart automatycznie.
`.noindex` blokuje generowanie indeksu, nie wysyłanie strony z laptopa.
Nie usuwaj znaczników `DYNAMIC_LINKS` w `dh/index.html`.
Synchronizacja usuwa tylko pliki wskazane w `scripts/deploy.filters`.

Cron o 00:00 czasu serwera; sprawdzenie: `crontab -l`.

```cron
0 0 * * * cd "$HOME/public_html" && /bin/bash scripts/reindex.sh --recursive >> "$HOME/wierzba-reindex.log" 2>&1
```

Testy: `node --test scripts/test-indexing.test.cjs`.

`noindex` w HTML i nagłówku HTTP prosi o nieindeksowanie# wierzba
