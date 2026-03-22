# History: Verbal

## Learnings

### 2026-03-21: Market Research Analysis
**Context:** Analyzed market-research.md and prd.md to validate user personas and feature priorities.

**Key Architecture Decisions:**
- Behavioral intelligence (postponement loop detection) is our primary differentiator — no competitor offers full loop
- Explainable AI (per-task "why" strings) is our secondary moat — addresses market restraint (-0.7% impact)
- MCP integrations should be deferred to v2; use Zapier/Make initially (no competitor launched with custom integrations)
- PWA approach (not web-only) is critical — daily planning is inherently mobile

**User Preferences Discovered:**
- Users want AI help but demand transparency (54% worried about using AI safely)
- "Recommended 5" beats "Today's 5" — soft guidance, not prescription
- Capacity warnings work; hard limits frustrate
- Optional features must LOOK optional (energy tags, reflection)
- Trust requires explainability + user control + realistic plans

**Key File Paths:**
- `/document/product/market-research.md` — comprehensive competitive and user data
- `/document/product/prd.md` — product requirements and scope
- `/document/product/user-research-insights.md` — NEW: user-centered analysis and recommendations

**Patterns:**
- Overwhelmed Professional persona (P1) is strongly validated: 66% burnout, 70% distraction, 80% productivity anxiety
- Gen Z productivity anxiety (30% daily, 58% several times/week) validates Student/Knowledge Worker persona (P2)
- ADHD/Executive Dysfunction persona (P3) validated by Amazing Marvin success (4.8 stars, niche dominance)
- Competitive gap matrix shows behavioral intelligence + explainable AI are least addressed by competitors

**Product Insights:**
- Motion (1M+ users) = opaque AI, full auto-scheduling
- Sunsama = calm rituals, shutdown ritual, soft capacity warnings (our model)
- Amazing Marvin = extreme customization, procrastination wizard, ADHD focus
- Akiflow = universal inbox, time-blocking, YC-backed
- Focus OS positioning: behavioral intelligence + explainable AI (unfilled gap)

### 2026-03-21: Technical Foundation
**Context:** MVP infrastructure setup.
**Update:**
- Database schema established (User, Task, DailyPlan, Reflection).
- Supports data collection for behavioral intelligence (postponement tracking).
- Enables future user research on plan adherence and reflection patterns.

### 2026-03-21: Decision Authored
- **User Insights Decision**: Recommended MVP feature prioritization focusing on behavioral intelligence and explainable AI.
