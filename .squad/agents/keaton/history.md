# History: Keaton

## Learnings

### 2026-03-21: Technical Feasibility Analysis

**Context:** Analyzed market research and PRD to assess technical feasibility of Focus OS vision.

**Key Architecture Decisions:**
1. **Database Required:** In-memory storage insufficient for behavioral intelligence features. Recommended SQLite + Prisma for MVP, PostgreSQL for scale.
2. **Client-Side Scoring:** Daily Plan Engine should run client-side for <2s performance and offline support. Rule-based algorithm sufficient for MVP (defer ML).
3. **MCP Integration Scope Creep:** Custom integrations add 30-40 days with no competitive advantage. Recommended deferring to v2, using Zapier/Make for MVP.
4. **Privacy-First Architecture:** Behavioral tracking requires GDPR consent flow. Local-first processing where possible to minimize data exposure.
5. **Testing Infrastructure Critical:** No test runner/linter creates quality risk for complex features like sync conflict resolution.

**Technical Risks Identified:**
- 🔴 Critical: Offline sync conflict resolution (PWA requirement)
- 🔴 Critical: Tasks vs Activities domain model fragmentation
- ⚠️ Medium: Scoring weight tuning requires user feedback iteration
- ⚠️ Medium: iOS Safari PWA limitations (no background push)

**Key File Paths:**
- `/document/product/technical-feasibility-analysis.md` - Full technical assessment
- `/document/product/prd.md` - Product requirements
- `/document/product/market-research.md` - Competitive validation
- `/apps/web/src/modules/tasks/` - Legacy task system (migration hotspot)
- `/apps/web/src/modules/activities/` - Current work item system

**Patterns:**
- **Explainability Strategy:** Max 2 reasons per task recommendation (e.g., "Due today • Postponed 3 times") to balance transparency with simplicity
- **Optimistic UI:** For offline PWA, update local state immediately, queue sync events to IndexedDB, resolve conflicts on reconnect
- **Intervention Timing:** Postponement detection at 3rd defer, non-blocking modal with 4 resolution paths (split/clarify/defer/archive)

**User Preferences Discovered:**
- Repo uses Pinia Options API for stores (except tasks module which uses Composition API)
- Vue components prefer `<script setup>` with TypeScript
- No linter/formatter configured yet
- Frontend-first architecture with in-memory API backend

### 2026-03-21: Database Initialization
**Context:** Overseeing backend infrastructure setup for MVP.
**Actions:**
- Approved SQLite + Prisma architecture for Phase 0.
- Validated schema design for core entities (Task, DailyPlan, Reflection).
- Confirmed alignment with behavioral intelligence requirements (PostponeEvent).

### 2026-03-21: Decision Authored
- **Defer MCP Integrations to Phase 2**: Use Zapier/Make for MVP automation.
- **Add SQLite + Prisma in Phase 0**: Essential for behavioral intelligence persistence.
- **Clarify Tasks vs Activities Domain Model**: Recommended unifying into a single "Task" entity.
