#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd -P)"
STATE_DIR="$HOME/.local/state/wierzba"
REPOSITORY="$STATE_DIR/repository.git"
export GIT_TERMINAL_PROMPT=0

die() {
    printf 'Blad publikacji GitHub: %s\n' "$*" >&2
    exit 1
}

repo_git() {
    git -C "$PROJECT_ROOT" --git-dir="$REPOSITORY" --work-tree="$PROJECT_ROOT" "$@"
}

[[ $# -eq 0 ]] || die "Ten skrypt nie przyjmuje argumentow."
[[ -d "$REPOSITORY" ]] || die "Brak repozytorium serwerowego: $REPOSITORY"
command -v flock >/dev/null || die "Wymagany jest flock (skrypt serwerowy Linux)."
exec 9>"$STATE_DIR/publish.lock"
flock -w 120 9 || die "Inna publikacja lub synchronizacja nadal trwa."
[[ "$(repo_git symbolic-ref --short HEAD)" == main ]] || die "Wymagana galaz main."

repo_git fetch --no-tags origin refs/heads/main:refs/remotes/origin/main

local_head="$(repo_git rev-parse HEAD)"
remote_head="$(repo_git rev-parse refs/remotes/origin/main)"
if [[ "$local_head" != "$remote_head" ]]; then
    if repo_git merge-base --is-ancestor "$local_head" "$remote_head"; then
        # Remote moved forward without history rewrite; fast-forward local main ref.
        repo_git update-ref refs/heads/main "$remote_head"
    elif repo_git merge-base --is-ancestor "$remote_head" "$local_head"; then
        :
    else
        die "GitHub ma obce zmiany. Uzgodnij historie recznie; nie wykonano force-push."
    fi
fi

bash "$SCRIPT_DIR/reindex.sh" --recursive
repo_git add -A -- .

while IFS= read -r -d '' file; do
    case "/$file" in
        */.env|*/.env.*|*.pem|*.key|*.p12|*.pfx|*.sqlite|*.sqlite3|*.db|*/.DS_Store|*/.vscode/*|*/.idea/*|/dh/bazy-danych/*.php|/dh/bazy-danych/*.txt|/dh/bd2/*.php|/dh/bd2/*.txt)
            die "Niedozwolony plik w indeksie Git: $file"
            ;;
    esac
done < <(repo_git ls-files -z)

gitlinks="$(repo_git ls-files --stage | awk '$1 == "160000" { print }')"
[[ -z "$gitlinks" ]] || die "Zagniezdzone repozytoria nie zostaly splaszczone: $gitlinks"
large_objects="$(repo_git ls-files --stage | awk '{ print $2 }' |
    repo_git cat-file --batch-check='%(objectname) %(objectsize)' |
    awk '$2 >= 104857600 { print $1 }')"
[[ -z "$large_objects" ]] || die "Pliki >= 100 MiB wymagaja osobnej decyzji (np. Git LFS): $large_objects"

secret_pattern='-----BEGIN ([A-Z]+ )*PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,}|AKIA[0-9A-Z]{16}|sk-proj-[A-Za-z0-9_-]{40,}'
if secret_files="$(repo_git grep --cached -I -l -E -e "$secret_pattern" -- .)"; then
    die "Podejrzenie klucza lub tokenu; publikacja zatrzymana. Sprawdz pliki: $secret_files"
else
    status=$?
    [[ "$status" -eq 1 ]] || die "Nie udalo sie sprawdzic zawartosci indeksu Git."
fi

if repo_git diff --cached --quiet; then
    printf 'Brak zmian do zapisania w Git.\n'
else
    status=$?
    [[ "$status" -eq 1 ]] || die "Nie udalo sie porownac indeksu Git."
    repo_git commit -m "Update website snapshot" \
        -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
fi

if [[ "$(repo_git rev-parse HEAD)" != "$(repo_git rev-parse refs/remotes/origin/main)" ]]; then
    repo_git push origin HEAD:refs/heads/main
else
    printf 'GitHub main jest aktualny.\n'
fi
