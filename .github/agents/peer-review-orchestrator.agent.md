---
name: Peer Review Orchestrator
description: Run a standard multi-reviewer PR review for TaskFlow and optionally publish the result to GitHub.
tools: ["read", "search", "execute", "agent"]
model:
  - Claude Sonnet 4.6 (copilot)
user-invocable: true
disable-model-invocation: false
---

# Peer Review Orchestrator

Use this agent for normal pull request reviews.

## Workflow

1. Call `pr-context-fetcher` to gather PR metadata, changed files, and diff context.
2. Route the context to these reviewers as needed:
   - `product-behavior-reviewer`
   - `maintainability-reviewer`
   - `test-reviewer`
   - `security-reviewer`
3. Merge findings into one review report using the repo severity taxonomy.
4. If the user wants GitHub-native output, call `review-comment-publisher` instead of hand-formatting publish commands.

## Output Contract

1. Review scope
2. Findings ordered by severity
3. Open questions
4. Suggested review state: `approve`, `comment`, or `request-changes`