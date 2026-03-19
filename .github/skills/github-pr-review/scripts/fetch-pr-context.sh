#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <pr-number>" >&2
  exit 1
fi

pr_number="$1"

command -v gh >/dev/null 2>&1 || {
  echo "gh CLI is required but not installed." >&2
  exit 1
}

echo "## PR Metadata"
gh pr view "$pr_number" \
  --json number,title,body,author,baseRefName,headRefName,mergeStateStatus,reviewDecision,isDraft,url,labels \
  --jq '{number,title,body,author:.author.login,baseRefName,headRefName,mergeStateStatus,reviewDecision,isDraft,url,labels:[.labels[].name]}'

echo
echo "## Changed Files"
gh pr view "$pr_number" \
  --json files \
  --jq '.files[] | {path, additions, deletions}'

echo
echo "## Unified Diff"
gh pr diff "$pr_number"