# Product Requirements Document (PRD) — Focus OS (Working Title)
**Tagline:** A task system that protects focus and reduces overwhelm.

## Document Control
- **Version:** v0.3 (Research-Validated)
- **Owner:** Product
- **Stakeholders:** Design, Engineering, QA, Data/ML, Security/Privacy
- **Last Updated:** 28 February 2026
- **Supporting Docs:** [Market Research ODCS](./market-research.md)

---

## 1. Problem Statement
Most to-do apps help users **store** tasks but not **execute** them sustainably. Users accumulate large backlogs, overplan their day, and lose trust in the system.

> **Market validation (Feb 2026):** This thesis is independently confirmed by multiple funded competitors (Motion: 1M+ users; Sunsama: NYT Wirecutter "Best Scheduling Tool"; Akiflow: YC-backed) and HBR research (Markovitz: *"Stop making to-do lists. They're setting you up for failure."*). See [Market Research ODCS](./market-research.md) §3.

Existing apps lack:
- **Cognitive load management** (what to hide/limit) — workers are interrupted every 3 min, need 23 min to refocus (UC Irvine)
- **Context awareness** (time, calendar density) — 11.3 hrs/week in meetings, 50% considered wasted
- **Behavioral intelligence** (postpone loops, avoidance patterns) — **least addressed gap; our primary differentiator**
- **Energy-based planning** (deep vs light work) — burnout at 66% all-time high (Modern Health, 2025); no app fully productizes energy matching
- **Actionable reflection** (why tasks slip, not just that they slip) — partial implementations exist (Sunsama shutdown ritual) but none diagnose *why*

**Supporting data:**
- 80% of employees experience productivity anxiety (Yomly, 2025)
- Average worker productive only 2h 23min/day — 31% of workday (Voucher Cloud/BLS)
- 70% of employees feel distracted at work (Zippia, 2026)
- Only 21% of global employees are engaged — lowest in a decade (Gallup, 2025)

**Goal:** Build a to-do product that converts a messy backlog into a realistic daily plan, increases completion reliability, and reduces overwhelm.

---

## 2. Target Users & Personas
### P1: Overwhelmed Professional (Primary)
- Many responsibilities + meetings
- Needs a *small, realistic daily set*
- Wants the system to recommend priorities, but with control
- **Market data:** 66% burnout rate (all-time high); 11.3 hrs/week in meetings; interrupted every 3 min; only 2h 23min productive/day

### P2: Student / Knowledge Worker (Secondary)
- Mix of study + assignments + life tasks
- Benefits from energy planning and task breakdown
- **Market data:** 30% of Gen Z face productivity anxiety *daily*; 58% several times/week (Yomly, 2025)

### P3: Executive Dysfunction / ADHD (Expansion Persona)
- Struggles to start tasks
- Needs friction reduction (micro-steps, nudges)
- Supported by design, but MVP is not specialized
- **Market data:** Amazing Marvin's 4.8-star App Store rating is largely driven by this cohort, validating demand

---

## 3. Value Proposition
A task system that:
1) **Detects and breaks avoidance loops** — the only product that diagnoses *why* tasks get stuck and intervenes (no competitor offers this full loop)
2) **Explains every recommendation** — per-task reasoning ("why this task?") rather than opaque AI (validated: AI explainability scrutiny is a -0.7% market restraint per Mordor Intelligence 2026)
3) **Recommends a realistic daily set** ("Today's 5" + "Optional 3") with soft capacity warnings
4) **Learns from behavior** and improves daily planning over time
5) Supports **time + energy** based selection (optional in MVP)

> **Positioning note:** Behavioral intelligence (#1) and explainable AI (#2) are our primary moat. Competitors cover #3–#5 partially. See [Market Research ODCS](./market-research.md) §4.2.

---

## 4. Goals, Non-Goals, Success Metrics
### Goals (MVP)
- Fast capture, reliable organization, simple execution
- AI-assisted **Daily Plan** users trust
- Lightweight reflection that improves future plans

### Non-Goals (MVP)
- Full project management suite (Gantt, complex dependencies)
- Heavy team collaboration (v2)
- Automation marketplace (Zapier-like) (v2)

### Success Metrics (MVP)
**Activation**
- ≥ 60% create ≥ 10 tasks in first 7 days
- ≥ 40% generate Daily Plan ≥ 3 times in first week

**Engagement**
- Daily Plan usage: avg ≥ 4 days/week (active users)
- Completion rate improvement: +15% after 4 weeks (vs baseline)

**Retention**
- Week-4 retention ≥ 25% (consumer) / ≥ 40% (teams pilot)

**Quality/Trust**
- Plan usefulness rating ≥ 4.2/5
- Recommendation override rate target ≤ 35% after learning period

---

## 5. Key User Journeys
### Journey A: Capture → Plan → Execute
1. Capture tasks quickly
2. Optional metadata (estimate, due date, energy)
3. Tap **Generate Daily Plan**
4. App proposes “Today’s 5” + “Optional 3”
5. Complete tasks; system learns from outcomes

### Journey B: Overwhelm Recovery
1. User has large backlog (e.g., 100+ tasks)
2. App detects overload and suggests:
   - Move low value items to **Someday**
   - Archive stale tasks
   - Split oversized tasks
3. Reduce to manageable active set

### Journey C: Postponement Loop Breaker
1. Task postponed repeatedly
2. App prompts: “Why is this stuck?”
   - Too big → split
   - Unclear → define next action
   - Low value → archive / someday
3. Plan adjusts automatically going forward

---

## 6. Core Features & Requirements

### 6.1 Task Capture (MVP)
**Requirements**
- Create task with:
  - Title (required)
  - Notes (optional)
  - Due date/time (optional)
  - Estimate minutes (optional: 5/15/30/60/120)
  - Energy (optional: low/medium/high)
  - Tags (optional)
  - Source link (optional; used by integrations)

**Acceptance Criteria**
- Task created in ≤ 2 seconds (mobile target)
- Offline creation supported; sync when online

---

### 6.2 Organization
**Requirements**
- Lists: Inbox, Today, Upcoming, Someday, Archive
- Tags + simple filters
- Search

**Acceptance Criteria**
- Filter by due date, tag, estimate, energy
- Search returns tasks by title and notes

---

### 6.3 Daily Plan Engine (Core Differentiator)
**Concept**
Select tasks for today based on:
- Due urgency
- Estimate vs available time (user-configured)
- Historical completion capacity (rolling window)
- Energy match (if provided)
- Avoidance signals (postponed frequently)
- User preferences (max tasks/minutes/day)

**Requirements**
- Action: **Generate Daily Plan**
- Output buckets:
  - **Recommended 5** (primary — soft limit with capacity warning, not hard cap; see Risk §15.3)
  - **Optional 3** (secondary)
  - **Deferred** (with reasons)
- Explainability:
  - Every recommended task includes a short reason string

**User Controls**
- Pin tasks into Today’s 5
- Swap tasks
- Set:
  - Max tasks/day
  - Max minutes/day
  - Work hours

**Acceptance Criteria**
- Plan generation < 2s
- Every suggested task shows “why”
- Overrides preserved on regenerate

---

### 6.4 Reflection (MVP)
**Requirements**
- End-of-day check-in (optional):
  - “What blocked you today?” (single-choice + optional note)
  - “Was Today’s 5 realistic?” (yes/no)
- Weekly summary:
  - Completion trend
  - Most postponed tasks
  - Avg completed tasks/day

**Acceptance Criteria**
- Reflection is skippable
- Weekly summary auto-generated

---

### 6.5 Notifications (MVP)
**Requirements**
- Daily reminder: “Generate your plan”
- Due today reminders (configurable times)

**Acceptance Criteria**
- User controls notification schedule and can disable any type

---

## 7. Integrations & Workflows (MCP)

### 7.1 Overview
Provide an option to connect external tools via **MCP** to:
- Automatically create tasks from external events
- Create simple, user-defined workflows (rules)

**Guiding Principle**
Integrations should feed the **Daily Plan Engine** and improve capture, not turn the product into a full automation marketplace in MVP.

---

### 7.2 Integrations (MCP Connectors)

#### User Value
- Tasks are created automatically from the tools users already work in (email, chat, tickets, calendar).

#### MVP Requirements (Inbound Only)
- Integration directory (connect / disconnect)
- OAuth connect flow per provider
- Provider event ingestion (polling or webhook depending on provider)
- Map external items → Focus OS Tasks
- Attach **Source metadata** to created tasks:
  - Provider name
  - External object id
  - Deep link URL
  - Title / snippet
- **Deduplication**:
  - Prevent duplicate task creation for the same external object

#### Acceptance Criteria
- User can connect at least one provider
- External items create tasks within defined interval (e.g., ≤ 5 minutes polling)
- Created tasks include a working source link
- Duplicate imports do not create duplicate tasks

---

### 7.3 Workflows (Rules Engine)

#### User Value
- User defines rules like:
  - Trigger: “New GitHub issue assigned to me”
  - Condition: “label contains bug”
  - Action: “Create task; due date +2 days; tag dev; estimate 60; energy high”

#### MVP Requirements (Simple Rules)
- Rule builder UI:
  - Trigger (provider event)
  - Conditions (basic filters)
  - Action templates (Create Task only)
- Dry-run/test rule
- Audit log per rule run:
  - timestamp, event id, result, created task id

#### Guardrails (MVP)
- **Read external + Create tasks only**
- No destructive external actions (e.g., close ticket, post message) in MVP
- User can disable a rule quickly (kill switch)

#### Acceptance Criteria
- User can create/edit/disable a workflow
- A triggered rule creates exactly one intended task (unless configured otherwise)
- Every run is visible in audit log
- Failures show actionable error messages

---

### 7.4 Recommended First Integrations (for MVP)
Pick **1–2** for MVP:
- Google Calendar / Outlook Calendar (meeting follow-ups)
- GitHub (assigned issues / PR review requests)
- Gmail / Outlook Email (flag/star → task)
- Slack / Teams (saved message → task)
- Jira (assigned tickets)

---

## 8. AI / Intelligence Requirements

### 8.1 Signals Collected
- TaskCreated timestamp
- TaskCompleted timestamp
- TaskPostponed count
- PlanGenerated + overrides (pinned/swapped)
- Estimate accuracy (estimated vs actual)

### 8.2 MVP Logic (Explainable)
- Rule-based scoring + lightweight learning:
  - Completion capacity = rolling avg last 14 days
  - Overload detection = backlog size + due density
  - Avoidance detection = postponed ≥ 3 times

### 8.3 Output Requirements
- Provide ranked tasks with explanation strings
- Never auto-delete; only suggest archive/move

---

## 9. Data Model (High-Level)

### 9.1 Core Entities
**Task**
- id, title, notes
- status: inbox | today | upcoming | someday | archive | done
- due_at, estimate_minutes, energy, tags[]
- created_at, updated_at, completed_at
- postpone_count
- source_id (nullable)

**DailyPlan**
- id, date
- tasks_primary[], tasks_optional[]
- user_overrides[]
- generated_at

**UserSettings**
- work_hours
- max_tasks_per_day
- max_minutes_per_day
- notification_prefs

### 9.2 Integrations & Workflows Entities
**IntegrationConnection**
- id, provider, status
- oauth_scopes
- token_ref (encrypted storage reference)
- created_at, updated_at

**ExternalSource**
- id, provider
- object_id (unique per provider)
- url
- title/snippet
- checksum/hash (optional)
- created_at

**WorkflowRule**
- id, name, enabled
- trigger (provider + event type)
- conditions (simple DSL / JSON)
- action_template (CreateTask payload template)
- created_at, updated_at

**WorkflowRunLog**
- id, rule_id, event_id
- status: success | failed | skipped
- created_task_id (nullable)
- error_message (nullable)
- created_at

---

## 10. Privacy & Security
**Principles**
- **Purposeful data collection** — behavioral signals (postpone counts, completion patterns, plan overrides) are collected explicitly to power the Daily Plan Engine and behavioral intelligence features. Users are informed at onboarding what is tracked and why.
- Transparent permissions and scopes
- Export + delete supported
- Local-first processing preferred (run scoring/ranking client-side where feasible)

> **Note:** The behavioral intelligence features require tracking beyond a typical to-do app. GDPR Art. 6(1)(a) consent and EU AI Act transparency requirements apply. See Risk §15.4.

**Requirements**
- Encrypt tokens at rest; rotate/revoke support
- Scope minimization per provider
- Behavioral data consent flow at onboarding (granular opt-in)
- Clear data inventory: what behavioral signals are collected and how they're used
- Audit log for workflows (when implemented in v2)
- Data export (JSON/CSV) v1
- Account deletion (hard delete + behavioral data purge) v1

---

## 11. Platforms
- **Web + responsive mobile** for MVP (simultaneous)
- Daily planning, quick capture, and energy check-ins are inherently mobile interactions
- All direct competitors (Motion, Sunsama, Akiflow) ship native mobile apps as core offerings
- Consider **PWA** as a pragmatic middle ground: web codebase, installable on mobile, offline-capable

> **Research note:** Web-only risks missing key decision moments — morning routine, between meetings, commute. See [Market Research ODCS](./market-research.md) §8 Risk 5.

---

## 12. MVP Scope

### Must-Have
- Task capture + lists
- Daily Plan engine + explainability + overrides
- **Postponement Loop Breaker** (behavioral intelligence — hero differentiator)
- Reflection + weekly summary
- Notifications
- PWA support (installable, offline-capable)

### Nice-to-Have
- Natural language parsing
- Calendar read-only integration via Zapier/Make
- Quick-add widgets
- **1–2 MCP integrations** (inbound task creation) — moved from Must-Have per research; no comparable startup launched with custom integrations

### Out of Scope (MVP)
- Custom workflow/rules engine (defer to v2; use Zapier/Make initially)
- Team workspaces and real-time collaboration
- Bi-directional sync (complete task → update external tool)
- Multi-step workflow chains, branching, advanced retries
- Public API / marketplace

> **Rationale:** Research shows no comparable startup (Sunsama, Marvin, Akiflow) launched with custom workflow engines — they all relied on Zapier initially. Redirecting engineering time to behavioral intelligence and explainable AI maximizes differentiation. See [Market Research ODCS](./market-research.md) §8 Risk 6.

---

## 13. Milestones & Release Plan
### Phase 0: Discovery (1–2 weeks)
- 10–15 user interviews
- Validate plan engine logic + workflow expectations
- UX prototype

### Phase 1: MVP Build (4–6 weeks)
- Task system + plan engine + **Postponement Loop Breaker**
- Reflection + notifications
- PWA setup (installable, offline-capable)
- Zapier/Make integration (replaces custom MCP for MVP)

### Phase 2: Beta Hardening (2–3 weeks)
- Performance, offline, sync
- Error handling for connectors
- QA automation + security review

### Phase 3: v1 Launch (2 weeks)
- Onboarding + pricing experiments
- Observability dashboards + analytics

---

## 14. Competitive Landscape

> Full competitive analysis with sources: [Market Research ODCS](./market-research.md) §4

| Competitor | Users | Differentiator | AI Explainability | Behavioral Intelligence | Pricing |
|---|---|---|---|---|---|
| **Motion** | 1M+ | Full AI auto-scheduling | Low (opaque) | None | ~$34/mo |
| **Sunsama** | Enterprise-ready | Calm daily planning, shutdown rituals | Medium | None (analytics only) | ~$20/mo |
| **Amazing Marvin** | 5K+ | 300+ settings, ADHD focus | N/A (no AI) | Partial (procrastination wizard) | ~$12/mo |
| **Akiflow** | 10K+ | Universal inbox, time-blocking | Low-Medium | None | Premium |
| **Todoist** | Millions | Simple tasks, recent AI features | Low | None | Freemium |
| **Focus OS** | — | Behavioral intelligence + explainable AI | **High** | **Full loop** | TBD |

**Strategic gap:** No competitor combines AI-assisted planning with per-task reasoning transparency AND proactive avoidance-loop detection. This is our moat.

---

## 15. Risks & Mitigations

> Full risk analysis with sources: [Market Research ODCS](./market-research.md) §8

### 15.1 Crowded Competitive Space (HIGH)
Motion (1M+ users, YC), Sunsama (NYT Wirecutter), Amazing Marvin already address 3 of 5 gaps.  
**Mitigation:** Lead positioning with behavioral intelligence + explainable AI — the two gaps no competitor covers.

### 15.2 Consumer Monetization Risk (MEDIUM-HIGH)
Large enterprises hold 54.6% of market revenue. Consumer apps face high churn.  
**Mitigation:** Freemium core + premium for behavioral intelligence features. Consider B2B2C (wellness benefit) in v2.

### 15.3 "Today's 5" Hard Limit May Frustrate (MEDIUM)
Users with 20+ daily obligations may bounce. Sunsama uses soft warnings, not hard limits.  
**Mitigation:** Change to "Recommended 5" with capacity warnings. Allow override with friction ("You're over capacity — are you sure?").

### 15.4 Privacy vs. Behavioral Intelligence Tension (MEDIUM)
Section 10 claims "minimal data collection" but behavioral features require extensive tracking. GDPR + EU AI Act add compliance overhead.  
**Mitigation:** Be explicit: behavioral data is collected with consent, processed locally where possible, and deletable. Update Section 10 language.

### 15.5 Web-Only Misses Core Use Cases (MEDIUM)
Daily planning and quick capture are mobile interactions. All competitors have mobile apps.  
**Mitigation:** Ship as PWA from day one. Evaluate native mobile for Phase 2.

### 15.6 Problem Is Not Purely Tool-Shaped (LOW-MEDIUM)
Burnout (66%), disengagement (79%) are systemic workplace problems. 70% of engagement depends on the manager.  
**Mitigation:** Frame Focus OS as *supporting* overwhelm recovery, not solving it. Manage expectations in marketing.

---

## 16. Pricing Strategy (Draft)

> Research context: See [Market Research ODCS](./market-research.md) §4.1 for competitor pricing

### Competitive Pricing Landscape
| Competitor | Model | Price |
|---|---|---|
| Motion | Premium only | ~$34/mo |
| Sunsama | Premium only | ~$20/mo |
| Amazing Marvin | Premium + lifetime | ~$12/mo or ~$300 lifetime |
| Todoist | Freemium | Free / $5/mo Pro |
| TickTick | Freemium | Free / $3/mo Premium |

### Proposed Model (TBD — validate in Phase 0)
- **Free tier:** Task capture, lists, basic daily plan (manual)
- **Pro tier (~$10–15/mo):** AI daily plan engine, explainability, behavioral intelligence, reflection + weekly summary
- **Lifetime option:** Consider for early adopters (Amazing Marvin validates this model)

### Open Pricing Questions
- Freemium vs. free trial → paid?
- Is behavioral intelligence a premium unlock or core to trust-building?
- B2B2C play: offer as employer wellness benefit?

---

## 17. Open Decisions
- ~~Web-first vs Mobile-first~~ → **PWA (web + installable mobile) recommended per research**
- Guest mode vs mandatory sign-in
- Local-first vs server-first sync
- ~~Which two integrations ship first~~ → **Defer to v2; use Zapier/Make for MVP**
- Whether "Energy" is required, optional, or v1-only → **Research supports optional (validated but partial competitor coverage)**
- Pricing model validation (see §16)
- Whether behavioral intelligence is free tier or premium-only
