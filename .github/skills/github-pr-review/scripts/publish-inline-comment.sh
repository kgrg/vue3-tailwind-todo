#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 5 || $# -gt 6 ]]; then
  echo "Usage: $0 <pr-number> <commit-sha> <path> <line> <body-file> [RIGHT|LEFT]" >&2
  exit 1
fi

pr_number="$1"
commit_sha="$2"
path="$3"
line_number="$4"
body_file="$5"
side="${6:-RIGHT}"

command -v gh >/dev/null 2>&1 || {
  echo "gh CLI is required but not installed." >&2
  exit 1
}

if [[ ! -f "$body_file" ]]; then
  echo "Comment body file not found: $body_file" >&2
  exit 1
fi

repo_full_name="$(gh repo view --json nameWithOwner --jq '.nameWithOwner')"
owner="${repo_full_name%%/*}"
repo="${repo_full_name##*/}"

gh api \
  "repos/$owner/$repo/pulls/$pr_number/comments" \
  --method POST \
  -F "body=@$body_file" \
  -F "commit_id=$commit_sha" \
  -F "path=$path" \
  -F "side=$side" \
  -F "line=$line_number"