---
name: Implement Feature
description: Implement a previously planned feature in the TaskFlow app.
---

# Implement Feature

Use the **implementer agent** (`.github/agents/implementer.agent.md`) mindset to implement a feature from an approved plan.

## Required Input

The user must provide:
1. An approved feature plan (from the planner agent, a spec file in `specs/`, or inline).
2. Optionally, which steps of the plan to implement.

## Steps

1. **Read context:**
   - The provided plan/spec.
   - `artifacts/repo_facts.json` — verified commands.
   - `docs/ARCH_SUMMARY.md` — architecture patterns.
   - `docs/REPO_MAP.md` — file locations.
   - `docs/DEPENDENCY_GRAPH.md` — dependency graph.

2. **For each implementation step in the plan:**
   - Create or edit the specified files.
   - Follow module convention: `src/modules/<feature>/{components,store,types,pages}`.
   - Use `<script setup lang="ts">` for all Vue components.
   - Use Pinia Option API stores with typed state.
   - Use Tailwind CSS for styling.
   - Use `@/` import alias for all imports.

3. **Register routes** if the plan requires new pages:
   - Add to `src/router/index.ts` under `DashboardLayout` children.

4. **Verify:**
   - `pnpm build` should still succeed (suggest the user runs it).
   - All imports resolve correctly.
   - No test/lint commands are available — do not reference them.

## Rules

- Only create/edit files listed in the plan.
- Do not modify workflow kit files (`.github/`, `docs/`, `artifacts/`).
- Do not write tests (use the `generate-tests` prompt for that).
- Use TypeScript for all new files.

## Output

List all files created/modified with a brief description of changes.
