# Decision Record: Unified Task Model

**Date:** 2026-03-21
**Status:** Accepted
**Driver:** Keaton / Fenster

## Context
We need a domain model that handles both "Activities" (planned work) and "Tasks" (actionable items). Having two separate tables creates complexity in the planning engine and UI.

## Decision
We will use a single `Task` model to represent all work items.
- Differentiators (like duration, energy level) are optional fields on `Task`.
- `DailyPlan` will reference `Task` items.

## Consequences
- Simplifies the backend schema and frontend data fetching.
- Requires careful handling of "status" to cover both planning states and execution states.
- `PostponeEvent` is linked directly to `Task`.
