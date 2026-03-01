---
name: Workflow Kit - Verify Against Repo Reality
description: Verify that the existing workflow kit commands/paths are correct and monorepo-safe; no changes except report.
tools: ['search/codebase', 'terminal', 'read_file', 'create_file', 'insert_edit_into_file', 'replace_string_in_file']
---

# MISSION
Verify the workflow kit against repo reality. Do not edit kit files.
Only write/update:
- `artifacts/repo_facts.json`
- `docs/WORKFLOW_AUDIT_REPORT.md`

# RULES
- No hallucinated commands; verify from CI/manifests/terminal.
- Record evidence paths for each verification.

# WORKFLOW
1) Build/update `artifacts/repo_facts.json`.
2) Extract all commands/paths from kit files.
3) Validate each; classify issues.
4) Write report: `docs/WORKFLOW_AUDIT_REPORT.md`.

# FINAL RESPONSE
Return report path + top issues.
