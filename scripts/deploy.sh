#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd -P)"
OPTIONS=(-rtc --delete-after --itemize-changes)
case "${1:---dry-run}" in
    --dry-run) OPTIONS+=(--dry-run) ;;
    --apply) ;;
    *) printf 'Usage: bash scripts/deploy.sh [--dry-run|--apply]\n' >&2; exit 1 ;;
esac
[[ $# -le 1 ]] || { printf 'Too many arguments.\n' >&2; exit 1; }

rsync "${OPTIONS[@]}" \
    --filter="merge $SCRIPT_DIR/deploy.filters" \
    --rsync-path='flock -w 120 /home/epi/25_dawid/.local/state/wierzba/publish.lock rsync' \
    -e 'ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=15' \
    "$PROJECT_ROOT/" 25_dawid@wierzba.wzks.uj.edu.pl:/home/epi/25_dawid/public_html/

if [[ "${1:---dry-run}" == --apply ]]; then
    ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=15 \
        25_dawid@wierzba.wzks.uj.edu.pl \
        'cd "$HOME/public_html" && bash scripts/publish.sh'
fi
