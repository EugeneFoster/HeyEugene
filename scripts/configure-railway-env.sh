#!/usr/bin/env bash
# Sync Supabase env from mikesplace-dev into Railway HeyEugene service.
# Requires: railway login + railway link (HeyEugene project)
set -euo pipefail

SOURCE="${1:-$HOME/Projects/mikesplace-dev/crm/.env.local}"
SERVICE="${RAILWAY_SERVICE:-}"

if ! command -v railway >/dev/null; then
  echo "Install Railway CLI: npm i -g @railway/cli"
  exit 1
fi

if ! railway whoami >/dev/null 2>&1; then
  echo "Run: railway login"
  exit 1
fi

if [[ ! -f "$SOURCE" ]]; then
  echo "Missing env file: $SOURCE"
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$SOURCE"
set +a

for key in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY; do
  val="${!key:-}"
  if [[ -z "$val" ]]; then
    echo "Missing $key in $SOURCE"
    exit 1
  fi
done

ARGS=()
if [[ -n "$SERVICE" ]]; then
  ARGS+=(--service "$SERVICE")
fi

printf '%s' "$NEXT_PUBLIC_SUPABASE_URL" | railway variable set NEXT_PUBLIC_SUPABASE_URL --stdin "${ARGS[@]}"
printf '%s' "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | railway variable set NEXT_PUBLIC_SUPABASE_ANON_KEY --stdin "${ARGS[@]}"
printf '%s' "$SUPABASE_SERVICE_ROLE_KEY" | railway variable set SUPABASE_SERVICE_ROLE_KEY --stdin "${ARGS[@]}"

if [[ -n "${ANTHROPIC_API_KEY:-}" ]]; then
  printf '%s' "$ANTHROPIC_API_KEY" | railway variable set ANTHROPIC_API_KEY --stdin "${ARGS[@]}"
fi

echo "Done. Railway will redeploy automatically."
echo "Verify: curl https://heyeugene-production.up.railway.app/api/status"
