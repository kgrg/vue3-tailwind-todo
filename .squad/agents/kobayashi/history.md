# History: Kobayashi

## Learnings

### Product Plan Creation (2026-03-21)
**Context:** Turned market research + PRD vision into actionable product backlog

**Key Decisions:**
1. **MVP Scope Adjustment:** Deferred custom MCP integrations/workflows to v2 based on market research showing no comparable startup (Sunsama, Marvin, Akiflow) launched with custom workflow engines. Redirected engineering to behavioral intelligence + explainable AI to maximize differentiation.

2. **Hero Differentiators Identified:** 
   - Postponement Loop Breaker (behavioral intelligence) — no competitor offers full "detect → diagnose → intervene → adjust plan" loop
   - Explainable AI recommendations — per-task reasoning strings address trust gap (market restraint: -0.7% per Mordor Intelligence)

3. **Platform Strategy Shift:** Changed from web-only to PWA (Progressive Web App) from day one. All direct competitors have mobile apps; use case is mobile-first (morning planning, between meetings, commute). Risk: web-only misses 50%+ of key decision moments.

4. **Capacity Model Refinement:** Changed from hard "Today's 5" limit to soft "Recommended 5" with capacity warnings. Research shows Sunsama uses soft warnings successfully; hard limits may frustrate power users with 20+ genuine daily obligations.

5. **Privacy Posture Defined:** Added explicit behavioral data consent flow to address tension between "minimal data collection" claims and behavioral intelligence requirements. Aligned with GDPR Art. 6(1)(a) consent requirements and EU AI Act transparency mandates.

**Architecture Insights:**
- Task data model needs `postpone_count` field and intervention history tracking
- Daily Plan Engine = rule-based scoring in MVP (urgency + capacity fit + avoidance signals + energy match + historical completion capacity)
- Postponement Loop Breaker requires task state machine: active → stuck (≥3 postpones) → intervention → resolution

**Key File Paths:**
- Product source of truth: `/document/product/prd.md`
- Market validation data: `/document/product/market-research.md`
- Actionable backlog: `/document/product/product-plan.md` (NEW)

**User Preferences Discovered:**
- Target personas validated: Overwhelmed Professional (66% burnout rate), Student/Knowledge Worker (30% Gen Z daily productivity anxiety), ADHD/Executive Dysfunction (Amazing Marvin's 4.8⭐ rating validates demand)
- Explainability is critical for trust — 54% of employees worried about using AI safely
- Mobile-first is non-negotiable — daily planning happens in morning routine, between meetings, during commute

**Risks Identified:**
- Crowded competitive space (HIGH): Motion 1M+ users, Sunsama NYT-backed, Amazing Marvin 4.8⭐
- Consumer monetization challenge (MEDIUM-HIGH): Large enterprises hold 54.6% of task management market revenue
- Behavioral data collection creates privacy/compliance overhead (MEDIUM): GDPR + EU AI Act apply

**Open Decisions (require stakeholder input):**
1. Pricing model: Freemium vs. free trial vs. lifetime option (decision needed by Week 2)
2. Behavioral intelligence placement: Free tier (trust) vs. Premium (monetization)
3. Platform priority: PWA sufficient vs. commit to native mobile for v1.1
4. Integration priority for v2: Google Calendar vs. GitHub vs. Gmail vs. Slack
5. Guest mode vs. mandatory sign-in

**Success Metrics Defined:**
- Activation: ≥60% create ≥10 tasks, ≥40% generate plan ≥3x in Week 1
- Engagement: ≥4 days/week plan usage, +15% completion rate after 4 weeks
- Retention: ≥25% Week-4 retention (consumer), ≥40% (teams pilot)
- Trust: ≥4.2/5 plan usefulness rating, ≤35% override rate after learning period

**Backlog Structure:**
- Phase 0 (Week 1-2): Discovery — 10-15 user interviews, validate scoring logic, UX prototype
- Phase 1 (Week 3-8): MVP Build — 4 sprints covering Task Foundation, Daily Plan Engine, Loop Breaker, Reflection
- Phase 2 (Week 9-11): Beta Hardening — performance, sync, error handling, QA automation
- Phase 3 (Week 12-13): v1 Launch Prep — onboarding, observability, pricing experiments

**Next Steps:**
- Conduct Phase 0 user interviews (validate plan engine logic, postponement prompts, willingness-to-pay)
- Resolve open decisions §5.3 (pricing, behavioral intelligence placement, platform priority)
- Technical feasibility review with Keaton (sync architecture, offline strategy, PWA limitations)

### 2026-03-21: Architecture Alignment
**Context:** Technical foundation for product plan established.
**Update:**
- Backend team initialized SQLite database with Prisma.
- Schema now supports `Task`, `DailyPlan`, and `Reflection` entities as defined in PRD.
- Enables development of Daily Plan Engine and Postponement Loop Breaker.

### 2026-03-21: Decision Authored
- **Product Plan & MVP Scope**: Defined key decisions including deferring MCP, PWA strategy, soft capacity warnings, and privacy posture.
