# BDD Gap Analysis and Task List

## Current State Summary

The BDD feature files describe a logged-in task product with Inbox, Today, Upcoming, Someday, Archive, daily planning, reflection, and loop-breaker behavior.

The current shipped app does not expose that product flow yet:

- The router only serves the stealth landing page and redirects everything else back to `/`.
- The task model only supports `title`, `completed`, `important`, `dueDate`, `notes`, `listId`, and `createdAt`.
- The task UI is a simple local-store list with quick add, complete, and important toggle.
- There is no plan engine, reflection flow, loop-breaker flow, or BDD test runner in the repo scripts.

## Evidence in Code

- BDD scope is defined in:
  - `document/features/capture.feature`
  - `document/features/organize.feature`
  - `document/features/plan.feature`
  - `document/features/reflect.feature`
  - `document/features/loop_breaker.feature`
- App routing is currently limited to landing only:
  - `apps/web/src/router/index.ts`
- Current task data model is too small for the BDD scenarios:
  - `apps/web/src/modules/tasks/stores/todoStore.ts`
  - `apps/api/src/types.ts`
- Current task UI supports only title-based add and basic list rendering:
  - `apps/web/src/modules/tasks/components/TodoList.vue`
- Repository scripts do not include BDD or test automation:
  - `package.json`
  - `apps/web/package.json`
  - `apps/api/package.json`

## Gap Map

### 1. Capture

BDD expects:

- Quick add into Inbox from Inbox or Today
- Estimate capture
- Energy capture
- Due date capture
- External source link capture and source type detection
- Offline local save and sync-on-reconnect

Current implementation:

- Only quick add with title exists
- New todos are stored only in a local Pinia store
- No Inbox or Today route is available
- No estimate, energy, source link, source type, or offline sync support exists

### 2. Organize

BDD expects:

- Inbox, Today, Upcoming list views
- Search by title and notes
- Filter by energy
- Filter by estimate
- Upcoming sorted by due date

Current implementation:

- Lists are `default`, `important`, and `planned`
- No search UI or search logic exists for tasks
- No energy field exists, so no energy filter is possible
- No estimate field exists, so no estimate filter is possible
- Planned view is based only on `dueDate`, not an Upcoming workflow

### 3. Plan

BDD expects:

- Generate Daily Plan action
- Recommended 5 and Optional 3 buckets
- Capacity-aware selection
- Explainable recommendations
- Pin and recalculate behavior
- Capacity warning for soft limit overruns
- Deferral to Someday

Current implementation:

- No plan UI
- No planning service or ranking algorithm
- No capacity model
- No recommendation reasons
- No Someday list

### 4. Reflect

BDD expects:

- End-of-day check-in flow
- Reflection answers persisted
- Weekly summary generation
- Completion trend, postponed-task summary, average completion/day
- Blocker aggregation

Current implementation:

- No reflection UI
- No reflection persistence model
- No weekly summary view or aggregation logic

### 5. Loop Breaker

BDD expects:

- Postponement tracking
- Stuck-task detection
- Intervention prompts
- Break-down-into-subtasks flow
- Archive/delete path
- Define-next-action path

Current implementation:

- No postpone history
- No parent/subtask model
- No archive list
- No intervention UI or logic

### 6. Acceptance Coverage

BDD expects:

- Feature files should map to executable acceptance checks

Current implementation:

- Feature files exist only as documents
- No cucumber, playwright, vitest, or equivalent test scripts are configured in package scripts

## Prioritized Issue List

## P0 Foundation

### Issue 1: Reconnect the app shell to real product routes

Problem:
The user cannot reach Inbox, Today, Upcoming, planning, or reflection flows because the router only exposes the stealth landing page.

Tasks:

- Add authenticated app routes for Inbox, Today, Upcoming, Plan, Reflect, and Archive/Someday if they remain in MVP scope.
- Decide whether landing stays at `/` and app moves under `/app`, or whether `/` becomes the task app after login.
- Wire the existing layout shell only after route ownership is clarified.

### Issue 2: Expand the task domain model to match BDD

Problem:
The current `Todo` shape cannot represent most BDD scenarios.

Tasks:

- Replace `default/important/planned` list semantics with product lists/statuses: Inbox, Today, Upcoming, Someday, Archive.
- Add fields for `estimateMinutes`, `energy`, `sourceLink`, `sourceType`, `plannedForDate`, `postponeCount`, `archivedAt`, `parentTaskId`, and planning metadata.
- Define which fields are required at create time vs optional enrichment.
- Update API types, persistence, and web store together.

### Issue 3: Move tasks from local-only state to persistent API-backed state

Problem:
BDD assumes the app can preserve tasks and support later planning/reflection logic. The current task flow is in-memory only.

Tasks:

- Introduce task fetch/create/update/delete through the API.
- Persist task data in the database instead of process memory.
- Add optimistic UI or loading/error states as needed.

### Issue 4: Add executable acceptance coverage for the documented BDD

Problem:
The feature files are not currently verified by automated tests.

Tasks:

- Choose acceptance tooling: Playwright-only, Cucumber+Playwright, or another lightweight option.
- Turn each documented feature area into executable acceptance scenarios.
- Add CI scripts for app-level acceptance coverage.

## P1 Core MVP Gaps

### Issue 5: Implement Inbox quick capture flow

Problem:
Only title entry exists, and it is not routed to an Inbox product flow.

Tasks:

- Build Inbox view and quick-add entry point.
- Ensure enter-to-save creates an Inbox task and records creation time.
- Support capture from Today as required by the feature.

### Issue 6: Implement enriched task capture

Problem:
Estimate, energy, due date, and external source capture are all missing.

Tasks:

- Add task create/edit form support for estimate and energy.
- Add due date parsing and storage.
- Add external link input and source type detection.
- Ensure due-dated tasks appear in Upcoming.

### Issue 7: Implement offline capture and deferred sync

Problem:
Offline capture is explicitly in BDD and not represented anywhere in the current architecture.

Tasks:

- Add local queue/storage for task creation while offline.
- Detect reconnect and replay pending mutations.
- Define conflict handling and duplicate protection.

### Issue 8: Build task organization views

Problem:
Inbox, Today, and Upcoming behaviors do not exist in the routed app.

Tasks:

- Implement list pages and navigation for Inbox, Today, Upcoming.
- Apply correct filtering semantics for each list.
- Sort Upcoming by due date ascending.

### Issue 9: Add task search and filters

Problem:
Search, energy filtering, and estimate filtering are missing.

Tasks:

- Add task search across title and notes.
- Add energy filter once the task model supports it.
- Add estimate filter for quick-win tasks.
- Define whether filters combine with list views and search.

## P2 Planning and Behavioral Intelligence

### Issue 10: Build the daily plan engine

Problem:
The core differentiator in the BDD set is absent.

Tasks:

- Add "Generate Daily Plan" action.
- Produce Recommended 5 and Optional 3 outputs.
- Respect daily capacity limits.
- Attach explanation labels/reasons to recommendations.

### Issue 11: Support plan overrides and capacity warnings

Problem:
Pinning, recalculation, and soft-limit warnings are not implemented.

Tasks:

- Allow pinning/moving tasks between recommended and optional buckets.
- Recalculate around pinned items.
- Show over-capacity warnings without blocking the user.

### Issue 12: Support deferral to Someday and plan refill

Problem:
Someday is referenced by BDD but does not exist in the data model or UI.

Tasks:

- Add Someday list/status.
- Let users defer planned tasks into Someday.
- Refill plan slots from backlog when capacity allows.

### Issue 13: Implement reflection capture

Problem:
End-of-day reflection is fully absent.

Tasks:

- Add End of Day entry point.
- Capture blocker choice and plan realism answer.
- Support skip without saving.
- Persist responses for weekly rollup.

### Issue 14: Implement weekly summary

Problem:
No weekly analytics exist for the BDD reflection scenarios.

Tasks:

- Add weekly summary availability rules.
- Compute completion trend, most postponed tasks, and average completed/day.
- Aggregate blocker frequency and highlight top blocker.

### Issue 15: Implement loop-breaker detection and interventions

Problem:
The procrastination/stuck-task flow is absent end to end.

Tasks:

- Track postponements.
- Detect stuck tasks during plan generation.
- Add intervention modal/flow.
- Support three outcomes: break into subtasks, archive/delete, define next action.

## Suggested Delivery Order

1. P0 foundation issues 1 through 4
2. P1 capture and organization issues 5 through 9
3. P2 planning issues 10 through 12
4. P2 reflection and loop-breaker issues 13 through 15

## Recommendation

Do not start with the plan engine first.

The current blocker is structural: the routed app, task model, and persistence layer do not yet support the task lifecycle assumed by the BDD scenarios. The fastest path is to first establish the real task app shell, canonical task schema, and API persistence, then layer capture and organization, and only then add planning, reflection, and loop-breaker logic on top.
