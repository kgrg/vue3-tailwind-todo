---
name: Review Changes
description: Review current code changes for issues, convention violations, and risks.
---

# Review Changes

Use the **reviewer agent** (`.github/agents/reviewer.agent.md`) mindset to review code changes.

## Required Input

The user should describe or provide the changes to review. This could be:
- A list of changed files.
- A diff or PR description.
- "Review my recent changes" (agent should inspect recently modified files).

## Steps

1. **Read context:**
   - `artifacts/repo_facts.json` — repo facts.
   - `docs/ARCH_SUMMARY.md` — architecture patterns.
   - `docs/REPO_MAP.md` — verify file locations.
   - `docs/DEPENDENCY_GRAPH.md` — check for dependency issues.
   - `.github/copilot-instructions.md` — naming and module conventions.

2. **For each changed file, check:**
   - **Correctness:** Logic, types, reactive state, error handling.
   - **Architecture:** Correct directory placement, naming, module boundaries.
   - **Performance:** Unnecessary watchers, missing lazy loading, large components.
   - **Security:** No hardcoded secrets, input sanitization, auth guards.
   - **Blast radius:** Scope of changes, unintended side effects.

3. **Generate review report:**

```markdown
## Review Summary
- **Files reviewed:** <count>
- **Severity:** 🟢 Clean / 🟡 Minor / 🔴 Blocking

## Findings
| # | File | Severity | Issue | Suggestion |
|---|------|----------|-------|------------|

## Verdict
APPROVE / REQUEST CHANGES / COMMENT ONLY
```

## Rules

- Do not modify any code — review only.
- Reference specific line numbers and file paths.
- Every finding must have a concrete suggestion.
- Flag any references to commands that don't exist (no test/lint scripts available).
