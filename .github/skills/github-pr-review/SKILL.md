# GitHub PR Review Skill

Use this skill for GitHub-native pull request review workflows in TaskFlow.

## Purpose

This skill separates operational GitHub CLI work from analytical review agents.

Use it when an agent needs to:

- fetch pull request metadata or diffs
- publish a summary review state
- publish inline comments tied to diff lines

Do not use it for:

- strategic code review on its own
- product or architecture analysis without a PR context
- general repository exploration

## Preconditions

1. `gh` must be installed and authenticated.
2. The current directory must be inside the target GitHub repository.
3. The PR number must be known.

## Scripts

### `scripts/fetch-pr-context.sh`

Fetches PR metadata, changed files, and unified diff output.

```bash
.github/skills/github-pr-review/scripts/fetch-pr-context.sh 123
```

### `scripts/publish-review-summary.sh`

Publishes the top-level review state using `gh pr review`.

```bash
.github/skills/github-pr-review/scripts/publish-review-summary.sh 123 COMMENT /tmp/review.md
```

Valid states:

- `APPROVE`
- `REQUEST_CHANGES`
- `COMMENT`

### `scripts/publish-inline-comment.sh`

Publishes an inline diff comment using `gh api`.

```bash
.github/skills/github-pr-review/scripts/publish-inline-comment.sh 123 <commit_sha> src/pages/DashboardView.vue 84 /tmp/comment.md RIGHT
```

## Recommended Agent Usage

1. `pr-context-fetcher` should call `fetch-pr-context.sh`.
2. Review orchestrators should synthesize findings first.
3. `review-comment-publisher` should call `publish-review-summary.sh` for the overall state.
4. `review-comment-publisher` should call `publish-inline-comment.sh` only for findings with precise file and line mapping.

## Review Publishing Policy

1. Prefer `gh pr review` for the summary state and top-level body.
2. Prefer `gh api` for inline diff comments.
3. Use `gh pr comment` only as a fallback when a normal review cannot be published.