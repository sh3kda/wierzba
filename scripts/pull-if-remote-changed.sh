#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd -P)"

die() {
    printf 'Git sync error: %s\n' "$*" >&2
    exit 1
}

usage() {
    cat <<'EOF'
Usage: bash scripts/pull-if-remote-changed.sh [--check-only]

Options:
  --check-only   Only report status; do not run git pull.
EOF
}

CHECK_ONLY=false
case "${1:-}" in
    "") ;;
    --check-only) CHECK_ONLY=true ;;
    -h|--help) usage; exit 0 ;;
    *) usage >&2; exit 1 ;;
esac
[[ $# -le 1 ]] || { usage >&2; exit 1; }

command -v git >/dev/null || die 'git is required.'
git -C "$PROJECT_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1 ||
    die "Not a git repository: $PROJECT_ROOT"

branch="$(git -C "$PROJECT_ROOT" symbolic-ref --quiet --short HEAD)" ||
    die 'Detached HEAD is not supported by this script.'

upstream_ref="$(git -C "$PROJECT_ROOT" rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null)" ||
    die "No upstream configured for branch '$branch'. Use: git branch --set-upstream-to origin/$branch"

remote_name="$(git -C "$PROJECT_ROOT" for-each-ref --format='%(upstream:remotename)' "refs/heads/$branch")"
upstream_short="$(git -C "$PROJECT_ROOT" for-each-ref --format='%(upstream:short)' "refs/heads/$branch")"
upstream_branch="${upstream_short#*/}"

[[ -n "$remote_name" ]] || die "Cannot resolve remote for upstream '$upstream_ref'."
[[ -n "$upstream_branch" ]] || die "Cannot resolve upstream branch from '$upstream_short'."

if ! git -C "$PROJECT_ROOT" diff --quiet || ! git -C "$PROJECT_ROOT" diff --cached --quiet; then
    die 'Working tree has uncommitted changes. Commit or stash before pulling.'
fi

git -C "$PROJECT_ROOT" fetch --prune "$remote_name"

local_sha="$(git -C "$PROJECT_ROOT" rev-parse HEAD)"
remote_sha="$(git -C "$PROJECT_ROOT" rev-parse "$upstream_ref")"

if [[ "$local_sha" == "$remote_sha" ]]; then
    printf 'Already up to date (%s).\n' "$upstream_ref"
    exit 0
fi

if git -C "$PROJECT_ROOT" merge-base --is-ancestor "$local_sha" "$remote_sha"; then
    if [[ "$CHECK_ONLY" == true ]]; then
        printf 'Remote has new commits on %s. Run without --check-only to pull.\n' "$upstream_ref"
    else
        printf 'Pulling updates from %s...\n' "$upstream_ref"
        git -C "$PROJECT_ROOT" pull --ff-only "$remote_name" "$upstream_branch"
        printf 'Pull completed.\n'
    fi
    exit 0
fi

if git -C "$PROJECT_ROOT" merge-base --is-ancestor "$remote_sha" "$local_sha"; then
    printf 'Local branch is ahead of %s. No pull needed.\n' "$upstream_ref"
    exit 0
fi

die "Local branch and '$upstream_ref' have diverged. Resolve manually (rebase/merge)."
