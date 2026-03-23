# Product Plan — Focus OS
**Document Type:** Product Backlog & Roadmap  
**Version:** v1.0  
**Date:** 28 February 2026  
**Owner:** Kobayashi (Product Owner)  
**Status:** Ready for Planning  
**Supporting Docs:** [PRD](./prd.md) | [Market Research ODCS](./market-research.md)

---

## Executive Summary

Based on comprehensive market research and PRD analysis, this plan defines the MVP scope and actionable backlog for Focus OS — a task system that protects focus and reduces overwhelm through **behavioral intelligence** and **explainable AI recommendations**.

**Key Strategic Decisions:**
1. **Hero Differentiators:** Behavioral intelligence (Postponement Loop Breaker) + explainable AI (per-task reasoning)
2. **MVP Scope Adjustment:** Defer custom MCP integrations/workflows to v2; use Zapier/Make initially
3. **Platform Strategy:** PWA (web + installable mobile) from day one, not web-only
4. **Capacity Model:** "Recommended 5" with soft warnings, not hard "Today's 5" limit
5. **Privacy Posture:** Explicit behavioral data consent with local-first processing where feasible

**Validated Assumptions:**
- Problem statement is strongly validated by competitor existence, HBR research, and burnout data
- Market opportunity exists ($1.44B, 13.1% CAGR)
- All three personas (Overwhelmed Professional, Student/Knowledge Worker, ADHD/Executive Dysfunction) are supported by data
- Behavioral intelligence gap is the least addressed by competitors — our primary moat

**Key Risks:**
- Crowded competitive space (Motion 1M+ users, Sunsama NYT-backed, Amazing Marvin 4.8⭐)
- Consumer monetization challenge (enterprises hold 54.6% of market revenue)
- Behavioral data collection creates privacy/compliance overhead (GDPR, EU AI Act)

---

## 1. MVP Scope Definition

### 1.1 Must-Have (Core Value Delivery)

| Feature | Validated? | Why MVP? | Risk if Excluded |
|---------|-----------|----------|------------------|
| **Task Capture + Lists** | ✅ Industry standard | Foundation for all workflows | Product unusable without it |
| **Daily Plan Engine** | ✅ 3 competitors validate concept | Core differentiator; converts backlog → realistic plan | No unique value prop |
| **Explainable Recommendations** | ✅ AI explainability is market restraint (-0.7%) | Addresses trust gap no competitor solves | Become "just another AI planner" |
| **Postponement Loop Breaker** | ✅ Marvin has partial; no one has full loop | **Hero differentiator**; diagnoses *why* tasks stuck | Loss of primary moat |
| **Reflection + Weekly Summary** | ✅ Sunsama validates daily ritual | Closes behavioral learning loop | Engine can't improve over time |
| **Notifications** | ✅ Standard in category | Critical for habit formation | Users forget to generate plans |
| **PWA Support** | ✅ Competitors all mobile; use case is mobile-first | Access at decision moments (morning, between meetings) | Miss 50%+ of usage contexts |

### 1.2 Nice-to-Have (Deferred to Post-MVP)

| Feature | Why Deferred | Research Evidence |
|---------|--------------|-------------------|
| **Natural Language Parsing** | Not validated as blocker; adds complexity | None of top 3 competitors highlight this |
| **Calendar Integration** | Can use Zapier/Make initially | Standard feature but not differentiator |
| **Quick-Add Widgets** | Mobile platform distribution complexity | Can ship after PWA proves engagement |
| **Custom MCP Integrations** | **Risk 6:** No comparable startup launched with this | Sunsama, Marvin, Akiflow all used Zapier first |

### 1.3 Out of Scope (v2+)

- Custom workflow/rules engine (use Zapier/Make for MVP)
- Team workspaces & real-time collaboration
- Bi-directional sync (complete task → update external tool)
- Multi-step workflow chains, branching, advanced retries
- Public API / marketplace

### 1.4 Scope Rationale

**Market Research Findings:**
- **Risk 6 (MEDIUM):** "None of the comparable startups launched with custom workflow engines. Sunsama, Marvin, and Akiflow relied on Zapier for initial automation."
- **Strategic gap identified:** "No competitor combines AI-assisted planning with per-task reasoning transparency AND proactive avoidance-loop detection."

**Decision:** Redirect engineering from MCP/workflow engine → behavioral intelligence + explainable AI to maximize differentiation in crowded market.

---

## 2. Product Epics

### Epic 1: Task Foundation
**Goal:** Enable fast, reliable task capture and organization  
**User Value:** "I can quickly dump all my tasks and find them later"  
**Validated By:** Industry standard; baseline expectation

#### User Stories

**E1.US1: Quick Task Capture**
```
As an Overwhelmed Professional
I want to create a task in ≤ 2 seconds
So that I can capture ideas without breaking flow

Acceptance Criteria:
- Task created with title only (no required metadata)
- Form auto-focuses on title field
- Enter key saves and clears for next task
- Offline creation supported; syncs when online
- Mobile: accessible from all screens via FAB
```

**E1.US2: Task Metadata**
```
As a Knowledge Worker
I want to optionally add context to tasks (estimate, due date, energy, tags)
So that the Daily Plan Engine has signal to work with

Acceptance Criteria:
- Due date/time picker (optional)
- Estimate selector: 5/15/30/60/120 min (optional)
- Energy selector: low/medium/high (optional)
- Tags: create inline or select existing (optional)
- Notes: free text area (optional)
- Source link: auto-populated by integrations (optional)
- All fields remain optional; no forced entry
```

**E1.US3: List Organization**
```
As a user
I want to organize tasks into lists
So that I can separate active work from future/archived items

Acceptance Criteria:
- Default lists: Inbox, Today, Upcoming, Someday, Archive
- Filter by: due date, tag, estimate, energy, status
- Search tasks by title and notes (full-text)
- Move tasks between lists via drag-drop or context menu
- Bulk actions: select multiple → move/tag/archive
```

**E1.US4: Offline Support**
```
As a mobile user
I want to capture and complete tasks offline
So that I can work during commute/flight

Acceptance Criteria:
- PWA installable on mobile home screen
- Tasks created offline queued for sync
- Completions marked offline sync on reconnect
- Conflict resolution: last-write-wins for now (optimistic)
- Sync status indicator visible
```

---

### Epic 2: Daily Plan Engine (Core Differentiator)
**Goal:** Generate a realistic daily plan users trust  
**User Value:** "The system helps me decide what to work on today without overwhelming me"  
**Validated By:** Motion (1M+ users), Sunsama (NYT Wirecutter), Marvin (4.8⭐) all built on this thesis

#### User Stories

**E2.US1: Generate Daily Plan**
```
As an Overwhelmed Professional with 50+ tasks in my backlog
I want to tap "Generate Daily Plan" and get a curated set for today
So that I don't waste 20 minutes deciding what to work on

Acceptance Criteria:
- Button: "Generate Daily Plan" (prominent, above-fold)
- Output in < 2 seconds
- Three buckets:
  1. Recommended (~5 tasks) — capacity-aware
  2. Optional (~3 tasks) — stretch goals
  3. Deferred (everything else) — with reasons
- Every recommended task shows "Why?" label with short reason
- Plan saved as dated snapshot
- Regenerate preserves user overrides (pins/swaps)
```

**E2.US2: Explainable Recommendations**
```
As a user who has tried opaque AI planners (like Motion)
I want to see WHY each task was recommended
So that I trust the system and learn what matters

Acceptance Criteria:
- Every task in Recommended/Optional shows reason string
- Example reasons:
  - "Due today"
  - "Due tomorrow; estimated 60 min"
  - "Postponed 3 times (may be stuck)"
  - "High energy match for morning"
  - "Quick win (15 min)"
- Deferred tasks show why excluded:
  - "No due date; lower priority"
  - "Would exceed daily capacity (4h 30min planned)"
  - "Waiting on [dependency]"
- Tappable "?" icon expands to full explanation
```

**E2.US3: User Overrides**
```
As a user
I want to adjust the plan without fighting the system
So that I maintain control over my work

Acceptance Criteria:
- Pin task into Recommended 5 (override)
- Swap task from Optional ↔ Recommended
- Remove task from today (defer manually)
- Overrides sticky: regenerate preserves pins/swaps
- Capacity warning when pinning exceeds limits:
  "You're over capacity (5h 30min planned, 4h available). Continue?"
- Warning is dismissible; hard limit not enforced
```

**E2.US4: Capacity Configuration**
```
As a user
I want to set my realistic daily capacity
So that recommendations match my actual availability

Acceptance Criteria:
- Settings screen:
  - Max tasks/day (default: 5-8, user adjustable)
  - Max minutes/day (default: 4 hours, user adjustable)
  - Work hours (e.g., 9am-5pm) for energy matching
- Onboarding wizard sets defaults based on persona:
  - Overwhelmed Professional: 4h/day
  - Student: 6h/day
  - Custom: user input
- Plan engine respects limits with soft warnings
```

**E2.US5: Scoring Logic (MVP Implementation)**
```
As the system
I need to rank tasks for daily plan generation
So that recommendations are useful

Acceptance Criteria (Rule-Based Scoring):
- **Urgency score:**
  - Due today: +100 points
  - Due tomorrow: +50 points
  - Due this week: +20 points
  - Overdue: +150 points
- **Capacity fit:**
  - Sum estimates of selected tasks ≤ max_minutes_per_day
  - Prefer smaller tasks when approaching capacity
- **Avoidance signal:**
  - Postponed ≥ 3 times: flag for Loop Breaker (see E3)
  - Postponed 1-2 times: +10 points (gentle nudge)
- **Energy match (if set):**
  - High energy task + morning hour: +15 points
  - Low energy task + afternoon hour: +15 points
- **Historical completion capacity:**
  - Track rolling avg tasks/day completed (last 14 days)
  - Cap recommended count at historical avg + 2
- Sort by score DESC, select top N within capacity
```

---

### Epic 3: Postponement Loop Breaker (Hero Differentiator)
**Goal:** Detect and intervene on tasks that repeatedly slip  
**User Value:** "The system helps me get unstuck instead of nagging me"  
**Validated By:** Market Research §3.4: "No major competitor offers the full behavioral intelligence loop"

#### User Stories

**E3.US1: Detect Stuck Tasks**
```
As the system
I need to identify tasks that are repeatedly postponed
So that I can intervene before the user loses trust

Acceptance Criteria:
- Track postpone_count per task
- Increment when:
  - Task in Today's Recommended → not completed → next day
  - User manually defers from Today → Upcoming
- Flag task as "stuck" when postpone_count ≥ 3
- Stuck tasks highlighted in UI (subtle orange indicator)
```

**E3.US2: Diagnose Why Stuck**
```
As a user with a task I keep avoiding
I want the system to ask me what's wrong
So that I can clarify and move forward

Acceptance Criteria:
- Prompt triggered when:
  - Stuck task appears in Daily Plan again
  - End-of-day reflection (if user opts in)
- Modal: "This task has been postponed 3 times. What's blocking you?"
- Single-choice options:
  - "Too big" → suggest split (see E3.US3)
  - "Unclear next step" → prompt to rewrite title as action
  - "Low value" → suggest archive/someday
  - "Waiting on someone/something" → add dependency note
  - "Not sure" → log for future pattern analysis
- Selection stored; used to adjust future plans
```

**E3.US3: Intervention Actions**
```
As a user who selected "Too big"
I want help breaking the task down
So that I can make progress

Acceptance Criteria:
- "Too big" → Show subtask creator:
  - "What are 2-3 smaller steps?" (free text)
  - Creates child tasks with estimates ÷ N
  - Parent task moved to Someday (tracks children)
- "Unclear" → Inline edit mode:
  - "Rewrite as a specific action (verb + noun)"
  - Example hint: "Review draft" → "Read intro section of draft"
- "Low value" → Quick archive:
  - "Move to Archive or Someday?"
  - One-tap action; undo available
- "Waiting on" → Dependency note:
  - "What are you waiting for?"
  - Stored in notes; task hidden until resolved
- All interventions logged for future ML training (v2)
```

**E3.US4: Learn from Interventions**
```
As the system
I want to adjust future plans based on intervention patterns
So that I proactively avoid stuck tasks

Acceptance Criteria (MVP: Simple Heuristics):
- If task split (subtasks created):
  - Future large estimates (>60 min) flagged: "Consider breaking down?"
- If task archived as low value:
  - Tasks with similar tags deprioritized in future plans
- If waiting on dependency:
  - Don't recommend task until dependency noted as resolved
- (v2: ML-based pattern recognition)
```

---

### Epic 4: Reflection & Learning
**Goal:** Close the behavioral learning loop  
**User Value:** "I see what's working and what's not; the system gets better over time"  
**Validated By:** Sunsama's shutdown ritual; no competitor does causal "why tasks slip" analysis well

#### User Stories

**E4.US1: End-of-Day Check-In**
```
As a user ending my workday
I want to quickly reflect on how it went
So that the system learns my patterns without heavy lifting

Acceptance Criteria:
- Optional prompt (dismissible): "How was today?"
- Questions:
  1. "Was today's plan realistic?" (Yes / No / Somewhat)
  2. "What blocked you?" (single-choice):
     - Meetings ran over
     - Tasks took longer than estimated
     - New urgent tasks appeared
     - Lost focus / distracted
     - Felt overwhelmed
     - Nothing blocked me
  3. Optional note (free text)
- Completed in < 30 seconds
- Skippable without penalty
- Data used to adjust capacity model
```

**E4.US2: Weekly Summary**
```
As a user
I want to see my week in review
So that I understand my patterns and celebrate progress

Acceptance Criteria:
- Auto-generated every Monday morning
- Shows:
  - Total tasks completed (vs. planned)
  - Completion rate trend (chart: last 4 weeks)
  - Most postponed tasks (top 3) → suggest interventions
  - Avg tasks completed per day
  - Avg estimated time vs. actual time (if tracked)
  - Streak: consecutive days with plan generated
- "Share your week" option (export as image)
- Actionable insights:
  - "You're consistently over-planning. Try reducing daily capacity to X."
  - "Tasks tagged 'admin' are often postponed. Schedule a dedicated admin block?"
```

**E4.US3: Estimate Accuracy Tracking**
```
As the system
I want to compare estimated vs. actual time
So that I can improve future estimates

Acceptance Criteria:
- When completing task, optional: "How long did this take?"
  - Quick buttons: As estimated / +15 min / +30 min / Custom
- Store actual_minutes alongside estimate_minutes
- Weekly summary shows estimate accuracy:
  - "Your estimates are typically X% accurate"
  - "You underestimate tasks tagged Y by avg 30 min"
- (v2: Adjust future estimates based on patterns)
```

---

### Epic 5: Notifications & Habit Formation
**Goal:** Build daily planning ritual  
**User Value:** "I don't forget to plan; the system reminds me at the right time"  
**Validated By:** Standard in category; critical for retention

#### User Stories

**E5.US1: Daily Plan Reminder**
```
As a user
I want a daily reminder to generate my plan
So that planning becomes a habit

Acceptance Criteria:
- Default: 8:00 AM local time (user configurable)
- Notification: "Good morning! Ready to plan your day?"
- Tapping opens app → Daily Plan screen
- Configurable days (e.g., weekdays only)
- Disable option in settings
```

**E5.US2: Due Task Reminders**
```
As a user with time-sensitive tasks
I want reminders for tasks due today
So that I don't miss deadlines

Acceptance Criteria:
- Configurable times:
  - Morning reminder (default: 9 AM)
  - Afternoon reminder (default: 2 PM)
- Shows count: "You have 3 tasks due today"
- Tapping opens Today view
- Per-task reminders (if due_time set): 15 min before
- All reminders togglable in settings
```

**E5.US3: Notification Preferences**
```
As a user
I want control over all notifications
So that I'm not annoyed by the system

Acceptance Criteria:
- Settings screen: toggle each notification type
- Quiet hours: disable notifications during range (e.g., 8 PM - 8 AM)
- Notification channel per type (iOS/Android)
- Default: all enabled except per-task reminders
```

---

### Epic 6: PWA & Mobile Experience
**Goal:** Access at key decision moments (morning, between meetings, commute)  
**User Value:** "I can plan and capture tasks wherever I am"  
**Validated By:** Risk 5: "All competitors have native mobile apps; use case is mobile-first"

#### User Stories

**E6.US1: PWA Installation**
```
As a mobile user
I want to install Focus OS on my home screen
So that it feels like a native app

Acceptance Criteria:
- PWA manifest configured (icons, splash screen, theme color)
- Install prompt on first mobile visit
- "Add to Home Screen" option visible in browser menu
- Opens full-screen (no browser chrome) when launched from icon
- iOS + Android support
```

**E6.US2: Mobile-First UI**
```
As a mobile user
I want the core workflows optimized for thumb reach
So that I can use the app one-handed

Acceptance Criteria:
- Bottom navigation (not top tabs)
- FAB (Floating Action Button) for quick add (bottom-right)
- Swipe gestures:
  - Swipe right on task → complete
  - Swipe left on task → defer/archive
- Touch targets ≥ 44px (iOS HIG, Android Material)
- Form inputs auto-zoom on focus (no accidental page zoom)
```

**E6.US3: Offline Persistence**
```
As a commuting user
I want to work offline and sync later
So that spotty connectivity doesn't block me

Acceptance Criteria:
- Service worker caches app shell + data
- IndexedDB stores tasks locally
- Background sync when reconnected
- Sync status indicator:
  - Green: synced
  - Yellow: syncing
  - Gray: offline (queued changes)
- Conflict resolution: last-write-wins (MVP)
```

---

### Epic 7: Onboarding & Trust Building
**Goal:** Activate users and explain behavioral data collection upfront  
**User Value:** "I understand what the app does and why it needs my data"  
**Validated By:** Risk 4: "Behavioral data collection vs. privacy claims tension"

#### User Stories

**E7.US1: First-Run Wizard**
```
As a new user
I want to understand the product value quickly
So that I'm motivated to set up

Acceptance Criteria:
- 3-screen wizard:
  1. "Focus OS helps you plan a realistic day" (hero screenshot)
  2. "We track completion patterns to improve your plans" (data transparency)
  3. "Set your daily capacity" (persona-based defaults)
- Skippable after screen 1 (power users)
- Total time: < 60 seconds
```

**E7.US2: Behavioral Data Consent**
```
As a privacy-conscious user
I want to know exactly what's tracked and why
So that I can make an informed choice

Acceptance Criteria:
- Screen 2 of onboarding explains:
  - "We track: task completions, postponements, plan overrides"
  - "Why: to recommend better daily plans over time"
  - "Your data: processed locally where possible, encrypted at rest, deletable anytime"
- Granular opt-in (checkboxes):
  - [ ] Track completion patterns (required for Daily Plan Engine)
  - [ ] Track postponement patterns (powers Loop Breaker)
  - [ ] Track estimate accuracy (improves future estimates)
- Link to full Privacy Policy
- GDPR/CCPA compliant (clear consent, easy withdrawal)
```

**E7.US3: Empty State Onboarding**
```
As a new user with no tasks yet
I want guidance on what to do first
So that I don't bounce

Acceptance Criteria:
- Inbox empty state:
  - "Let's capture some tasks to get started"
  - Inline task creator (no separate screen)
  - Example task placeholders: "Review quarterly goals", "Email team about project X"
  - Dismissible hint: "Add 5-10 tasks to try Daily Plan"
- Daily Plan empty state:
  - "Add tasks to your Inbox first"
  - CTA: "Go to Inbox" button
```

---

## 3. Product Backlog (Prioritized)

### Phase 0: Discovery (Week 1-2) — PRE-DEVELOPMENT
**Goal:** Validate plan engine logic + UX prototype

| ID | Story | Priority | Estimated Effort | Dependencies |
|----|-------|----------|------------------|--------------|
| D1 | Conduct 10-15 user interviews (Overwhelmed Professionals, Students) | P0 | 2 weeks | Recruiting plan |
| D2 | Validate scoring logic with users (urgency vs. capacity vs. energy) | P0 | Embedded in D1 | D1 |
| D3 | Test postponement intervention prompts (paper prototype) | P0 | Embedded in D1 | D1 |
| D4 | Wireframe Daily Plan screen + explainability UX | P0 | 1 week | D1 |
| D5 | Prototype mobile quick-add flow | P0 | 1 week | D1 |

**Exit Criteria:** 
- 80% of interviewees find plan engine logic "makes sense"
- Postponement prompts test as "helpful, not annoying"
- UX prototype achieves < 3-click path for: capture task, generate plan, complete task

---

### Phase 1: MVP Build (Week 3-8) — 6 WEEKS
**Goal:** Ship core Daily Plan Engine + Loop Breaker + PWA

#### Sprint 1: Task Foundation (Week 3-4)
| ID | Story | Priority | Estimated Effort | Dependencies |
|----|-------|----------|------------------|--------------|
| **E1.US1** | Quick Task Capture | P0 | 3 points | — |
| **E1.US2** | Task Metadata | P0 | 5 points | E1.US1 |
| **E1.US3** | List Organization | P0 | 5 points | E1.US1 |
| **E1.US4** | Offline Support | P1 | 8 points | E1.US1 |
| **E6.US1** | PWA Installation | P1 | 3 points | — |
| **E6.US2** | Mobile-First UI | P1 | 5 points | E1.US1 |

**Sprint Goal:** Users can capture tasks on mobile offline + organize into lists

---

#### Sprint 2: Daily Plan Engine (Week 5-6)
| ID | Story | Priority | Estimated Effort | Dependencies |
|----|-------|----------|------------------|--------------|
| **E2.US1** | Generate Daily Plan | P0 | 8 points | E1.US2 |
| **E2.US2** | Explainable Recommendations | P0 | 5 points | E2.US1 |
| **E2.US5** | Scoring Logic (Rule-Based) | P0 | 8 points | E2.US1 |
| **E2.US4** | Capacity Configuration | P1 | 3 points | E2.US1 |

**Sprint Goal:** Users can generate a realistic daily plan with explanations

---

#### Sprint 3: Postponement Loop Breaker (Week 7)
| ID | Story | Priority | Estimated Effort | Dependencies |
|----|-------|----------|------------------|--------------|
| **E3.US1** | Detect Stuck Tasks | P0 | 3 points | E2.US1 |
| **E3.US2** | Diagnose Why Stuck | P0 | 5 points | E3.US1 |
| **E3.US3** | Intervention Actions | P0 | 8 points | E3.US2 |
| **E3.US4** | Learn from Interventions | P1 | 5 points | E3.US3 |

**Sprint Goal:** System detects postponement loops and helps users get unstuck

---

#### Sprint 4: Reflection + Notifications (Week 8)
| ID | Story | Priority | Estimated Effort | Dependencies |
|----|-------|----------|------------------|--------------|
| **E4.US1** | End-of-Day Check-In | P1 | 3 points | E2.US1 |
| **E4.US2** | Weekly Summary | P1 | 5 points | E4.US1 |
| **E5.US1** | Daily Plan Reminder | P0 | 2 points | — |
| **E5.US2** | Due Task Reminders | P1 | 3 points | E1.US2 |
| **E5.US3** | Notification Preferences | P1 | 2 points | E5.US1 |
| **E2.US3** | User Overrides | P0 | 5 points | E2.US1 |

**Sprint Goal:** Close behavioral loop + build daily planning habit

---

### Phase 2: Beta Hardening (Week 9-11) — 3 WEEKS
**Goal:** Performance, sync, error handling, QA automation

| ID | Story | Priority | Estimated Effort | Dependencies |
|----|-------|----------|------------------|--------------|
| H1 | Sync conflict resolution (last-write-wins + manual review UI) | P0 | 5 points | E1.US4 |
| H2 | Performance: Plan generation < 2s with 500+ tasks | P0 | 3 points | E2.US1 |
| H3 | Error handling: network failures, malformed data | P0 | 5 points | All |
| H4 | QA automation: E2E tests for core journeys | P1 | 8 points | All |
| H5 | Security review: token storage, GDPR compliance | P0 | 3 points | E7.US2 |
| H6 | Beta user testing (20-30 users, 2-week dogfood) | P0 | 2 weeks | All |

**Exit Criteria:**
- Zero critical bugs in 2-week beta period
- Plan generation meets < 2s target at P95
- All GDPR consent flows tested + documented

---

### Phase 3: v1 Launch Prep (Week 12-13) — 2 WEEKS
**Goal:** Onboarding, observability, pricing experiments

| ID | Story | Priority | Estimated Effort | Dependencies |
|----|-------|----------|------------------|--------------|
| **E7.US1** | First-Run Wizard | P0 | 3 points | — |
| **E7.US2** | Behavioral Data Consent | P0 | 3 points | E7.US1 |
| **E7.US3** | Empty State Onboarding | P0 | 2 points | E1.US1 |
| L1 | Analytics dashboard (activation, engagement, retention) | P0 | 5 points | — |
| L2 | Pricing page + paywall (freemium tier gates) | P1 | 5 points | TBD pricing model |
| L3 | App Store / Play Store listings | P1 | 1 point | E6.US1 |
| L4 | Launch marketing (landing page, blog post, Product Hunt) | P1 | 1 week | — |

**Exit Criteria:**
- All success metrics instrumented (§4.3)
- Pricing model decided (freemium vs. free trial)
- App Store + web launch simultaneous

---

## 4. Success Metrics & Validation

### 4.1 Activation Metrics (Week 1-7)
| Metric | Target | Measurement | Validated By |
|--------|--------|-------------|--------------|
| Users create ≥ 10 tasks | ≥ 60% | Day 7 cohort | Industry standard |
| Users generate Daily Plan ≥ 3x | ≥ 40% | Week 1 cohort | Sunsama analog |
| Complete first-run wizard | ≥ 70% | Session 1 | Onboarding best practice |

### 4.2 Engagement Metrics (Week 2-8)
| Metric | Target | Measurement | Validated By |
|--------|--------|-------------|--------------|
| Daily Plan usage | ≥ 4 days/week | Active users | PRD §4 |
| Tasks completed per day | Baseline + 15% | After 4 weeks | PRD §4 |
| Postponement Loop Breaker engagement | ≥ 50% of stuck tasks receive intervention | Week 4+ | Hero feature adoption |
| Plan override rate | ≤ 35% after learning period | Week 4+ | PRD §4 (trust metric) |

### 4.3 Retention Metrics (Week 4+)
| Metric | Target | Measurement | Validated By |
|--------|--------|-------------|--------------|
| Week-4 retention | ≥ 25% (consumer) | Cohort analysis | PRD §4 |
| Week-4 retention (if teams pilot) | ≥ 40% | Cohort analysis | PRD §4 |

### 4.4 Quality/Trust Metrics (Week 2+)
| Metric | Target | Measurement | Validated By |
|--------|--------|-------------|--------------|
| Plan usefulness rating | ≥ 4.2/5 | In-app survey (weekly prompt) | PRD §4 |
| Explainability feature usage | ≥ 30% tap "?" to expand reasoning | Week 2+ | Differentiator adoption |
| Behavioral data opt-in rate | ≥ 70% | Onboarding wizard | Trust/transparency indicator |

### 4.5 Instrumentation Requirements

**Required Events:**
- TaskCreated (with metadata: has_estimate, has_energy, has_due_date)
- TaskCompleted (with actual_time if provided)
- TaskPostponed (with reason if diagnosed)
- PlanGenerated (with overrides_count, capacity_exceeded)
- LoopBreakerTriggered (with selected_reason)
- InterventionActionTaken (with action_type)
- ReflectionCompleted (with responses)
- NotificationTapped (with notification_type)

**Dashboards:**
1. **Activation Dashboard:** D1/D7 signup → 10 tasks, D1/D7 → 3 plans
2. **Engagement Dashboard:** DAU/MAU, plan generation frequency, completion rate trend
3. **Quality Dashboard:** Plan usefulness rating, override rate, explainability usage
4. **Retention Dashboard:** D1/D7/D30 cohort retention curves

---

## 5. Risks, Gaps & Open Decisions

### 5.1 Validated Risks from Market Research

| Risk | Severity | Mitigation | Owner | Status |
|------|----------|------------|-------|--------|
| **Crowded competitive space** (Motion 1M+ users) | HIGH | Lead with behavioral intelligence + explainable AI; avoid "me too" positioning | Product + Marketing | ✅ Addressed in scope |
| **Consumer monetization challenge** (enterprises hold 54.6% revenue) | MEDIUM-HIGH | Freemium core + premium for behavioral features; consider B2B2C in v2 | Product + Pricing | ⚠️ Open decision (§5.3.1) |
| **"Recommended 5" may frustrate power users** | MEDIUM | Changed to soft warnings, not hard limits (see E2.US3) | Product | ✅ Resolved |
| **Behavioral data vs. privacy tension** | MEDIUM | Explicit consent flow (E7.US2); local-first processing; GDPR compliance | Product + Legal | ✅ Addressed in scope |
| **Web-only misses mobile use cases** | MEDIUM | PWA from day one (E6.US1); evaluate native in v2 | Product + Eng | ✅ Resolved |
| **MCP integrations premature for MVP** | MEDIUM | Defer to v2; use Zapier/Make initially | Product | ✅ Resolved |
| **Problem is systemic, not tool-shaped** (66% burnout) | LOW-MEDIUM | Frame as "supporting overwhelm recovery"; manage expectations in marketing | Marketing | ⚠️ Open (marketing tone) |

### 5.2 Product Gaps Identified

| Gap | Impact | Resolution Plan |
|-----|--------|----------------|
| **No pricing model defined** | Can't build paywall (L2) | Phase 0 discovery: validate willingness-to-pay at $10-15/mo (§5.3.1) |
| **Conflict resolution = last-write-wins** | May lose user data in edge cases | MVP acceptable; build CRDTs in v2 if issue |
| **No accessibility audit** | May exclude screen-reader users | Add to Phase 2 QA checklist |
| **No multi-language support** | English-only limits market | v2 feature; 77% of market is North America (acceptable for MVP) |
| **No team collaboration** | Can't address enterprise (54.6% of revenue) | Explicitly v2; focus on consumer first |

### 5.3 Open Decisions (Requiring Stakeholder Input)

#### 5.3.1 Pricing Model
**Options:**
1. **Freemium:** Free tier (basic lists) + Pro ($10-15/mo) for AI + Loop Breaker
2. **Free Trial → Paid:** 14-day trial, then $10-15/mo (all features)
3. **Lifetime Option:** Add $200-300 lifetime tier (Amazing Marvin validates this)

**Decision Needed By:** End of Phase 0 (Week 2)  
**Owner:** Kobayashi + CEO  
**Research:** Amazing Marvin uses freemium + lifetime; Todoist uses freemium; Motion/Sunsama are premium-only

**Recommendation:** Freemium with Pro at $12/mo + $250 lifetime option for early adopters. Rationale:
- Lower barrier to activation (free tier drives signups)
- Behavioral intelligence as premium justifies upsell
- Lifetime option validates monetization early + builds evangelists

---

#### 5.3.2 Behavioral Intelligence: Free or Premium?
**Tension:** Explainability builds trust (should be free) vs. Loop Breaker is hero feature (premium value)

**Options:**
1. **All Free:** Explainable AI + Loop Breaker in free tier (maximize adoption, monetize via integrations/teams later)
2. **Split:** Explainable AI free, Loop Breaker premium (balances trust + monetization)
3. **All Premium:** Both features locked to Pro (maximizes revenue, risks lower trust/adoption)

**Decision Needed By:** End of Phase 0 (Week 2)  
**Owner:** Kobayashi + CEO  

**Recommendation:** Option 2 (Split). Rationale:
- Explainable AI in free tier differentiates from Motion/Sunsama immediately
- Loop Breaker as premium provides clear upgrade value ("get unstuck faster")
- Users can trust free tier, then upgrade when they encounter postponement loops

---

#### 5.3.3 Platform Priority: PWA vs. Native Mobile
**Current Plan:** PWA from day one (E6.US1)

**Open Question:** Should we commit to native iOS/Android for v1.1 (3 months post-launch)?

**Data:**
- All direct competitors (Motion, Sunsama, Akiflow) have native mobile apps
- Use case is inherently mobile-first (morning planning, between meetings, commute)
- PWA limitations: No iOS widgets, limited background sync, no App Store discovery

**Decision Needed By:** End of Phase 2 (Week 11, based on beta feedback)  
**Owner:** Kobayashi + CTO  

**Recommendation:** Defer decision to beta. If beta users report PWA friction (install confusion, performance issues), prioritize native. Otherwise, ship PWA v1 → native v1.1.

---

#### 5.3.4 Integration Strategy: Zapier vs. Custom
**Current Plan:** No custom MCP integrations in MVP (use Zapier/Make)

**Open Question:** Which integration should we prioritize first in v2?

**Options (ranked by research):**
1. **Google Calendar** (meeting follow-ups → tasks) — most requested in competitor reviews
2. **GitHub** (assigned issues → tasks) — dev persona fit
3. **Gmail** (starred emails → tasks) — broad appeal
4. **Slack** (saved messages → tasks) — workplace context

**Decision Needed By:** Week 10 (Phase 2, to inform v2 roadmap)  
**Owner:** Kobayashi  

**Recommendation:** Google Calendar. Rationale:
- Overwhelmed Professional persona has 11.3 hrs/week in meetings
- "Meeting ran over" is top blocker in reflection data (expected)
- Calendar integration = automatic capacity adjustment (high value)

---

#### 5.3.5 Guest Mode vs. Mandatory Sign-In
**Open Question:** Should we allow guest mode (local-only, no account)?

**Options:**
1. **Mandatory sign-in:** All users create account (email/SSO) to use app
2. **Guest mode:** Use locally, optional upgrade to sync account later

**Tradeoffs:**
| | Mandatory Sign-In | Guest Mode |
|---|---|---|
| Activation friction | Higher (signup required) | Lower (try immediately) |
| Data loss risk | Low (cloud backup) | High (device-only) |
| Engagement tracking | Complete | Partial (only post-conversion) |
| Monetization | Easier (email = conversion funnel) | Harder (anonymous users) |

**Decision Needed By:** End of Phase 0 (Week 2)  
**Owner:** Kobayashi + Growth  

**Recommendation:** Mandatory sign-in. Rationale:
- Behavioral intelligence requires longitudinal data (can't work device-only)
- Guest mode complicates sync architecture (CRDTs, migration flows)
- Target personas (Overwhelmed Professionals) already have 10+ SaaS accounts; signup friction overblown
- Competitors (Motion, Sunsama) all require sign-in

---

## 6. Dependencies & Blockers

### 6.1 External Dependencies
| Dependency | Owner | Status | Risk |
|------------|-------|--------|------|
| **User recruiting for Phase 0** | Marketing | Not started | HIGH — blocks discovery |
| **Legal review: GDPR compliance** | Legal | Not started | MEDIUM — blocks Phase 3 launch |
| **App Store developer accounts** | Eng Ops | Not started | LOW — 2-week lead time |
| **Zapier account + integration testing** | Eng | Not started | LOW — nice-to-have for launch |

### 6.2 Internal Blockers
| Blocker | Impact | Resolution |
|---------|--------|------------|
| **Pricing model undecided** | Can't build paywall (L2) | Decision by Week 2 (§5.3.1) |
| **No design system** | Slows UI implementation | Build minimal system in Sprint 1 (buttons, forms, modals) |
| **Unclear backend architecture** | Sync + offline strategy needs decision | CTO to propose architecture Week 1 |

---

## 7. Release Criteria (v1 Launch)

### 7.1 Must-Have (Blocking)
- [ ] All P0 user stories implemented and tested
- [ ] Plan generation < 2s at P95 with 500+ tasks
- [ ] PWA installable on iOS + Android
- [ ] Offline sync works without data loss in happy path
- [ ] GDPR consent flow reviewed by Legal
- [ ] Zero critical bugs in 2-week beta
- [ ] Activation metrics instrumented (can measure success metrics)
- [ ] Onboarding wizard achieves ≥ 70% completion in beta

### 7.2 Nice-to-Have (Non-Blocking)
- [ ] Weekly summary auto-generation (can ship in v1.1)
- [ ] Estimate accuracy tracking (can ship in v1.1)
- [ ] Zapier integration tested (can ship in v1.2)
- [ ] App Store listings approved (can launch web-first)

### 7.3 Launch Readiness Checklist
- [ ] Marketing landing page live
- [ ] Privacy Policy + Terms of Service published
- [ ] Support documentation (Help Center basics)
- [ ] Error monitoring (Sentry or equivalent)
- [ ] Analytics dashboard operational
- [ ] Beta feedback incorporated
- [ ] Go/No-Go meeting with stakeholders

---

## 8. Post-Launch Roadmap (v2 Planning)

### 8.1 v1.1 (1 Month Post-Launch) — Quick Wins
- Estimate accuracy tracking (E4.US3)
- Weekly summary auto-generation (E4.US2 polish)
- Mobile performance optimizations
- Bug fixes from v1 launch

### 8.2 v1.2 (2 Months Post-Launch) — First Integration
- Google Calendar integration (read-only: meetings → capacity adjustment)
- Zapier/Make integration testing + documentation
- Natural language task parsing (stretch)

### 8.3 v2.0 (6 Months Post-Launch) — Native Mobile + Workflows
**Evaluate based on v1 metrics:**
- If PWA adoption < 40%, prioritize native mobile apps
- If integration requests high, build first custom MCP connector
- If team collaboration requests emerge, prototype workspaces

**Core v2 Features (Tentative):**
- Native iOS + Android apps
- Custom workflow engine (MCP-based)
- Team workspaces (shared projects + commenting)
- Public API (read/write tasks)
- ML-based scoring (upgrade from rule-based)

---

## 9. Appendix: User Interview Guide (Phase 0)

### 9.1 Interview Goals
1. Validate Daily Plan Engine scoring logic (urgency vs. capacity vs. energy)
2. Test postponement intervention prompts (tone, usefulness)
3. Identify friction points in current task management workflows
4. Gauge willingness-to-pay for behavioral intelligence features

### 9.2 Screening Criteria
- Uses a to-do app currently (Todoist, Notion, Asana, Apple Reminders, paper, etc.)
- Has ≥ 20 tasks in backlog typically
- Works in a role with frequent context switching (meetings, interruptions)
- Mix of personas: 60% Overwhelmed Professionals, 30% Students/Knowledge Workers, 10% ADHD/Executive Dysfunction

### 9.3 Interview Script (30 min)

**Section 1: Current Workflow (10 min)**
1. Walk me through how you plan your day today. What tools do you use?
2. How do you decide what to work on when you sit down?
3. How often do tasks slip to the next day? What happens to them?
4. Do you ever feel overwhelmed by your task list? Tell me about the last time.

**Section 2: Daily Plan Engine Validation (10 min)**
5. [Show wireframe] This is a "Generate Daily Plan" feature. What do you expect it to do?
6. [Show example output] Here's what it recommended. Does this make sense? Why/why not?
7. [Point to "Why?" labels] What do you think of these explanations?
8. Would you trust this system to pick your tasks? What would make you trust it more?

**Section 3: Postponement Loop Breaker (5 min)**
9. [Show paper prototype of intervention prompt] You've postponed "Review Q1 report" 3 times. The app asks "What's blocking you?" and shows these options. What would you pick?
10. If the app suggested "This task is too big, let's break it down," would that help or annoy you?

**Section 4: Pricing (5 min)**
11. Would you pay for a tool that helps you plan a realistic day and get unstuck? How much?
12. If there was a free tier (basic lists) and a Pro tier (AI planning + unstuck help), which would you use?

---

## 10. Glossary

| Term | Definition |
|------|------------|
| **Daily Plan Engine** | Core algorithm that generates "Recommended 5" tasks for today based on urgency, capacity, energy, and behavioral signals |
| **Postponement Loop Breaker** | Feature that detects tasks postponed ≥ 3 times and intervenes with diagnostic prompts + actions (split, clarify, archive) |
| **Explainable AI** | Per-task reasoning strings that explain *why* each task was recommended (e.g., "Due today", "High energy match for morning") |
| **Behavioral Intelligence** | Tracking completion patterns, postponements, and plan overrides to improve future recommendations |
| **Capacity Model** | User-configured limits (max tasks/day, max minutes/day) + rolling avg historical completion rate |
| **Stuck Task** | Task with postpone_count ≥ 3, flagged for Loop Breaker intervention |
| **PWA** | Progressive Web App — web app that's installable, offline-capable, and feels native |
| **MCP** | Model Context Protocol — integration framework (deferred to v2) |

---

## Document Control
- **Version:** 1.0
- **Last Updated:** 28 February 2026
- **Next Review:** End of Phase 0 (Week 2) — update based on user interview findings
- **Change Log:**
  - v1.0 (28 Feb 2026): Initial product plan based on PRD + market research analysis

---

**Sign-Off:**
- [ ] Kobayashi (Product Owner) — _Pending_
- [ ] Keaton (Tech Lead) — _Pending technical feasibility review_
- [ ] CEO — _Pending scope + pricing decisions (§5.3)_

