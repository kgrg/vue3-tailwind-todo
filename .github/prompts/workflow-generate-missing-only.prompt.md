---
name: Workflow Kit - Generate Missing Only (No Overwrites)
description: Generate only the missing required workflow kit files; do not modify existing kit files.
tools: ['search/codebase', 'terminal', 'read_file', 'create_file', 'insert_edit_into_file', 'replace_string_in_file']
---

# MISSION
Generate only the missing required workflow kit files.
Do not overwrite or edit existing kit files.

# RULES
- Scan repo reality and create `artifacts/repo_facts.json` (allowed).
- Only create missing files in the required target list.
- If a target file exists, leave it untouched.
- Verify commands via CI/manifests/terminal.

# REQUIRED TARGET LIST
Same as in `workflow-read-audit.prompt.md`.

# WORKFLOW
1) Inventory existing files.
2) Build/update `artifacts/repo_facts.json`.
3) Create missing docs maps.
4) Create missing agents.
5) Create missing prompts.
6) Update `docs/WORKFLOW_AUDIT_REPORT.md` with what was created and remaining gaps.

# FINAL RESPONSE
List newly created files and how to use them.
