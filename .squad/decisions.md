# Decision Log

## Architecture
- **[2026-03-21]** Team Init: Focus OS team established with 11 members + Scribe/Ralph.
- **[2026-03-21]** Database Layer: Initialized Prisma/SQLite. Unified Task/Activity model. (Fenster)
---
date: 2026-03-21
author: Keaton (Technical Lead)
status: pending_review
stakeholders: [Kobayashi, McManus, Fenster, Baer]
---

# Decision: Defer MCP Integrations to Phase 2

## Context
The PRD (v0.3) includes custom MCP integrations and workflow rules engine as "Nice-to-Have" for MVP. Analysis of market research shows no competitor (Sunsama, Motion, Akiflow) launched with custom integrations—all relied on Zapier initially.

## Problem
Custom MCP integrations add:
- 30-40 engineering days (5-7 days per provider)
- Significant security surface (OAuth token storage, webhook validation)
- Ongoing maintenance burden (provider API changes)
- Does not differentiate (Zapier/Make already exist)

Meanwhile, core differentiators (behavioral intelligence + explainable AI) remain unvalidated.

## Decision
**Defer custom MCP integrations and workflow rules engine to Phase 2.**

Use Zapier/Make for MVP automation instead.

## Rationale
1. **Competitive validation:** Market research confirms no comparable startup launched with custom integrations (§8 Risk 6)
2. **Focus on moat:** Behavioral intelligence (postponement detection) and explainable AI are true differentiators
3. **Timeline:** Saves 30-40 days = allows proper testing infrastructure and sync conflict resolution
4. **Risk reduction:** Offloads OAuth complexity and security concerns to proven third-party platform

## Consequences
**Positive:**
- MVP timeline: 13-16 weeks instead of 18-20 weeks
- Team can focus on Daily Plan Engine scoring quality
- Reduced security surface for v1

**Negative:**
- Users who require custom workflows must use Zapier (paid tier)
- Competitive perception: "no native integrations" vs. Motion/Sunsama
- Must build integration adapters later (not wasted, but deferred work)

**Mitigation:**
- Market clearly as "Zapier-compatible" in MVP
- Plan Phase 2 native integrations based on actual user demand (top 2-3 providers)
- Keep integration adapter architecture in mind when designing Task data model

## Open Questions
1. Does Kobayashi accept this trade-off for MVP?
2. Which Zapier triggers should we document/support in launch materials?
3. Should we build a public API in Phase 2 to enable Zapier Pro features?

## Status
**Pending:** Awaiting Kobayashi approval

## Related Artifacts
- `/document/product/technical-feasibility-analysis.md` §2.8
- `/document/product/market-research.md` §8 Risk 6
- `/document/product/prd.md` §7 (MCP Integrations section)
---
date: 2026-03-21
author: Keaton (Technical Lead)
status: pending_review
stakeholders: [Fenster, Kobayashi]
---

# Decision: Add SQLite + Prisma in Phase 0

## Context
Current API backend (`apps/api/`) uses in-memory data storage (Express + JavaScript objects). No persistence across server restarts.

The PRD requires:
- Behavioral intelligence (postponement tracking across sessions)
- Historical completion data (rolling 14-day averages)
- Reflection storage (weekly summaries)
- Audit logging (for future integrations)

In-memory storage cannot support these features.

## Problem
Behavioral intelligence is the **core differentiator** of Focus OS. Without persistent storage:
- Cannot track postponement counts across sessions
- Cannot calculate historical completion capacity
- Cannot generate weekly reflection summaries
- Cannot audit workflow runs (if MCP is added later)

## Decision
**Add SQLite + Prisma ORM in Phase 0 (pre-MVP infrastructure work).**

Migration path:
1. Design Prisma schema for core entities (Task, DailyPlan, UserSettings, etc.)
2. Migrate in-memory Express routes to Prisma queries
3. Keep Pinia store API surface unchanged (internal refactor only)

## Rationale
1. **Feature necessity:** Behavioral intelligence impossible without persistence
2. **SQLite simplicity:** Zero-ops, file-based, perfect for MVP scale (<1000 users)
3. **Prisma type safety:** TypeScript-native ORM, automatic migrations, works with both SQLite and PostgreSQL (Phase 2+ migration path)
4. **Non-breaking:** API contracts remain unchanged, only backend implementation changes

## Technology Choice: Why SQLite?
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| SQLite | File-based, zero config, fast for small scale | Limited concurrency (~100 RPS writes) | ✅ **MVP** |
| PostgreSQL | Production-grade, scales infinitely | Requires hosting, ops overhead | Phase 2+ |
| MongoDB | Flexible schema | Not needed, adds complexity | ❌ |

SQLite is industry-proven for MVP scale (e.g., GitHub uses SQLite for internal tools, Litestream enables SQLite replication).

## Consequences
**Positive:**
- Enables behavioral intelligence features
- Type-safe database queries (Prisma)
- Easy migration to PostgreSQL later (Prisma supports both)
- Proper data modeling reduces tech debt

**Negative:**
- 1 week of Phase 0 work (schema design + migration)
- Learning curve for Prisma (if team unfamiliar)
- SQLite concurrency limits may require PostgreSQL sooner (but not blocking for MVP)

**Mitigation:**
- Fenster leads Prisma schema design (backend ownership)
- Keaton reviews schema for alignment with Daily Plan Engine needs
- Document migration commands for local dev setup

## Timeline
- **Week 1:** Schema design (Tasks, DailyPlan, UserSettings, PostponeEvent, Reflection)
- **Week 2:** Migrate Express routes to Prisma + test

**Estimated effort:** 5-7 days (Fenster + Keaton pairing)

## Open Questions
1. Should we use Prisma migrations or raw SQL for schema changes? (Recommend Prisma migrations for type safety)
2. Where should SQLite file live in development? (`apps/api/data/dev.db`?)
3. Do we need database seeding scripts for testing? (Recommend yes)

## Status
**Pending:** Awaiting Kobayashi acknowledgment (non-technical approval, timeline impact)

## Related Artifacts
- `/document/product/technical-feasibility-analysis.md` §3.1
- `/apps/api/` - Current Express backend
- Prisma docs: https://www.prisma.io/docs/getting-started
---
date: 2026-03-21
author: Keaton (Technical Lead)
status: pending_review
stakeholders: [Kobayashi, McManus, Fenster]
---

# Decision: Clarify Tasks vs Activities Domain Model

## Context
The codebase has two overlapping domain concepts:
- `apps/web/src/modules/tasks/` - Legacy todo system (Composition API store)
- `apps/web/src/modules/activities/` - Main work items (Options API store)

The PRD uses "task" terminology but custom instructions reference "activities" as the primary domain. TodayPage.vue is flagged as a "legacy hotspot."

## Problem
Building the Daily Plan Engine requires a clear domain model:
- Which entity should the scoring algorithm operate on?
- Should we unify tasks + activities into one concept?
- Does "activity" mean work item, or does it have different semantics?

**Ambiguity creates risks:**
- Duplicate features across modules
- Inconsistent state management
- User confusion (why two ways to create work?)

## Decision
**Required before Phase 1 kickoff:**

Kobayashi must decide:
1. **Unify:** Merge tasks into activities (or vice versa)
2. **Specialize:** Keep both, define clear boundaries (e.g., "activities" = planned work, "tasks" = quick todos)
3. **Deprecate:** Remove one module entirely

**Keaton's recommendation:** **Unify into a single "Task" entity** with optional metadata (effort, energy, etc.). Simplicity wins for MVP.

## Rationale
1. **Daily Plan Engine complexity:** Cannot score across two different domain models
2. **User mental model:** "Task" is universal terminology (validated by competitor research: Motion, Todoist, TickTick all use "task")
3. **Tech debt:** Two overlapping systems will only get harder to reconcile post-launch

## Consequences
**If unified:**
- Clearer architecture
- Easier onboarding for McManus/Fenster
- One state management pattern
- Must migrate existing data (if any users exist)

**If specialized:**
- More complex but flexible
- Requires clear docs on when to use each
- Daily Plan Engine must handle both types

**If deferred:**
- Risk of building Daily Plan Engine on wrong abstraction
- Potential rework in Phase 2

## Timeline Impact
- **Unify:** 3-5 days (schema design + component refactor)
- **Specialize:** 2 days (document boundaries)
- **Defer:** 0 days upfront, unknown rework cost later

## Open Questions
1. Does "activity" have semantic meaning beyond "task"? (e.g., project-level vs. atomic work?)
2. Are there existing users with production data? (Affects migration complexity)
3. Is TodayPage.vue truly legacy, or is it the canonical daily view? (Impacts UI refactor scope)

## Status
**Blocking Phase 1 kickoff:** Kobayashi must decide by end of Week 1.

## Related Artifacts
- `/apps/web/src/modules/tasks/` - Legacy module
- `/apps/web/src/modules/activities/` - Current module
- `/apps/web/src/pages/TodayPage.vue` - Flagged as "legacy hotspot"
- `/.github/copilot-instructions.md` - References "activities represent main work items"
- `/document/product/prd.md` §9.1 - Defines "Task" entity
# Decision: Product Plan & MVP Scope
**Date:** 2026-03-21  
**Author:** Kobayashi (Product Owner)  
**Context:** Analysis of market research + PRD to define actionable product backlog  
**Status:** Proposed — requires team approval for open decisions

---

## Decisions Made

### 1. Defer Custom MCP Integrations to v2
**Decision:** Remove custom MCP integrations and workflow engine from MVP scope. Use Zapier/Make for initial automation needs.

**Rationale:**
- Market research (§8 Risk 6): "No comparable startup launched with custom workflow engines. Sunsama, Marvin, and Akiflow relied on Zapier initially."
- Engineering resources better spent on behavioral intelligence + explainable AI (our unique differentiators)
- Reduces MVP complexity and time-to-market

**Impact:**
- MVP timeline reduced by ~2-3 weeks
- v2 roadmap must include integration strategy decision (see Open Decision #4)

---

### 2. Platform Strategy: PWA from Day One
**Decision:** Ship as Progressive Web App (PWA) — installable, offline-capable, mobile-optimized — instead of web-only.

**Rationale:**
- Market research (§8 Risk 5): "All competitors have native mobile apps. Daily planning and quick capture are mobile interactions. Web-only risks missing key decision moments (morning routine, between meetings, commute)."
- PWA provides mobile experience without native app complexity in MVP
- Can evaluate native iOS/Android for v1.1 based on beta feedback

**Impact:**
- Sprint 1 includes PWA setup (E6.US1) and mobile-first UI (E6.US2)
- Architecture must support offline-first sync (IndexedDB + service workers)

---

### 3. Capacity Model: Soft Warnings, Not Hard Limits
**Decision:** Change from hard "Today's 5" limit to "Recommended 5" with soft capacity warnings.

**Rationale:**
- Market research (§8 Risk 3): "Users with 20+ genuine daily obligations may find it restrictive. Sunsama found success with soft warnings rather than hard limits."
- Preserves user agency while still encouraging realistic planning
- Reduces friction for power users

**Impact:**
- Daily Plan Engine UI includes capacity warnings (E2.US3)
- Warning is dismissible: "You're over capacity (5h 30min planned, 4h available). Continue?"

---

### 4. Privacy Posture: Explicit Behavioral Data Consent
**Decision:** Add granular behavioral data consent flow to onboarding (E7.US2).

**Rationale:**
- Market research (§8 Risk 4): "Section 10 claims 'minimal data collection' but behavioral intelligence requires extensive tracking (postponement counts, plan overrides, completion patterns). GDPR + EU AI Act create compliance overhead."
- Transparency builds trust; 54% of employees worried about using AI safely (§6.2)
- Legal requirement for GDPR Art. 6(1)(a) consent

**Impact:**
- Onboarding wizard includes consent screen (checkboxes for completion tracking, postponement tracking, estimate accuracy)
- Link to full Privacy Policy required
- Legal review required before Phase 3 launch

---

### 5. Hero Differentiators: Behavioral Intelligence + Explainable AI
**Decision:** Position Postponement Loop Breaker and explainable recommendations as primary competitive moat.

**Rationale:**
- Market research (§3.4): "No major competitor offers the full behavioral intelligence loop: detect postponement → diagnose cause → suggest intervention → adjust plan."
- Market research (§4.2): "No major player currently combines AI assistance with per-task reasoning transparency."
- These are the two gaps competitors don't address; everything else is validated but crowded

**Impact:**
- Marketing messaging emphasizes "get unstuck" + "know why every task is recommended"
- Both features must be P0 (blocking) for v1 launch
- Informs pricing strategy: explainable AI in free tier (trust), Loop Breaker in premium (value)

---

## Open Decisions (Require Stakeholder Approval)

### Decision #1: Pricing Model
**Options:**
1. Freemium: Free tier (basic lists) + Pro ($10-15/mo) for AI + Loop Breaker
2. Free Trial → Paid: 14-day trial, then $10-15/mo (all features)
3. Lifetime Option: Add $200-300 lifetime tier (Amazing Marvin validates this)

**Recommendation:** Freemium with Pro at $12/mo + $250 lifetime option for early adopters.

**Decision Needed By:** End of Phase 0 (Week 2)  
**Stakeholders:** Kobayashi (Product) + CEO

---

### Decision #2: Behavioral Intelligence Placement
**Tension:** Explainability builds trust (should be free) vs. Loop Breaker is hero feature (premium value)

**Options:**
1. All Free: Explainable AI + Loop Breaker in free tier
2. Split: Explainable AI free, Loop Breaker premium
3. All Premium: Both features locked to Pro

**Recommendation:** Option 2 (Split). Explainable AI in free tier differentiates immediately; Loop Breaker as premium provides clear upgrade value.

**Decision Needed By:** End of Phase 0 (Week 2)  
**Stakeholders:** Kobayashi (Product) + CEO

---

### Decision #3: Platform Priority Post-MVP
**Question:** Should we commit to native iOS/Android for v1.1 (3 months post-launch)?

**Recommendation:** Defer decision to end of Phase 2 (Week 11). If beta users report PWA friction (install confusion, performance issues), prioritize native. Otherwise, PWA v1 → native v1.1.

**Decision Needed By:** End of Phase 2 (Week 11)  
**Stakeholders:** Kobayashi (Product) + CTO

---

### Decision #4: First Integration for v2
**Options (ranked by research):**
1. Google Calendar (meeting follow-ups → tasks)
2. GitHub (assigned issues → tasks)
3. Gmail (starred emails → tasks)
4. Slack (saved messages → tasks)

**Recommendation:** Google Calendar. Overwhelmed Professional persona has 11.3 hrs/week in meetings; "meeting ran over" expected as top blocker.

**Decision Needed By:** Week 10 (Phase 2)  
**Stakeholders:** Kobayashi (Product)

---

### Decision #5: Guest Mode vs. Mandatory Sign-In
**Options:**
1. Mandatory sign-in: All users create account (email/SSO)
2. Guest mode: Use locally, optional upgrade to sync account later

**Recommendation:** Mandatory sign-in. Behavioral intelligence requires longitudinal data (can't work device-only). Competitors (Motion, Sunsama) all require sign-in. Signup friction overblown for target personas.

**Decision Needed By:** End of Phase 0 (Week 2)  
**Stakeholders:** Kobayashi (Product) + Growth

---

## Dependencies & Blockers

### External Dependencies
- User recruiting for Phase 0 interviews (Marketing) — **HIGH risk, blocks discovery**
- Legal review: GDPR compliance (Legal) — **MEDIUM risk, blocks Phase 3 launch**

### Internal Blockers
- Pricing model undecided — blocks paywall implementation (L2)
- Backend architecture undecided — CTO to propose sync + offline strategy (Week 1)

---

## Team Impact

**Affected Teams:**
- Engineering: Scope changes reduce complexity (remove MCP engine); add PWA + offline sync
- Design: Need mobile-first UI patterns, onboarding wizard, consent flow
- Marketing: Positioning shifts to behavioral intelligence + explainable AI
- Legal: Privacy policy review required for behavioral data consent

**Next Actions:**
1. Keaton (Tech Lead): Review technical feasibility of PWA + offline sync architecture
2. Marketing: Recruit 10-15 users for Phase 0 interviews (target: Overwhelmed Professionals 60%, Students 30%, ADHD 10%)
3. Legal: Review GDPR compliance requirements for behavioral data consent flow
4. CEO: Approve pricing model and behavioral intelligence placement decisions (by Week 2)

---

**Approval Status:**
- [ ] Kobayashi (Product Owner)
- [ ] Keaton (Tech Lead) — technical feasibility review pending
- [ ] CEO — pricing + scope decisions pending
- [ ] Legal — GDPR review pending
# User Insights Decision — MVP Feature Prioritization
**Decision Owner:** Verbal (User Research)  
**Date:** 21 March 2026  
**Status:** PROPOSED (requires Product review)  
**Stakeholders:** Kobayashi (Product), Rabin (Design), Edie (Copy)

---

## Decision Summary

Based on market research analysis, I recommend the following MVP feature prioritization and design principles to maximize user trust and differentiation.

---

## Key Decisions

### 1. Lead with Behavioral Intelligence + Explainable AI
**Rationale:**
- These are the ONLY two gaps no major competitor addresses fully
- Motion (1M+ users) has opaque AI → users can't understand recommendations
- Amazing Marvin has procrastination wizard but no auto-plan adjustment
- Sunsama has reflection but no causal "why tasks slip" analysis

**User evidence:**
- 54% of employees worried about using AI safely (Pew Research, 2025)
- AI explainability is a -0.7% market restraint (Mordor Intelligence, 2026)
- 80% of employees experience productivity anxiety → trust is critical

**Recommendation:**
- Every Daily Plan task MUST show "why" explanation string
- Postponement Loop Breaker MUST be in MVP (hero differentiator)
- Marketing should lead with "we explain every recommendation" positioning

---

### 2. Defer MCP Integrations to v2
**Rationale:**
- No comparable startup launched with custom integrations
- Sunsama, Amazing Marvin, Akiflow all used Zapier initially
- Integration fatigue is a -2.2% market restraint
- Engineering time better spent on behavioral intelligence

**User evidence:**
- Users want integrations, but they're not a blocker for adoption
- Core pain is "too many tasks, don't know what to do today" (not "tasks scattered across tools")

**Recommendation:**
- Use Zapier/Make for MVP automation
- Add native integrations post-product-market-fit (Phase 2)
- Redirect saved engineering time to Postponement Loop Breaker

---

### 3. Change "Today's 5" to "Recommended 5" (Soft Guidance)
**Rationale:**
- Users with 20+ genuine obligations will bounce if they hit hard limits
- Sunsama found success with soft "over capacity" warnings, not hard caps
- 66% burnout rate means users already feel guilty — don't add more

**User evidence:**
- "I have 12 meetings today. Your app says I can only do 5 tasks. That's not helpful."
- Users want guidance, not prescription
- Trust requires agency

**Recommendation:**
- Change language from "Today's 5" to "Recommended 5"
- Capacity warning: "You're over capacity — are you sure?" (allow override)
- Don't hard-cap task count

---

### 4. Energy Tags Must Be Optional
**Rationale:**
- 66% burnout validates energy management need
- But no competitor has successfully productized energy matching
- Users may find it annoying to tag every task
- Energy fluctuates unpredictably (illness, stress, sleep)

**User evidence:**
- "I love the idea but I'm too overwhelmed to think about task energy levels."
- Optional features that become mandatory kill trust

**Recommendation:**
- Energy tags optional in MVP
- Daily Plan engine works WITHOUT energy data
- Energy matching is enhancement, not requirement

---

### 5. Ship as PWA from Day One (Mobile-Critical)
**Rationale:**
- Daily planning, quick capture, and between-meeting checks are mobile interactions
- All competitors (Motion, Sunsama, Akiflow) have mobile apps
- Morning routine and commute are key decision moments

**User evidence:**
- Users check plans between meetings on phones
- "Where's the app?" is likely early feedback if we ship web-only

**Recommendation:**
- PWA (installable, offline-capable) from MVP launch
- Validate mobile usage patterns in beta
- Evaluate native apps for Phase 2 based on data

---

### 6. Reflection Must Be Skippable
**Rationale:**
- Overwhelmed users won't tolerate mandatory reflection
- End-of-day check-in is valuable but not core to Daily Plan loop
- Sunsama's shutdown ritual is optional

**User evidence:**
- 80% productivity anxiety → users don't want more guilt
- Forced reflection destroys trust ("another thing to manage")

**Recommendation:**
- End-of-day check-in is OPTIONAL
- Weekly summary auto-generated (no user action required)
- Don't nag or guilt users who skip reflection

---

## Design Principles (For Rabin and Edie)

### Tone Principles:
1. **Guide, don't prescribe** — "Recommended 5" not "Today's 5"
2. **Explain, don't command** — "Due tomorrow" beats "High urgency score"
3. **Empathize, don't judge** — "Why is this stuck?" not "Why haven't you done this?"
4. **Warn, don't block** — "You're over capacity — are you sure?" allows override
5. **Support, don't solve** — "Focus OS supports overwhelm recovery" (not "solves productivity")

### UI Principles:
1. Explainability is UI, not just text — "why" strings must be visible
2. Optional features must LOOK optional — energy tags can't feel mandatory
3. Capacity warnings need careful tone — guide, don't guilt
4. Postponement prompts are interventions — design for empathy
5. Mobile-first interactions — daily planning happens on phones

---

## Open Questions for Product (Kobayashi)

1. **Pricing strategy:** Is behavioral intelligence free tier or premium? Freemium vs. trial?
2. **Privacy consent:** How granular? Opt-in at onboarding? Per-feature toggles?
3. **Phase 0 interviews:** When do we recruit 10-15 users for validation?
4. **Beta timeline:** When do we validate mobile usage patterns?

---

## Impact if Not Addressed

- **Opaque AI:** Users bounce due to lack of trust (54% worried about AI safety)
- **Hard limits:** Power users bounce ("I have 20 tasks, app says 5 max")
- **Mandatory features:** Overwhelmed users abandon ("another thing to manage")
- **Web-only:** Miss key decision moments (morning routine, between meetings)
- **MCP in MVP:** Delays core differentiation (behavioral intelligence)

---

## Next Steps

1. **Kobayashi (Product):** Review and approve/adjust prioritization
2. **Rabin (Design):** Apply tone principles to prototype (Phase 0)
3. **Edie (Copy):** Draft "why" explanation strings and capacity warning language
4. **Verbal (Me):** Develop Phase 0 interview script based on this analysis

---

**Related Docs:**
- `/document/product/user-research-insights.md` — full analysis
- `/document/product/market-research.md` — data sources
- `/document/product/prd.md` — product requirements
