# Technical Feasibility Analysis — Focus OS
**Document Type:** Technical Architecture Assessment  
**Version:** v1.0  
**Date:** 21 March 2026  
**Owner:** Keaton (Technical Lead)  
**Stakeholders:** Kobayashi (Product), McManus (Frontend), Fenster (Backend), Baer (Security)  
**Supporting Docs:** [PRD](./prd.md), [Market Research](./market-research.md)

---

## Executive Summary

The Focus OS PRD proposes a behaviorally intelligent task management system that detects avoidance patterns, explains AI recommendations, and helps users execute realistic daily plans. This analysis evaluates the technical feasibility of the vision against our current architecture and identifies critical risks.

**Overall Assessment: FEASIBLE with MODERATE COMPLEXITY**

The core vision is technically achievable within our Vue 3 + Pinia + TypeScript stack. However, several features require architectural decisions that will significantly impact MVP scope and timeline.

**Key Findings:**
- ✅ **Low Complexity:** Task capture, organization, PWA, basic notifications
- ⚠️ **Medium Complexity:** Daily Plan engine, explainability, reflection system
- 🔴 **High Complexity:** Behavioral intelligence (postponement detection), MCP integrations, offline-first sync
- 🚨 **Critical Risks:** No test infrastructure, sync complexity, AI transparency vs. simplicity trade-off

---

## 1. Current Architecture Baseline

### 1.1 Technology Stack
```
Frontend (apps/web):
- Vue 3.4 (Composition API + Options API hybrid)
- Pinia 2.1 (state management)
- Vue Router 4.5
- Tailwind CSS 4.1
- TypeScript
- Vite 5

Backend (apps/api):
- Express 5.1 (TypeScript)
- In-memory data store (no database)
- Node 22.18+

Tooling:
- pnpm workspace
- No test runner configured
- No linter configured
- No CI/CD pipeline
```

### 1.2 Existing Modules
```
apps/web/src/
├── modules/
│   ├── activities/     (main work items)
│   ├── tasks/         (legacy todo system - migration hotspot)
│   ├── habits/        (repeatable routines)
│   ├── labels/        (metadata/tags)
│   └── auth/          (session management)
├── pages/             (route-level views)
├── layouts/           (app shells)
└── core/              (shared primitives)
```

### 1.3 Critical Constraint: No Database
The API layer currently uses **in-memory storage**. This fundamentally limits:
- Data persistence across server restarts
- Multi-user support
- Complex queries needed for behavioral analysis
- Audit logging for integrations

**Recommendation:** The PRD's behavioral intelligence features require persistent storage. Plan database integration (SQLite/PostgreSQL) as Phase 0 infrastructure work.

---

## 2. Feature-by-Feature Feasibility Analysis

### 2.1 Task Capture (PRD §6.1)
**Complexity: LOW**  
**Status: ✅ Existing primitives available**

The `activities` and `tasks` modules already provide task capture. Required additions:
- Energy field (low/medium/high)
- Estimate minutes (5/15/30/60/120)
- Source link for integrations

**Technical Notes:**
- Existing Pinia stores can extend with new fields
- TypeScript types need updates
- Form validation in Vue components
- Offline capture: LocalStorage queue → sync on reconnect

**Estimated Effort:** 3-5 days  
**Risks:** Low. Straightforward CRUD extension.

---

### 2.2 Organization (PRD §6.2)
**Complexity: LOW**  
**Status: ✅ Mostly implemented**

Lists (Inbox, Today, Upcoming, Someday, Archive) and tags already exist. Needs:
- Filter UI components
- Search implementation (client-side for MVP)

**Technical Notes:**
- Vue computed properties for filtering
- Fuse.js or native string matching for search
- No backend query optimization needed for MVP scale (<1000 tasks/user)

**Estimated Effort:** 2-3 days  
**Risks:** Low.

---

### 2.3 Daily Plan Engine (PRD §6.3)
**Complexity: MEDIUM-HIGH**  
**Status: 🔴 Net new system**

This is the **core differentiator**. Requirements:
1. Score/rank tasks based on multi-factor algorithm
2. Generate "Recommended 5" + "Optional 3" buckets
3. Provide explanation string per task
4. Preserve user overrides (pins/swaps)
5. Respect capacity constraints

**Technical Architecture:**

```typescript
// Planning Engine (client-side for MVP)
interface PlanningContext {
  tasks: Task[]
  userSettings: UserSettings
  historicalData: CompletionHistory
  calendarDensity?: CalendarEvent[]  // v2
}

interface ScoredTask {
  task: Task
  score: number
  reasoning: ReasoningChain
}

interface ReasoningChain {
  factors: ReasoningFactor[]
  primaryReason: string  // "Due today" | "Often postponed" | etc.
}

class DailyPlanEngine {
  score(task: Task, context: PlanningContext): ScoredTask
  explainScore(scoredTask: ScoredTask): string
  generatePlan(context: PlanningContext): DailyPlan
}
```

**Scoring Factors (Rule-Based MVP):**
1. **Due urgency** (0-40 points)
   - Due today: +40
   - Due tomorrow: +30
   - Due this week: +20
   - Overdue: +50 (penalize abandonment)
   
2. **Capacity fit** (0-20 points)
   - Task estimate ≤ available time: +20
   - Estimate > available: penalty
   
3. **Avoidance signal** (0-30 points)
   - Postponed ≥3 times: +30 (force confrontation)
   - Never postponed: +0
   
4. **Energy match** (0-10 points)
   - If user has energy prefs + task has energy tag
   - Match current time of day → energy level
   
5. **User preferences** (modifiers)
   - Pinned tasks: force into top 5
   - Max tasks/day: hard cap or soft warning (configurable)

**Explainability Strategy:**
```typescript
function explainTask(task: ScoredTask): string {
  const reasons = []
  if (task.dueToday) reasons.push("Due today")
  if (task.postponeCount >= 3) reasons.push("Postponed 3+ times")
  if (task.estimateFitsCapacity) reasons.push("Fits your schedule")
  
  return reasons.slice(0, 2).join(" • ")  // Max 2 reasons for clarity
}
```

**Performance Target:** < 2 seconds  
- For 500 tasks: ~1ms per task scoring = 500ms
- Sorting: O(n log n) ≈ 4.5ms
- Plenty of headroom for MVP

**Estimated Effort:** 10-15 days  
**Risks:**
- ⚠️ Scoring weights require tuning based on user feedback (no ML yet)
- ⚠️ Explainability vs. accuracy trade-off (simple rules = transparent but crude)
- ⚠️ User override persistence needs careful state management

---

### 2.4 Behavioral Intelligence — Postponement Loop Breaker (PRD §5.C)
**Complexity: MEDIUM-HIGH**  
**Status: 🔴 Requires new data model + UI flows**

This is Focus OS's **primary differentiator** over competitors. No other tool does this well.

**Requirements:**
1. Track postpone count per task
2. Detect threshold (≥3 postpones)
3. Trigger intervention prompt
4. Guide user to resolution (split/clarify/archive)
5. Update Daily Plan recommendations based on outcomes

**Technical Architecture:**

```typescript
interface PostponeEvent {
  taskId: string
  timestamp: Date
  fromDate: Date
  toDate: Date | null  // null = moved to Someday/Inbox
}

interface InterventionPrompt {
  taskId: string
  postponeCount: number
  suggestedActions: InterventionAction[]
}

type InterventionAction = 
  | { type: 'split', reason: 'Task too big' }
  | { type: 'clarify', reason: 'Next action unclear' }
  | { type: 'defer', reason: 'Not actually urgent' }
  | { type: 'archive', reason: 'No longer relevant' }
```

**UI Flow:**
1. User postpones task → increment counter (silent)
2. On 3rd postpone → show modal:
   ```
   "You've postponed '[Task Title]' 3 times. Let's figure out why."
   
   Options:
   [ ] This task is too big → Break it down
   [ ] I don't know where to start → Define next action
   [ ] This isn't actually urgent → Move to Someday
   [ ] This is no longer relevant → Archive
   ```
3. Collect user choice → update task metadata
4. Future plan generations penalize repeatedly-postponed tasks (force confrontation)

**Data Model Changes:**
```typescript
interface Task {
  // ... existing fields
  postponeCount: number
  lastPostponedAt: Date | null
  interventionsTaken: Intervention[]
}

interface Intervention {
  timestamp: Date
  action: InterventionAction
  userNote?: string
}
```

**Estimated Effort:** 8-12 days  
**Risks:**
- ⚠️ Intervention prompt timing: too aggressive → annoying, too passive → ineffective
- ⚠️ User may ignore prompts → need non-blocking design
- ⚠️ Requires A/B testing to validate threshold (3 vs 5 postpones)

---

### 2.5 Reflection System (PRD §6.4)
**Complexity: MEDIUM**  
**Status: 🟡 Requires new UI + analytics**

**Requirements:**
1. End-of-day check-in (optional)
2. Weekly summary auto-generation
3. Store reflection data for future plan improvements

**Technical Architecture:**

```typescript
interface DailyReflection {
  date: Date
  wasRealistic: boolean
  blockerCategory?: 'meetings' | 'interruptions' | 'low-energy' | 'misjudged-time' | 'other'
  note?: string
}

interface WeeklySummary {
  weekStart: Date
  completionRate: number
  avgTasksPerDay: number
  mostPostponedTasks: Task[]
  blockerFrequency: Record<string, number>
}
```

**Analytics Queries:**
- Completion trend: group by week, count completed tasks
- Most postponed: sort by postponeCount DESC, limit 5
- Blocker patterns: aggregate reflection.blockerCategory

**Estimated Effort:** 6-8 days  
**Risks:**
- ⚠️ Users may skip reflections → need lightweight UX
- ⚠️ In-memory API can't efficiently aggregate historical data → database required

---

### 2.6 PWA Support (PRD §11)
**Complexity: MEDIUM**  
**Status: 🟡 Requires service worker + manifest**

**Requirements:**
1. Installable on mobile/desktop
2. Offline-capable
3. Background sync when online

**Technical Architecture:**

```typescript
// Service Worker Strategy
- Cache-first for static assets (JS/CSS/images)
- Network-first for API calls with fallback to IndexedDB
- Background sync queue for offline mutations

// Manifest (manifest.json)
{
  "name": "Focus OS",
  "short_name": "Focus OS",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#your-brand-color",
  "icons": [...]
}
```

**Offline Strategy:**
1. User creates task offline → save to IndexedDB queue
2. Service worker detects network → POST queued tasks
3. Merge server response with local state

**Tools:**
- Vite PWA plugin (already compatible with our stack)
- Workbox for service worker patterns
- IndexedDB via idb library

**Estimated Effort:** 8-12 days  
**Risks:**
- 🔴 **Sync conflicts:** User edits task offline, server state changes → requires conflict resolution strategy
- ⚠️ iOS Safari limitations: limited storage quota, no background sync
- ⚠️ Testing complexity: requires real devices + network throttling

---

### 2.7 Notifications (PRD §6.5)
**Complexity: LOW-MEDIUM**  
**Status: 🟡 Requires Push API + permissions**

**Requirements:**
1. Daily reminder: "Generate your plan"
2. Due date reminders
3. User-configurable schedule

**Technical Architecture:**

```typescript
// Web Push Notifications (PWA)
- Request permission on first use
- Store subscription in backend
- Use Web Push protocol (VAPID keys)
- Fallback to in-app notifications if permission denied

// Scheduling
- Server-side cron job checks due dates
- Sends push to subscribed devices
- Client displays notification
```

**Estimated Effort:** 5-7 days  
**Risks:**
- ⚠️ Notification fatigue → must allow granular controls
- ⚠️ iOS Safari: no background push until app is opened
- ⚠️ Backend cron job needs persistent storage (can't use in-memory)

---

### 2.8 MCP Integrations & Workflows (PRD §7)
**Complexity: HIGH**  
**Status: 🔴 Significant scope creep**

**PRD Scope:**
- OAuth provider connections (Google, GitHub, Gmail, Slack, Jira)
- Event polling/webhooks
- Task creation from external events
- Workflow rules engine (trigger → condition → action)
- Deduplication logic
- Audit logging

**Technical Architecture:**

```typescript
// Integration Layer (Backend)
class IntegrationAdapter {
  authenticate(provider: Provider, user: User): Promise<Token>
  pollEvents(provider: Provider, since: Date): Promise<ExternalEvent[]>
  registerWebhook(provider: Provider, url: string): Promise<void>
}

// Workflow Engine
interface WorkflowRule {
  trigger: { provider: string, eventType: string }
  conditions: Condition[]
  action: ActionTemplate
}

class WorkflowEngine {
  evaluateRule(rule: WorkflowRule, event: ExternalEvent): boolean
  executeAction(action: ActionTemplate, event: ExternalEvent): Task
}
```

**Infrastructure Requirements:**
- Database for tokens, rules, audit logs
- Background worker for polling
- Webhook endpoint (public URL + security)
- OAuth callback handling
- Rate limiting per provider
- Error handling + retry logic

**Estimated Effort:** 30-40 days (1 integration = 5-7 days each)  
**Risks:**
- 🔴 **Massive scope expansion:** Each provider has different APIs, auth flows, rate limits
- 🔴 **Security surface:** Token storage, webhook validation, rate limiting
- 🔴 **Maintenance burden:** Provider API changes require updates
- 🔴 **Testing complexity:** Requires mock servers or real provider sandboxes

**CRITICAL RECOMMENDATION:**  
**Defer custom MCP integrations to v2.** Use Zapier/Make for MVP automation (validated by competitor research). This cuts 30-40 days from MVP timeline and lets us focus on core differentiators (behavioral intelligence + explainable AI).

If integrations are truly required for MVP, limit to **1 provider only** (e.g., Google Calendar read-only) and cut workflow rules engine entirely.

---

## 3. Architecture Decisions Required

### 3.1 Database Selection
**Decision Required: Pre-Phase 1**  
**Options:**

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **SQLite** | Zero-ops, file-based, perfect for MVP | Limited concurrency, no network access | ✅ **Best for MVP** |
| **PostgreSQL** | Production-grade, complex queries, scales well | Requires hosting, ops overhead | Phase 2+ |
| **Prisma ORM** | Type-safe queries, migrations, works with both | Learning curve | ✅ **Recommended layer** |

**Recommendation:** SQLite + Prisma for MVP. Migrate to PostgreSQL in Phase 2 when scaling needs are clearer.

**Migration Path:**
1. Design Prisma schema (Phase 0)
2. Migrate in-memory stores to SQLite (1 week)
3. Keep API surface unchanged (Pinia stores still work)

---

### 3.2 State Management: Client vs. Server
**Decision Required: Phase 1**  
**Options:**

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **Client-side scoring** | No latency, works offline, simple backend | Can't leverage server-side analytics | ✅ **MVP approach** |
| **Server-side scoring** | Centralized logic, easier A/B testing | Requires network, adds latency | Phase 2+ |
| **Hybrid** | Best of both (client caching + server truth) | Complex sync logic | Phase 3+ |

**Recommendation:** Client-side scoring for MVP. Ship the scoring algorithm as TypeScript in the frontend. Backend only stores tasks and historical events.

**Rationale:**
- Meets <2s performance target
- Works offline (PWA requirement)
- Simpler to iterate on scoring weights
- Can move to server later without API breaking changes

---

### 3.3 Offline Sync Strategy
**Decision Required: Phase 1**  
**Critical for PWA success**

**Recommended Pattern: Optimistic UI + Event Sourcing**

```typescript
// Client Mutation Flow
1. User creates task → immediately update local Pinia store
2. Queue mutation event to IndexedDB
3. Update UI (optimistic)
4. Background: POST to server
5. On success: mark event as synced
6. On conflict: show merge UI

// Conflict Resolution
- Last-write-wins for simple fields (title, notes)
- Union merge for arrays (tags)
- User prompt for complex conflicts (status changes)
```

**Alternatives Considered:**
- **CRDTs (Yjs, Automerge):** Too complex for MVP
- **Operational Transform:** Overkill for task data
- **Firebase/Supabase:** Vendor lock-in, learning curve

**Estimated Effort:** 10-15 days for conflict resolution logic  
**Risks:**
- 🔴 Edge cases are hard to test (requires network simulation)
- ⚠️ User may create duplicate tasks across devices before sync

---

### 3.4 AI/ML Integration Point
**Decision Required: Phase 2+**  
**Not blocking MVP (rule-based scoring sufficient)**

The PRD mentions "lightweight learning" but doesn't specify implementation. Options for future:

| Approach | Use Case | Complexity |
|----------|----------|------------|
| **Linear regression** | Predict task completion time | Low |
| **Logistic regression** | Predict task abandon risk | Low |
| **Time series (ARIMA)** | Forecast daily capacity | Medium |
| **LLM integration** | Natural language task parsing | High |

**Recommendation:** Defer ML to Phase 3+. Rule-based scoring is sufficient for MVP and maintains explainability (our key differentiator).

---

## 4. Security & Privacy Assessment

### 4.1 Data Collection vs. Privacy Claims (PRD §10)
**Risk Level: MEDIUM**  
**Status: ⚠️ Tension requires resolution**

The PRD claims "minimal data collection" but behavioral intelligence requires:
- Task creation/completion timestamps
- Postponement events (every time user defers)
- Plan generation history + user overrides
- Reflection responses
- Potentially: time-of-day patterns, energy levels

**GDPR/EU AI Act Implications:**
- This is **behavioral profiling** under GDPR Art. 4(4)
- Requires **explicit consent** (Art. 6(1)(a))
- EU AI Act transparency requirements apply (Art. 13)
- Right to deletion must purge behavioral data (Art. 17)

**Required Mitigations:**
1. **Explicit consent flow** at onboarding:
   ```
   "Focus OS learns from your behavior to improve daily plans.
   This includes tracking when you complete, postpone, or skip tasks.
   
   [✓] I consent to behavioral tracking for AI recommendations
   [ ] Basic task management only (no behavioral features)"
   ```

2. **Data inventory page** (Settings → Privacy):
   - Show what data is collected
   - Export as JSON/CSV
   - Delete all behavioral data (hard delete)

3. **Local-first processing** where possible:
   - Run scoring algorithm client-side
   - Only sync task events to server, not scores
   - Reduces attack surface

**Estimated Effort:** 5-7 days for consent flow + privacy UI  
**Risks:**
- ⚠️ Legal review required before launch (non-technical blocker)
- ⚠️ GDPR compliance is not optional for EU users

---

### 4.2 Integration Security (If MCP is kept in MVP)
**Risk Level: HIGH**  
**Status: 🔴 Requires security expert review**

OAuth token storage, webhook validation, and rate limiting are beyond current team expertise. Required mitigations:

1. **Token encryption at rest** (libsodium or equivalent)
2. **Webhook signature validation** (HMAC)
3. **Rate limiting per provider** (avoid API bans)
4. **Scope minimization** (request only needed permissions)
5. **Token rotation** on security events

**Recommendation:** Engage Baer (Security) before implementing integrations. Alternatively, defer to Zapier/Make (offloads OAuth complexity).

---

## 5. Testing & Quality Strategy

### 5.1 Critical Gap: No Test Infrastructure
**Risk Level: HIGH**  
**Status: 🔴 Must address before scaling features**

Current repo has:
- ❌ No test runner
- ❌ No linter
- ❌ No CI/CD
- ❌ No type checking in CI

**For MVP, this is manageable.** For post-MVP (behavioral intelligence debugging, sync conflict testing), this is a **critical risk**.

**Minimum Viable Testing (Phase 1):**
1. Add Vitest (natural fit for Vite/Vue)
2. Unit tests for Daily Plan Engine scoring
3. Integration tests for offline sync
4. E2E tests for critical flows (Playwright)

**Estimated Effort:** 8-10 days setup + ongoing test writing  
**Risks:**
- ⚠️ Team may lack testing discipline (cultural, not technical)
- ⚠️ Without tests, behavioral intelligence will be fragile

---

### 5.2 Observability Gap
**Risk Level: MEDIUM**  
**Status: ⚠️ Required for post-launch iteration**

The PRD mentions "observability dashboards" (§13 Phase 3) but doesn't specify what to track.

**Recommended MVP Metrics:**
1. **Activation:** % users creating 10+ tasks in first 7 days
2. **Engagement:** Daily Plan generation frequency
3. **Trust:** Plan override rate (target ≤35%)
4. **Completion:** Task completion rate improvement

**Technical Requirements:**
- Client-side analytics (PostHog, Mixpanel, or self-hosted Plausible)
- Event tracking in Vue components
- Privacy-compliant (no PII in events)

**Estimated Effort:** 3-5 days  
**Risks:**
- ⚠️ Easy to over-instrument → performance impact
- ⚠️ Must respect user consent (GDPR)

---

## 6. Risk Summary & Mitigation Roadmap

### 6.1 Critical Risks (Blockers)

| Risk | Severity | Impact | Mitigation | Timeline |
|------|----------|--------|------------|----------|
| **No database** | 🔴 Critical | Behavioral intelligence impossible with in-memory storage | Add SQLite + Prisma | Phase 0 (1 week) |
| **No test infrastructure** | 🔴 High | Feature regression, sync bugs undetected | Add Vitest + basic test suite | Phase 1 (1 week) |
| **MCP scope creep** | 🔴 Critical | 30-40 day timeline bloat for non-differentiator | Defer to v2, use Zapier | Decision required now |
| **Sync conflict strategy** | 🔴 High | PWA unusable if conflicts mishandled | Implement optimistic UI + merge logic | Phase 1 (2 weeks) |

---

### 6.2 Medium Risks (Manage Closely)

| Risk | Severity | Impact | Mitigation |
|------|----------|--------|------------|
| **Scoring weight tuning** | ⚠️ Medium | Plan recommendations feel wrong → user churn | Start with conservative weights, A/B test | Phase 2 |
| **Explainability vs. accuracy** | ⚠️ Medium | Simple rules = transparent but crude | Accept trade-off for MVP, iterate based on feedback | Ongoing |
| **iOS Safari PWA limits** | ⚠️ Medium | Degraded mobile experience on iOS | Set expectations, consider native app in Phase 3 | Phase 2+ |
| **Privacy compliance** | ⚠️ Medium | GDPR violations = legal risk | Consent flow + data inventory + legal review | Phase 1 |
| **Intervention prompt timing** | ⚠️ Medium | Too aggressive = annoying, too passive = ineffective | Configurable threshold, A/B test | Phase 2 |

---

### 6.3 Low Risks (Monitor)

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Performance (scoring <2s)** | Unlikely to be an issue for <10K tasks | Profile if needed |
| **User ignores reflections** | Make reflection skippable, non-blocking | Designed in |
| **Search performance** | Client-side search sufficient for MVP scale | Add backend search in Phase 2+ |

---

## 7. Recommended Scope Adjustments

Based on this analysis, I recommend the following changes to the PRD:

### 7.1 MUST-HAVE for MVP (Core Differentiators)
✅ Keep:
- Task capture + organization
- Daily Plan Engine with explainability
- **Postponement Loop Breaker** (hero feature)
- Reflection + weekly summary
- PWA support
- Basic notifications

### 7.2 MOVE TO PHASE 2 (De-risk Timeline)
🔄 Defer:
- **MCP integrations + workflow rules** (use Zapier/Make instead)
  - Saves 30-40 days
  - Validated by competitor research (no one launched with custom integrations)
  - Can add later once core loop is proven
- Calendar integration (nice-to-have per PRD §12)
- Natural language parsing

### 7.3 INFRASTRUCTURE WORK (Phase 0, Pre-MVP)
🛠️ Add:
- SQLite + Prisma setup (1 week)
- Basic test infrastructure (Vitest + Playwright) (1 week)
- Privacy consent flow design (1 week)

**Revised Timeline:**
- Phase 0: Infrastructure (3 weeks) ← **NEW**
- Phase 1: MVP Build (6-8 weeks) ← adjusted from PRD's 4-6 weeks
- Phase 2: Beta Hardening (2-3 weeks)
- Phase 3: v1 Launch (2 weeks)

**Total: 13-16 weeks** (vs. PRD's 8-11 weeks)

The 5-week increase accounts for:
- Database setup (not in PRD)
- Test infrastructure (not in PRD)
- Realistic scoring weight tuning time
- Sync conflict resolution complexity

---

## 8. Technical Debt Considerations

### 8.1 Existing Debt
The codebase has existing issues that may interfere with MVP:

1. **Legacy tasks module** (PRD §8 acknowledges)
   - Coexists with newer `activities` module
   - Migration path unclear
   - Risk of feature duplication

   **Recommendation:** Decide now: unify or deprecate? Don't build Daily Plan Engine on top of fragmented domain model.

2. **No linter/formatter**
   - Code style drift across team
   - Harder to onboard new devs

   **Recommendation:** Add ESLint + Prettier in Phase 0 (1 day setup).

3. **Hybrid Composition/Options API**
   - Some stores use Composition API, most use Options API
   - Cognitive load for new features

   **Recommendation:** Standardize on Options API for stores (matches Pinia docs), Composition API for components (matches Vue 3 best practices).

### 8.2 New Debt to Avoid
1. **Don't build scoring logic in Vue components**
   - Must be testable in isolation
   - Keep in `src/core/planning/` module

2. **Don't store tokens in localStorage**
   - Use HttpOnly cookies or encrypted IndexedDB
   - Consult Baer before implementing

3. **Don't build workflow engine without audit logs**
   - Required for debugging "why didn't my rule trigger?"
   - Another reason to defer MCP to v2

---

## 9. Performance Targets & Validation

### 9.1 PRD-Defined Targets
| Metric | Target | Feasibility |
|--------|--------|-------------|
| Task creation | ≤2 seconds | ✅ Easy (local-first) |
| Plan generation | <2 seconds | ✅ Achievable (see §2.3) |
| Offline sync | When network available | ⚠️ Medium (sync conflicts complex) |

### 9.2 Additional Targets (Recommended)
| Metric | Target | Rationale |
|--------|--------|-----------|
| App load time | <3 seconds | PWA must feel native |
| Offline operation | 100% CRUD | Users should never see "no internet" errors |
| Sync conflict rate | <1% of syncs | Measure quality of conflict resolution |

### 9.3 Validation Strategy
1. **Synthetic benchmarks** (Phase 1)
   - Generate 500 tasks, measure scoring time
   - Test IndexedDB read/write speed

2. **Real-world testing** (Phase 2)
   - Beta users in airplane mode (offline)
   - Network throttling (slow 3G)
   - Device testing (iOS Safari, Android Chrome, Desktop)

---

## 10. Open Questions for Product Team

1. **Database decision:** Can we commit to SQLite + Prisma in Phase 0? (Blocks behavioral intelligence)

2. **MCP integrations:** Agree to defer to v2 and use Zapier/Make? (Saves 30-40 days)

3. **Tasks vs. Activities unification:** Which domain model is the future? (Impacts Daily Plan Engine design)

4. **Privacy-first vs. feature-complete:** Are we willing to make behavioral tracking opt-in, knowing some users won't enable it? (GDPR compliance)

5. **iOS Safari limitations:** Acceptable for MVP, or do we need native app in Phase 2? (PWA on iOS has limited push notifications, background sync)

6. **Testing investment:** Will team commit to writing tests, or is this a Phase 2+ concern? (Impacts quality/velocity trade-off)

7. **AI transparency threshold:** How detailed should explanations be? "Due today" vs. "Due today (40 points) + Postponed 3 times (30 points) = 70/100 score"? (User research needed)

---

## 11. Recommendations to Kobayashi (Product)

### 11.1 High-Priority Decisions
1. ✅ **Approve database setup (Phase 0):** Non-negotiable for behavioral features
2. ✅ **Defer MCP to v2:** Use Zapier/Make for MVP (validated by competitor research)
3. ✅ **Clarify tasks vs. activities:** Unify before building Daily Plan Engine
4. ⚠️ **Revise timeline expectations:** 13-16 weeks (not 8-11 weeks) is realistic

### 11.2 User Research Needs (Phase 0)
Before finalizing Phase 1 scope, validate:
1. **Postponement intervention threshold:** 3 vs. 5 postpones?
2. **Explanation detail level:** Short phrase vs. detailed score breakdown?
3. **Reflection prompt timing:** End-of-day vs. morning retrospective?
4. **Privacy trade-off:** Would users opt out of behavioral tracking?

### 11.3 Next Steps
1. **Week 1:** Kobayashi reviews this doc + decides on scope adjustments
2. **Week 2:** Keaton + Fenster set up SQLite + Prisma (Phase 0)
3. **Week 2:** Keaton + McManus add ESLint + Vitest basics (Phase 0)
4. **Week 3:** Kobayashi conducts 10-15 user interviews (PRD §13 Phase 0)
5. **Week 4:** Kick off Phase 1 with finalized scope

---

## 12. Conclusion

The Focus OS vision is **technically feasible** but requires careful scope management. The core differentiators—behavioral intelligence and explainable AI—are achievable within our stack. However, the PRD underestimates infrastructure needs (database, testing) and overestimates MCP integration urgency.

**Key Takeaways:**
1. ✅ **Daily Plan Engine + Postponement Loop Breaker are strong differentiators** and technically sound
2. ⚠️ **MCP integrations are scope creep** — defer to v2 (saves 30-40 days)
3. 🔴 **Database is non-negotiable** — add in Phase 0
4. 🔴 **Privacy compliance requires explicit design** — not an afterthought
5. ⚠️ **Timeline must account for testing + conflict resolution** — 13-16 weeks realistic

With these adjustments, Focus OS can deliver a differentiated MVP that lives up to the "protects focus, reduces overwhelm" promise while avoiding the common trap of over-engineering integrations before validating the core value proposition.

---

**Status:** Awaiting Product approval on scope adjustments  
**Next Review:** After Phase 0 user interviews  
**Owner:** Keaton (Technical Lead)
