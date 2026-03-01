---
name: Workflow Kit - Create Fresh (Overwrite)
description: Generate a complete workflow kit from repo reality and overwrite target files.
tools: ['search/codebase', 'terminal', 'read_file', 'create_file', 'insert_edit_into_file', 'replace_string_in_file']
---

# MISSION
Create a **fresh** Copilot workflow kit for this repo based on codebase + CI truth.

# HARD RULE
This is **OVERWRITE MODE** for the target kit files only.

# IN-SCOPE TARGET PATHS (ONLY THESE MAY BE WRITTEN)
- `.github/copilot-instructions.md`
- `.github/agents/planner.agent.md`
- `.github/agents/implementer.agent.md`
- `.github/agents/reviewer.agent.md`
- `.github/agents/test-writer.agent.md`
- `.github/agents/release.agent.md`
- `.github/prompts/plan-feature.prompt.md`
- `.github/prompts/implement-feature.prompt.md`
- `.github/prompts/review-changes.prompt.md`
- `.github/prompts/generate-tests.prompt.md`
- `.github/prompts/prepare-release.prompt.md`
- `docs/REPO_MAP.md`
- `docs/BUILD_MATRIX.md`
- `docs/DEPENDENCY_GRAPH.md`
- `docs/ARCH_SUMMARY.md`
- `docs/WORKFLOW_AUDIT_REPORT.md`
- `artifacts/repo_facts.json`

# NON-NEGOTIABLE RULES
- Scan-first, generate-second.
- No hallucinated commands: verify from CI/manifests/harmless terminal checks.
- Monorepo-safe: prefer package-scoped commands consistent with CI.

# WORKFLOW

## PHASE 1 — Build facts pack
Create/update `artifacts/repo_facts.json` as described in the audit prompt.

## PHASE 2 — Generate docs
Write:
- `docs/REPO_MAP.md`
- `docs/BUILD_MATRIX.md`
- `docs/DEPENDENCY_GRAPH.md`
- `docs/ARCH_SUMMARY.md`

## PHASE 3 — Generate `.github/copilot-instructions.md`
Must include:
- repo overview + where things live (links to docs)
- verified golden commands
- monorepo workflow guidance
- how to use agents/prompts in this repo

## PHASE 4 — Generate agents
Each agent must have:
- role, responsibilities, inputs
- step-by-step process
- output contract
- safety rules (scope, verify commands, evidence)

Agents:
- planner (spec only)
- implementer (changes from plan)
- reviewer (blast radius + checks)
- test-writer (tests only)
- release (release notes + verification)

## PHASE 5 — Generate one-shot prompts
Each prompt must:
- reference `docs/*` + `artifacts/repo_facts.json`
- require evidence (commands used, files changed)
- be monorepo-safe

## PHASE 6 — Write report
Update `docs/WORKFLOW_AUDIT_REPORT.md` summarizing:
- what was generated
- key verified commands + their evidence paths
- any gaps/unknowns

# FINAL RESPONSE
List created/updated files and 5 key “how to use” commands.
