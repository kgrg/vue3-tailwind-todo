#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "Usage: $0 <pr-number> <APPROVE|REQUEST_CHANGES|COMMENT> <body-file>" >&2
  exit 1
fi

pr_number="$1"
review_state="$2"
body_file="$3"

command -v gh >/dev/null 2>&1 || {
  echo "gh CLI is required but not installed." >&2
  exit 1
}

if [[ ! -f "$body_file" ]]; then
  echo "Review body file not found: $body_file" >&2
  exit 1
fi

case "$review_state" in
  APPROVE)
    gh pr review "$pr_number" --approve --body-file "$body_file"
    ;;
  REQUEST_CHANGES)
    gh pr review "$pr_number" --request-changes --body-file "$body_file"
    ;;
  COMMENT)
    gh pr review "$pr_number" --comment --body-file "$body_file"
    ;;
  *)
    echo "Invalid review state: $review_state" >&2
    exit 1
    ;;
esac