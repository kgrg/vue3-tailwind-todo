---
name: Plan Feature
description: Generate a structured feature plan/spec for the TaskFlow app.
---

# Plan Feature

Use the **planner agent** (`.github/agents/planner.agent.md`) mindset to generate a feature plan.

## Required Input

The user must describe the feature they want to plan. Example:
> "Plan a notifications system that alerts users when activities are due."

## Steps

1. **Read context:**
   - `artifacts/repo_facts.json` — verified repo facts
   - `docs/ARCH_SUMMARY.md` — architecture patterns
   - `docs/REPO_MAP.md` — file/module map
   - `docs/DEPENDENCY_GRAPH.md` — dependency graph

2. **Identify affected modules:**
   - Which existing modules in `src/modules/` are affected?
   - Does this require a new module?
   - What shared components in `src/core/` are needed?
   - What routes need to be added/changed in `src/router/index.ts`?

3. **Generate the plan** with these sections:
   - **Goal Statement** — one paragraph
   - **Affected Modules** — list of files/directories
   - **Implementation Steps** — numbered, specific file-level actions
   - **Acceptance Criteria** — testable outcomes
   - **Risks & Open Questions**

4. **Verify:**
   - All referenced commands come from `artifacts/repo_facts.json`.
   - All file paths match `docs/REPO_MAP.md`.
   - Flag if the feature requires tooling not yet installed (test runner, linter, new dependencies).

## Output

Write the plan as a markdown document. Do not create/edit product code.
