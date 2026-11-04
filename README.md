# Wierzba - serwer uczelniany

skrypt sumy:
```bash
bash scripts/deploy.sh --apply
```

<br>

składowe:
```bash
bash scripts/reindex.sh --recursive                     # odswieza wszystkie automatyczne indexy w publicznych katalogach
bash scripts/reindex.sh --new -- dh/web/nowy            # tworzy nowy katalog i aktualizuje indexy rodzicow
bash scripts/deploy.sh --dry-run                        # pokazuje co zostanie wyslane na serwer, ale nic nie zmienia
bash scripts/deploy.sh --apply                          # wysyla pliki na serwer i uruchamia publikacje po stronie serwera
bash scripts/pull-if-remote-changed.sh --check-only     # sprawdza czy origin ma nowe commity bez wykonywania pull
bash scripts/pull-if-remote-changed.sh                  # robi git pull tylko jesli zdalne repo jest do przodu
```

`deploy.sh --apply` wysyła pliki, odświeża indeksy i publikuje zmiany na GitHub `main`.
<br><br>
Tylko serwer tworzy automatyczne commity; brak zmian oznacza brak nowego commitu.
<br><br>
Logo strony głównej edytuj w `scripts/reindex.sh`.
Opisy portfolio edytuj w `dh/projekty/index.html` — nowe katalogi nie dodają kart automatycznie.
`.noindex` blokuje generowanie indeksu, nie wysyłanie strony z laptopa.
<br><br>
Nie usuwaj znaczników `DYNAMIC_LINKS` w `dh/index.html`.
Synchronizacja usuwa tylko pliki wskazane w `scripts/deploy.filters`.

Cron o 00:00 czasu serwera;

Testy: `node --test scripts/test-indexing.test.cjs`.
Testy publikacji (Linux): `node --test scripts/test-publishing.test.cjs`.

Repozytorium i klucz wdrożeniowy serwera są poza stroną, w `~/.local/state/wierzba/`.
`.env`, ustawienia IDE i pliki połączeń bazodanowych nie trafiają do publicznego repozytorium.
Podejrzane klucze/tokeny i pliki ≥ 100 MiB zatrzymują publikację. Kontrola nie zastępuje przeglądu zmian.
Obce zmiany na GitHub zatrzymują automat zamiast nadpisywać historię.
Ręczna publikacja na serwerze: `bash ~/public_html/scripts/publish.sh`.

`noindex` prosi o nieindeksowanie; nie blokuje kopiowania publicznej treści.

Strony i własny kod: [Franciszek 'sh3kda' Dawid.](humans.txt). <Br>
Katalog projektu odpowiada `~/public_html/`.
