# SKILL: Market Research to Product Backlog Translation

## Intent
Convert high-level product vision + market research into actionable MVP scope, user stories, and prioritized backlog.

## When to Use
- Post-PRD, pre-development (discovery phase)
- When market research exists but scope/priorities unclear
- When team needs alignment on "what to build first"
- When MVP scope needs validation against competitive landscape

## Context Requirements

### Minimum Viable Inputs
1. **Problem Statement** — validated or hypothesis
2. **Target Personas** — with pain points
3. **Market Research** (optional but recommended):
   - Competitive landscape
   - Market size / growth trends
   - User behavior data (burnout rates, productivity stats, etc.)
4. **Success Metrics** — how you'll measure MVP success

### Ideal State
- PRD with feature requirements
- Competitive analysis with feature comparison matrix
- User research / interviews (qualitative validation)
- Market data (quantitative validation)

## Process

### Step 1: Validate Core Assumptions
**Goal:** Separate validated from risky/unvalidated assumptions

**Actions:**
1. Extract all assumptions from PRD/vision doc
2. Cross-reference with market research data
3. Score each assumption:
   - ✅ **Strongly validated** — multiple data sources + competitor existence confirms
   - ✅ **Validated** — data supports, but not definitive
   - ⚠️ **Partially validated** — mixed signals
   - ❌ **Unvalidated** — no supporting evidence; hypothesis only
   - 🚨 **Contradicted** — data suggests assumption is wrong

**Output:** Validation scorecard (see example in product-plan.md §9)

**Key Question:** Which assumptions, if wrong, would kill the product?

---

### Step 2: Identify Differentiators vs. Table Stakes
**Goal:** Understand competitive positioning

**Actions:**
1. Map all proposed features to competitive landscape:
   - **Table Stakes** — every competitor has this (e.g., task capture, lists)
   - **Common** — most competitors have this (e.g., due dates, calendar integration)
   - **Emerging** — some competitors have this (e.g., AI recommendations)
   - **Unique** — no competitor has this (e.g., full behavioral intelligence loop)

2. Rank differentiators by:
   - **Market gap size** — how many competitors address this?
   - **User pain intensity** — how painful is the problem?
   - **Defensibility** — how hard to copy?

**Output:** Feature categorization matrix

**Key Question:** What can we build that competitors can't easily replicate in 6 months?

---

### Step 3: Define MVP Scope
**Goal:** Ruthlessly prioritize to minimize time-to-learning

**Framework:**
```
Must-Have = (Table Stakes) + (Top 1-2 Unique Differentiators)
Nice-to-Have = (Common features that improve UX but don't differentiate)
Out of Scope = Everything else
```

**Anti-Patterns to Avoid:**
- ❌ "If we just add X, we'll beat competitor Y" — feature parity race loses
- ❌ "Users might want X" — unvalidated nice-to-haves bloat scope
- ❌ "We can build X in v2" without defining trigger — deferred decisions pile up

**Validation Rules:**
- Every Must-Have feature answers: "What validated user problem does this solve?"
- Every Nice-to-Have has data: "What % of users requested this?"
- Every Out-of-Scope has reasoning: "Why not MVP?" (cite research if available)

**Output:** 3-tier scope definition with rationale (see product-plan.md §1)

---

### Step 4: Epic Breakdown (Problem → Feature → User Story)
**Goal:** Convert scope into shippable increments

**Structure:**
```
Epic = cohesive user goal (e.g., "Plan a realistic day")
  ├─ User Story 1 (e.g., "Generate daily plan")
  ├─ User Story 2 (e.g., "Explain recommendations")
  └─ User Story 3 (e.g., "Override recommendations")
```

**User Story Template:**
```
As a [persona]
I want to [action]
So that [outcome/value]

Acceptance Criteria:
- [Measurable criterion 1]
- [Measurable criterion 2]
- [Edge case handling]
```

**Tips:**
- Each story should be completable in 1-5 days (3-8 points)
- Stories within an epic should tell a coherent journey
- Acceptance criteria = contract with engineering ("done" means...)
- Include edge cases (offline, errors, empty states)

**Output:** 5-7 Epics with 3-5 User Stories each (see product-plan.md §2)

---

### Step 5: Prioritize Backlog (Dependencies + Risk + Value)
**Goal:** Sequence work to maximize learning and minimize waste

**Prioritization Algorithm:**
1. **Phase 0 (Discovery):** User interviews, prototype validation
   - Goal: De-risk top assumptions before building
   - Exit criteria: ≥70% of interviewees validate core thesis

2. **Phase 1 (MVP Build):** 
   - Sprint 1: Table stakes (foundation)
   - Sprint 2-3: Hero differentiators
   - Sprint 4: Habit formation (notifications, reflection)

3. **Phase 2 (Beta Hardening):** Performance, error handling, QA

4. **Phase 3 (Launch Prep):** Onboarding, observability, pricing

**Dependency Mapping:**
- Technical dependencies: Story B requires Story A complete
- Learning dependencies: Must validate X before building Y
- Resource dependencies: Need designer for sprint 2

**Output:** Sequenced backlog with sprint goals (see product-plan.md §3)

---

### Step 6: Define Success Metrics
**Goal:** Know what "good" looks like before you build

**Framework (AARRR):**
- **Activation:** Did user complete key setup steps? (e.g., ≥10 tasks created, ≥3 plans generated)
- **Engagement:** Are they using hero features? (e.g., ≥4 days/week plan usage)
- **Retention:** Do they come back? (e.g., Week-4 retention ≥25%)
- **Quality/Trust:** Do they trust the system? (e.g., plan usefulness rating ≥4.2/5)

**Avoid Vanity Metrics:**
- ❌ "Total tasks created" — doesn't predict retention
- ✅ "Tasks created in first 7 days" — predicts activation

**Output:** Metrics dashboard definition (see product-plan.md §4)

---

### Step 7: Risk Register & Open Decisions
**Goal:** Surface blockers and decision points upfront

**Risk Template:**
| Risk | Severity | Mitigation | Owner | Status |
|------|----------|------------|-------|--------|
| Crowded competitive space | HIGH | Lead with unique differentiators | Product + Marketing | ✅ Addressed |

**Open Decision Template:**
| Decision | Options | Recommendation | Needed By | Stakeholders |
|----------|---------|----------------|-----------|--------------|
| Pricing model | Freemium / Trial / Lifetime | Freemium + lifetime | Week 2 | Product + CEO |

**Output:** Risk register + open decisions (see product-plan.md §5)

---

## Outputs

### Deliverable: Product Plan Document
Includes:
1. Executive Summary (vision → MVP scope decisions)
2. MVP Scope Definition (Must/Nice/Out + rationale)
3. Product Epics (with user stories + acceptance criteria)
4. Prioritized Backlog (phased, with sprint goals)
5. Success Metrics (activation, engagement, retention, quality)
6. Risk Register & Open Decisions
7. Release Criteria (launch checklist)
8. Post-Launch Roadmap (v2 planning)

### Deliverable: Decision Log
Documents key scope/architecture/platform decisions with rationale for future reference.

### Deliverable: Interview Guide (if Phase 0 discovery)
Structured script to validate assumptions with target users before building.

---

## Anti-Patterns (What NOT to Do)

### 1. "Build Everything" Trap
**Symptom:** MVP includes 50+ user stories; timeline is 6+ months  
**Fix:** Cut scope to top 2 differentiators + table stakes only. Ship in 6-8 weeks.

### 2. Feature Parity Trap
**Symptom:** "Competitor X has Y, so we need it too"  
**Fix:** Only build features that support your unique positioning. Let competitors keep their features.

### 3. Unvalidated Assumptions
**Symptom:** PRD says "Users want X" with no data  
**Fix:** Phase 0 discovery to validate assumptions before building. Better to learn you're wrong in Week 2 than Week 20.

### 4. Deferred Decision Debt
**Symptom:** "We'll decide pricing later" → blocks monetization work  
**Fix:** Force decisions by attaching deadlines and owners. Escalate blockers early.

### 5. Vanity Scope
**Symptom:** "It would be cool if..." or "This is easy to add..."  
**Fix:** Every feature needs validated user problem + market gap. No exceptions.

---

## Example: Focus OS Product Plan

### Validated Assumptions
- ✅ **Problem:** "To-do apps store but don't help execute" — validated by Motion (1M+ users), Sunsama (NYT Wirecutter), Amazing Marvin (4.8⭐), HBR research
- ✅ **Personas:** Overwhelmed Professional (66% burnout), Student (30% Gen Z daily anxiety), ADHD (Marvin validates demand)
- ✅ **Gaps:** Behavioral intelligence (no competitor has full loop) + explainable AI (market restraint: -0.7%)

### MVP Scope Decisions
- ✅ **Must-Have:** Daily Plan Engine, Postponement Loop Breaker, explainable recommendations, PWA, notifications
- 🚫 **Deferred to v2:** Custom MCP integrations (no competitor launched with this; use Zapier initially)
- 🚫 **Out of Scope:** Team collaboration, public API, native mobile (PWA first)

### Key Differentiators
1. **Postponement Loop Breaker** — detect → diagnose → intervene → adjust plan (no competitor has full loop)
2. **Explainable AI** — per-task reasoning strings (addresses trust gap; 54% of employees worried about AI safety)

### Success Metrics
- Activation: ≥60% create ≥10 tasks, ≥40% generate ≥3 plans (Week 1)
- Engagement: ≥4 days/week plan usage, +15% completion rate (after 4 weeks)
- Retention: ≥25% Week-4 retention
- Trust: ≥4.2/5 plan usefulness rating

### Timeline
- Phase 0 (Week 1-2): User interviews + prototype validation
- Phase 1 (Week 3-8): MVP build (4 sprints)
- Phase 2 (Week 9-11): Beta hardening
- Phase 3 (Week 12-13): Launch prep

**Result:** 13-week MVP instead of 6+ month "feature parity" death march.

---

## Skill Meta

**Created:** 2026-03-21  
**Author:** Kobayashi (Product Owner)  
**Based on:** Focus OS product planning (document/product/product-plan.md)  
**Related Skills:** User story writing, competitive analysis, MVP scoping  
**Update Trigger:** When product planning process changes or new anti-patterns discovered
