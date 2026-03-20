## Context

The repo contains two overlapping systems for guided work. OpenSpec already provides prompt flows and a CLI-backed artifact model for proposing, exploring, applying, and archiving changes. In parallel, the repo contains a custom workflow kit with repo-specific agents, prompts, and documentation that prescribe a separate planning and implementation path. The user wants the repo simplified so only the OpenSpec path remains.

This is a cross-cutting repository cleanup rather than an app feature. The primary constraint is avoiding partial removal that leaves broken references, ambiguous instructions, or dead customization entry points.

## Goals / Non-Goals

**Goals:**
- Make OpenSpec `/opsx:*` workflows the only supported guided workflow in the repo.
- Remove custom workflow files that are no longer needed once OpenSpec is the source of truth.
- Update surviving instructions to avoid references to deleted workflow files or deleted generated documentation.
- Keep the cleanup focused on workflow customization and repo guidance, not product code.

**Non-Goals:**
- Redesign OpenSpec itself or replace its generated prompt files.
- Change runtime application behavior in `apps/web` or `apps/api`.
- Introduce a new workflow system beyond OpenSpec.

## Decisions

### Remove repo-specific workflow overlays, keep OpenSpec entry points
The cleanup will target repo-owned planning and implementation workflows that duplicate OpenSpec behavior. OpenSpec files and prompts stay because they are the desired workflow surface.

Alternative considered: keep both systems and document one as preferred. Rejected because the user explicitly wants only OpenSpec workflows, and dual systems preserve the ambiguity.

### Treat broken references as part of the same cleanup
Deleting custom workflow files without fixing instruction references would leave a degraded authoring experience. References from surviving `.github` files to removed custom workflows or removed docs will be updated or removed in the same change.

Alternative considered: remove files only and defer reference cleanup. Rejected because the repo would immediately contain stale guidance.

### Scope cleanup around contributor workflow artifacts, not application architecture docs
This change focuses on files whose primary role is workflow orchestration and Copilot customization. Product or implementation docs are only updated when they directly control workflow guidance.

Alternative considered: perform a broader docs simplification. Rejected because it expands scope beyond the user request.

## Risks / Trade-offs

- [Risk] Contributors may still expect removed custom agents or prompts. → Mitigation: update remaining instructions to point explicitly at `/opsx:*` flows.
- [Risk] Some OpenSpec-adjacent files may implicitly depend on deleted custom docs. → Mitigation: search `.github` and repo metadata for references and clean them in the same change.
- [Risk] Over-aggressive deletion could remove useful non-workflow guidance. → Mitigation: review file purpose before deletion and keep changes focused on workflow customization.

## Migration Plan

1. Inventory custom workflow files and the surviving OpenSpec workflow files.
2. Delete repo-specific workflow customization files that duplicate OpenSpec.
3. Update remaining instructions and prompts so they reference only the OpenSpec workflow path.
4. Validate that the remaining `.github` content is internally consistent and that `/opsx:*` artifacts still have the expected files.

Rollback is straightforward because the change is file-based. Restoring deleted workflow files from version control reverts the repository to the prior dual-system state.

## Open Questions

- Whether any repo-specific agent should be retained because it serves a purpose outside workflow orchestration.
- Whether the custom `.github/instructions/` files should remain as coding guidance even if the custom workflow agents and prompts are removed.