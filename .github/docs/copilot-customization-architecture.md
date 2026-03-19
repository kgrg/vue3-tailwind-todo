# Copilot Customization Architecture

## Detected Repository Architecture

- Repo shape: single-package product repository.
- Primary technical layer: Vue 3 frontend application.
- Supporting layers: shared UI/core utilities, route/layout shell, feature modules, product and engineering documentation.
- Not present as first-class layers: backend service, mobile app, infrastructure-as-code package, automated test harness, CI pipeline.

## Major Domain Boundaries

- `activities`: the main work-planning surface in current routed views.
- `tasks`: todo-style execution flow and legacy-store migration hotspot.
- `habits`: repeatable routine tracking.
- `labels`: tagging and metadata.
- `auth`: session and route access control.
- `core`: reusable UI, charts, utilities, and shared infrastructure.

## Customization Design

This customization system separates durable rules from workflow orchestration:

- `.github/copilot-instructions.md`
  - Repository-wide rules, verified commands, quality expectations, and source-of-truth guidance.
- `.github/instructions/tech/`
  - Frontend implementation rules for Vue, Pinia, routing, Tailwind, and accessibility.
- `.github/instructions/domains/`
  - Product rules for focus planning and domain modeling.
- `.github/agent/`
  - Flat agent layout for durable workflows and specialist reviewers.
- `.github/skills/github-pr-review/`
  - Operational GitHub CLI workflow for fetching PR context and publishing summary or inline review comments.

## Why This Structure Fits The Repo

1. The repo is small enough that global rules should stay centralized, but feature work spans enough domains that path-scoped instructions reduce repeated prompt text.
2. The project is frontend-heavy, so the most durable tech rules are Vue architecture, UI consistency, and accessibility.
3. Product behavior matters more than infrastructure concerns, so domain instructions focus on planning trust, overwhelm reduction, and work-item ownership.
4. Review workflows benefit from specialist agents because product behavior, maintainability, security, and release risk are distinct concerns even in a single-package app.
5. GitHub publishing logic is operational, not analytical, so it lives in a reusable skill instead of inside reviewer agents.

## Agent Inventory

### User-invocable orchestrators

- `plan-change`: plan implementation scope without writing code.
- `implement-change`: execute an approved implementation scope.
- `release-readiness`: verify build and release risks.
- `product-ui-researcher`: evaluate UX and product-direction questions.
- `peer-review-orchestrator`: run a normal multi-reviewer PR review.
- `tech-lead-review-orchestrator`: run a deeper architectural and release-risk review.

### Hidden specialist agents

- `pr-context-fetcher`
- `review-comment-publisher`
- `product-behavior-reviewer`
- `maintainability-reviewer`
- `test-reviewer`
- `security-reviewer`
- `architecture-reviewer`
- `release-risk-reviewer`

## Review Taxonomy

All review agents use the same severity scale:

- `blocker`
- `high`
- `medium`
- `low`
- `nit`
- `praise`

Optional secondary tags:

- `bug`
- `security`
- `testing`
- `design`
- `performance`
- `readability`
- `ownership`
- `release-risk`

Example:

```text
[high][testing] The PR changes store behavior but adds no regression coverage or manual verification notes.
```

## Legacy Layout Note

The repo already contains `.github/agents/` and `.github/prompts/` from an earlier workflow kit. Those files can remain for backward compatibility, but new source-of-truth customization should be added to `.github/agent/`, `.github/instructions/`, and `.github/skills/`.

## Intentionally Omitted To Avoid Noise

- No agent per feature module.
- No dependency-ownership reviewer because this is not a multi-package ownership-heavy repo.
- No backend or infrastructure instruction files because those layers are not present.
- No test-writing skill because the repo does not yet have a working test toolchain.