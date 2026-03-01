---
name: Prepare Release
description: Generate release notes and verify build readiness for the TaskFlow app.
---

# Prepare Release

Use the **release agent** (`.github/agents/release.agent.md`) mindset to prepare a release.

## Required Input

The user should provide:
- The target version number (e.g., `1.0.0`).
- Optionally, a summary of changes since the last release.

## Steps

1. **Read context:**
   - `artifacts/repo_facts.json` — verified commands and risks.
   - `docs/WORKFLOW_AUDIT_REPORT.md` — known gaps.
   - `docs/BUILD_MATRIX.md` — build configuration.
   - `package.json` — current version (`0.0.0`).

2. **Verify build readiness:**
   - Confirm `pnpm build` is the correct build command (evidence: `package.json`).
   - List any High severity gaps from the audit report.
   - Note absence of test suite and linter.

3. **Generate release notes:**
   - What's New (features).
   - Bug Fixes.
   - Breaking Changes (with migration steps).
   - Known Issues (from audit report).
   - Build Verification checklist.

4. **Document migration steps** if applicable:
   - Dependency changes.
   - Config changes.
   - Breaking API changes.

5. **Recommend version bump:**
   - `package.json` version update.
   - Tag format recommendation.

## Output

A complete release notes document in markdown format.

## Known Limitations

- No CI/CD pipeline to automate releases.
- No automated tests to verify regression safety.
- No changelog tooling (e.g., conventional-changelog) installed.
