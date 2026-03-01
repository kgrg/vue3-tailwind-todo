---
name: Workflow Kit - Update Existing (Apply Fixes + Add Missing)
description: Apply minimal updates to existing kit based on repo reality and add any missing required files.
tools: ['search/codebase', 'terminal', 'read_file', 'create_file', 'insert_edit_into_file', 'replace_string_in_file']
---

# MISSION
Update the existing workflow kit to match repo reality:
- Fix incorrect/outdated commands and paths.
- Reduce risky repo-wide operations.
- Add missing required kit files.

# RULES
- Minimal edits: keep correct content; change only what’s wrong or missing.
- Verify all commands from CI/manifests/terminal.
- Only edit kit paths.

# IN-SCOPE PATHS
- `.github/copilot-instructions.md`
- `.github/agents/*.agent.md`
- `.github/prompts/*.prompt.md`
- `docs/*.md`
- `artifacts/repo_facts.json`

# WORKFLOW

## PHASE 1 — Load facts + audit
- Rebuild `artifacts/repo_facts.json`.
- Ensure `docs/WORKFLOW_AUDIT_REPORT.md` exists; update it.

## PHASE 2 — Apply fixes
For each Broken/Risky/Outdated item:
- Apply patch with `replace_string_in_file` / `insert_edit_into_file`.
- Record "Applied" in the report with evidence.

## PHASE 3 — Add missing required files
Ensure the required target list exists (same as audit prompt).
If missing, create:
- missing agents
- missing prompts
- missing docs maps (if absent or stale, regenerate)

## PHASE 4 — Consistency pass
- Ensure `.github/copilot-instructions.md` references docs and prompts correctly.
- Ensure prompts reference `artifacts/repo_facts.json` and request evidence.

# FINAL RESPONSE
1) Files updated/created
2) Top 5 fixes applied (with evidence paths)
3) Remaining proposed items (if any)
