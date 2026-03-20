## 1. Inventory workflow surface

- [x] 1.1 Identify the repo-owned custom workflow files that duplicate OpenSpec flows under `.github/`.
- [x] 1.2 Identify the OpenSpec `/opsx:*` files and supporting artifacts that must remain intact.

## 2. Remove redundant custom workflow artifacts

- [x] 2.1 Delete custom workflow agents, prompts, and related repo-owned workflow artifacts that exist only to support the parallel non-OpenSpec workflow path.
- [x] 2.2 Keep non-duplicative repo instructions only when they still provide coding guidance independent of the removed workflow kit.

## 3. Repair surviving guidance

- [x] 3.1 Update remaining `.github` guidance so it points contributors to OpenSpec `/opsx:*` commands instead of removed custom workflows.
- [x] 3.2 Remove or rewrite references to deleted workflow-supporting documents so surviving guidance stays internally consistent.

## 4. Validate repository state

- [x] 4.1 Verify the remaining workflow surface under `.github` and `openspec/` is coherent and contains no stale references to removed custom workflow entry points.
- [x] 4.2 Review the final diff to confirm the change only simplifies repository workflow customization and does not alter application runtime code.