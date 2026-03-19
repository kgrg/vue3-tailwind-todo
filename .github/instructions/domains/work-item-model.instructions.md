---
applyTo: "src/modules/**/*,src/pages/**/*.vue,src/router/**/*.ts"
---

# Work Item Domain Model Rules

Use these distinctions when evolving product behavior.

## Domain Boundaries

1. `activities` represent the main planned work items surfaced across the dashboard and list views.
2. `tasks` represent todo-style execution primitives and remain a migration-sensitive area because a legacy store still exists.
3. `habits` represent repeatable routines rather than one-off planned work.
4. `labels` provide metadata and classification. They should not become a second ownership model for planning logic.
5. `auth` owns session and access behavior, not general user profile or product preferences unless that work is explicitly introduced.

## Modeling Guidance

1. Do not duplicate planning logic across activities and tasks without first deciding which domain truly owns it.
2. Prefer enriching existing types over creating near-duplicate entities with overlapping names.
3. Route-level views may compose multiple domains, but feature modules should not quietly absorb each other’s responsibilities.
4. If behavior spans multiple domains, move the shared rule into `src/core/` or keep orchestration at the page or store boundary.