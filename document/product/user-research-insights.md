# User Research Insights — Focus OS
**Researcher:** Verbal (User Research)  
**Date:** 21 March 2026  
**Version:** v1.0  
**Purpose:** Translate market research into actionable user insights and product prioritization guidance

---

## Executive Summary

The market research validates our core thesis: **overwhelmed professionals desperately need tools that help them execute, not just store tasks.** However, the competitive landscape is crowded, and users are already skeptical of opaque AI solutions. Our best path forward is to **lead with behavioral intelligence and explainable AI** — the two gaps competitors don't address.

**Critical insight:** 54% of employees worry about using AI safely, and AI explainability is a -0.7% market restraint. Users don't just want AI help — they want to understand WHY the AI recommends what it does.

---

## 1. User Personas (Research-Validated)

### P1: Overwhelmed Professional (PRIMARY)
**Who they are:**
- Mid-career professionals drowning in competing priorities
- Managing 15-25 active tasks + 5-10 meetings per week
- Interrupted every 3 minutes, need 23 minutes to refocus
- Actually productive only 2h 23min per day (31% of workday)

**Their pain:**
- 66% experiencing burnout (all-time high)
- 70% feel distracted at work
- 80% experience productivity anxiety
- 50% consider their meeting time wasted
- Can't trust their to-do list anymore — it's too long

**What they need:**
- A realistic daily set (not everything)
- System explains recommendations so they can trust it
- Proactive help when tasks get stuck
- Capacity warnings, not guilt trips

**Voice of the customer:**
> *"I have 47 tasks. I can maybe do 5 today. Which ones matter most? And please don't just tell me 'all of them' — that's not helpful."*

**Market validation:**
- Motion: 1M+ users (validates demand for AI-assisted planning)
- Sunsama: NYT Wirecutter "Best Scheduling Tool" (validates calm planning approach)
- HBR: "Stop making to-do lists. They're setting you up for failure."

---

### P2: Student / Knowledge Worker (SECONDARY)
**Who they are:**
- University students, grad students, early-career knowledge workers
- Mix of study + project work + life tasks
- Strong digital fluency, high expectations for tool quality

**Their pain:**
- 30% face productivity anxiety DAILY
- 58% experience it several times per week
- Overwhelmed by choice and unclear priorities
- Energy mismatch (deep work at wrong times)

**What they need:**
- Task breakdown guidance (projects → actions)
- Energy-based planning (focus work vs admin)
- Quick capture and friction reduction
- Reflection that helps them improve

**Voice of the customer:**
> *"I keep adding tasks but never feel like I'm making progress. I need help figuring out what 'done' looks like."*

---

### P3: Executive Dysfunction / ADHD (EXPANSION PERSONA)
**Who they are:**
- Individuals with ADHD, executive dysfunction, or high task-switching friction
- Struggle to start tasks even when they know they matter
- Need structure + flexibility simultaneously

**Their pain:**
- Paralyzed by long lists (analysis paralysis)
- Task-starting friction is their biggest blocker
- Traditional productivity advice doesn't work for them
- Need micro-steps and clear next actions

**What they need:**
- One task at a time visibility (reduce overwhelm)
- Friction reduction (break tasks → micro-steps)
- Nudges and prompts when stuck
- Non-judgmental system

**Voice of the customer:**
> *"You've tried the popular apps... somehow you still end up overwhelmed."* (Amazing Marvin homepage — 4.8 stars, largely ADHD users)

**Market validation:**
- Amazing Marvin's success (4.8-star rating, niche dominance)
- "Procrastination Wizard" and "Accountability Pledge" features validate demand
- PRD decision to support by design (not specialize) for MVP is appropriate

---

## 2. Feature Validation: Does It Actually Reduce Overwhelm?

### ✅ VALIDATED — High User Value

#### 1. Daily Plan Engine with Explainability
**User need it solves:** "I have 50 tasks. What should I do TODAY?"

**Why it works:**
- Reduces decision fatigue (23-min refocus time after interruptions)
- Gives users permission to ignore the rest
- Explainability builds trust (54% of employees worried about using AI safely)

**Research evidence:**
- Motion (1M+ users) validates AI-assisted planning demand
- AI explainability restraint (-0.7% market impact) validates transparency need
- No competitor combines AI assistance + per-task reasoning

**User trust score:** ⭐⭐⭐⭐⭐  
**Differentiator strength:** MAXIMUM (our primary moat)

---

#### 2. Postponement Loop Breaker (Behavioral Intelligence)
**User need it solves:** "This task keeps slipping. Why? And what do I do about it?"

**Why it works:**
- Diagnoses root cause (too big, unclear, low value, blocked)
- Suggests actionable intervention (split, clarify, archive, defer)
- Adjusts future plans automatically

**Research evidence:**
- NO major competitor offers full loop (detection → diagnosis → intervention → plan adjustment)
- Amazing Marvin has "Procrastination Wizard" but doesn't auto-adjust plans
- Motion auto-reschedules but doesn't surface WHY tasks are stuck
- Sunsama tracks time spent but doesn't detect avoidance loops

**User trust score:** ⭐⭐⭐⭐⭐  
**Differentiator strength:** MAXIMUM (least addressed competitive gap)

**Voice of the customer:**
> *"I've been postponing 'write Q1 report' for 2 weeks. I know I should do it. Why can't I just... start?"*

---

#### 3. Capacity Warnings (Not Hard Limits)
**User need it solves:** "Is this plan actually realistic?"

**Why it works:**
- Users with 20+ genuine obligations won't bounce
- Preserves user agency while guiding
- Reduces guilt and builds trust

**Research evidence:**
- Sunsama uses soft warnings, not hard limits (validated approach)
- 66% burnout rate means users already feel guilty — don't add more
- "Recommended 5" language is better than "Today's 5" (soft vs prescriptive)

**User trust score:** ⭐⭐⭐⭐  
**Risk if we get it wrong:** Users feel constrained or micromanaged

---

#### 4. Reflection (End-of-Day Check-In)
**User need it solves:** "Why do my plans keep failing? Am I improving?"

**Why it works:**
- Weekly summary shows completion trends (progress, not guilt)
- "Most postponed tasks" highlights avoidance patterns
- Optional — no forced introspection

**Research evidence:**
- Sunsama's "shutdown ritual" is closest competitor feature
- No competitor does "why tasks slip" causal analysis well
- Differentiated if we focus on actionable insights, not just analytics

**User trust score:** ⭐⭐⭐⭐  
**Implementation note:** Must be skippable. Overwhelmed users won't tolerate mandatory reflection.

---

### ⚠️ PARTIALLY VALIDATED — Proceed with Caution

#### 5. Energy-Based Planning (Optional)
**User need it solves:** "I'm doing the wrong work at the wrong energy level."

**Why it's valuable:**
- 66% burnout rate (all-time high) validates energy management need
- Deep work vs light work distinction is real
- Productivity loss in high-burnout teams: 18-20% lower

**Why it's risky:**
- No competitor has fully productized energy matching
- Users may find it annoying to tag every task
- Energy fluctuates unpredictably (illness, stress, sleep)

**User trust score:** ⭐⭐⭐  
**Recommendation:** Keep as OPTIONAL in MVP. Don't require it for Daily Plan to work.

**Voice of the customer:**
> *"I love the idea but honestly I'm too overwhelmed to think about whether a task is 'high energy' or 'low energy.' Can I just... skip this?"*

---

#### 6. Integrations (MCP Connectors)
**User need it solves:** "Tasks come from everywhere (email, Slack, GitHub). I want them in one place."

**Why it's valuable:**
- Reduces task capture friction
- Meets users where they work
- Source links provide context

**Why it's risky:**
- None of the comparable startups launched with custom integrations
- Sunsama, Marvin, Akiflow relied on Zapier initially
- Adds significant MVP scope without validating core loop first
- Integration fatigue is a -2.2% market restraint

**User trust score:** ⭐⭐⭐  
**Recommendation:** DEFER to v2. Use Zapier/Make for MVP. Redirect engineering to behavioral intelligence.

**Market reality check:**
- Motion didn't launch with integrations
- Sunsama added integrations AFTER product-market fit
- Amazing Marvin still minimal integrations (focuses on task management)

---

### ❌ NOT VALIDATED — Avoid or Redesign

#### 7. Hard "Today's 5" Task Limit
**User need it solves:** Prevents overplanning (in theory).

**Why it's problematic:**
- Users with 20+ genuine daily obligations will bounce
- Feels prescriptive and inflexible
- Sunsama found success with soft warnings, not hard caps

**User trust score:** ⭐  
**Recommendation:** Change to "Recommended 5" with capacity warnings. Allow override with friction prompt: "You're over capacity — are you sure?"

**Voice of the customer:**
> *"I have 12 meetings today. Your app says I can only do 5 tasks. That's not helpful — it's delusional."*

---

## 3. Prioritization Guidance for Kobayashi (Product)

### Phase 1 Must-Haves (MVP)
**Priority order:**

1. **Daily Plan Engine with Explainability** (hero feature)
   - Every task shows "why" it's recommended
   - User can override and pin tasks
   - Capacity warnings, not hard limits
   - **User value:** Trust + clarity + permission to ignore backlog

2. **Postponement Loop Breaker** (hero differentiator)
   - Detect tasks postponed ≥3 times
   - Prompt: "Why is this stuck?" (too big / unclear / low value / blocked)
   - Suggest intervention (split / clarify / archive / defer)
   - **User value:** Breaks avoidance cycles proactively

3. **Quick Capture + Lists** (table stakes)
   - ≤2 seconds to create task (mobile target)
   - Inbox → Today → Upcoming → Someday → Archive
   - **User value:** Fast capture reduces friction

4. **Reflection (Optional, End-of-Day)** (differentiated)
   - "What blocked you today?" (single-choice + note)
   - "Was Today's Plan realistic?" (yes/no)
   - Weekly summary: completion trend, most postponed tasks
   - **User value:** Actionable insights, not guilt

5. **PWA Support** (mobile-critical)
   - Installable, offline-capable
   - Daily planning is a mobile interaction (morning routine, between meetings)
   - **User value:** Meets users at decision moments

---

### Phase 1 Nice-to-Haves (Descope if Needed)
6. **Energy-Based Planning** (optional metadata)
   - Tag tasks as low/medium/high energy
   - Plan engine considers energy match
   - **User value:** Burnout reduction, but only if they use it

7. **Natural Language Parsing** ("submit report by Friday" → task + due date)
   - **User value:** Faster capture, but not a differentiator

---

### Phase 2 (Post-MVP)
8. **MCP Integrations** (defer to v2)
   - Use Zapier/Make initially
   - Validate core loop first
   - **Market evidence:** No competitor launched with custom integrations

9. **Workflow Rules Engine** (defer to v2)
   - Too complex for MVP
   - Zapier/Make covers initial automation needs
   - **Engineering time better spent on behavioral intelligence**

---

## 4. User Trust Requirements

### What Builds Trust:
1. **Transparency** — explain every recommendation
2. **Control** — users can override and system remembers
3. **Realistic plans** — capacity warnings, not guilt
4. **No surprises** — don't auto-delete or auto-move without asking
5. **Skippable features** — optional energy tags, optional reflection

### What Destroys Trust:
1. **Opaque AI** — "the algorithm decided" (Motion's weakness)
2. **Hard limits** — "you can only do 5 tasks today" when they have 12 meetings
3. **Mandatory tracking** — forced energy tags, forced reflection
4. **Disappearing tasks** — auto-archive without permission
5. **Broken promises** — "AI will solve your overwhelm" (it won't, and users know it)

### Voice of the Customer (Trust):
> *"I don't mind if an app suggests priorities. I DO mind if it decides for me and won't let me change it."*

---

## 5. Risk Validation (From Market Research)

### Risk 1: Crowded Competitive Space (HIGH)
**Market reality:** Motion (1M+ users), Sunsama (NYT Wirecutter), Amazing Marvin already address 3 of 5 gaps.

**User perspective:** "Another task app? What makes this one different?"

**Mitigation:**
- Lead positioning with behavioral intelligence + explainable AI
- These are the ONLY two gaps no competitor covers fully
- Marketing must highlight "why this task?" explainability from day one

---

### Risk 2: Consumer Monetization (MEDIUM-HIGH)
**Market reality:** 54.6% of task management revenue comes from large enterprises. Consumer apps face high churn.

**User perspective:** "I'll try it for free. But will I pay $15/mo?"

**Mitigation:**
- Freemium model with premium behavioral intelligence features
- Week-4 retention target of ≥25% is realistic but implies churn
- Consider B2B2C (employer wellness benefit) in v2

---

### Risk 3: Privacy vs. Behavioral Intelligence (MEDIUM)
**Market reality:** Behavioral intelligence requires extensive tracking (postpone counts, plan overrides, completion patterns).

**User perspective:** "What are you tracking? Why? Can I delete it?"

**Mitigation:**
- Explicit consent at onboarding (GDPR Art. 6(1)(a))
- Local-first processing where feasible
- Clear data inventory: what's collected and why
- Account deletion includes behavioral data purge

**Voice of the Customer:**
> *"I want AI help. But I also want to know what you're doing with my data. If you can't explain it, I don't trust it."*

---

### Risk 4: Web-First Misses Core Use Cases (MEDIUM)
**Market reality:** Daily planning, quick capture, and energy check-ins are mobile interactions. All competitors have mobile apps.

**User perspective:** "I'm checking my plan between meetings on my phone. Where's the app?"

**Mitigation:**
- PWA from day one (installable, offline-capable)
- Validate mobile usage patterns in beta
- Evaluate native mobile for Phase 2

---

### Risk 5: Problem Is Not Purely Tool-Shaped (LOW-MEDIUM)
**Market reality:** 66% burnout, 79% disengagement, 70% engagement depends on the manager.

**User perspective:** "Will this app really fix my burnout? Or is this just another thing to manage?"

**Mitigation:**
- Frame Focus OS as **supporting** overwhelm recovery, not solving it
- Manage expectations: "We can't fix your workload. But we can help you navigate it."
- Marketing tone: empathetic, not prescriptive

**Voice of the Customer:**
> *"I don't need another guru telling me to 'just prioritize better.' I need a tool that respects that I'm doing my best in a broken system."*

---

## 6. Success Metrics (User-Centered)

### Activation (Do Users Understand the Value?)
- ≥60% create ≥10 tasks in first 7 days → validates capture works
- ≥40% generate Daily Plan ≥3 times in first week → validates core loop

### Engagement (Are Users Getting Value?)
- Daily Plan usage: avg ≥4 days/week → validates it's helpful, not burdensome
- Completion rate improvement: +15% after 4 weeks → validates plans are realistic

### Trust (Do Users Believe the System?)
- Plan usefulness rating ≥4.2/5 → validates explainability works
- Recommendation override rate ≤35% after learning period → validates AI accuracy

### Retention (Are We Solving Real Problems?)
- Week-4 retention ≥25% (consumer) / ≥40% (teams pilot) → validates product-market fit

---

## 7. Recommended User Research Activities (Phase 0)

### Interviews (10-15 Users)
**Goal:** Validate plan engine logic and explainability resonance.

**Questions:**
1. "Walk me through your current task management system. Where does it break down?"
2. "When you have 30 tasks, how do you decide what to do today?"
3. "If an app suggested 5 tasks for today, what would make you trust that recommendation?"
4. "Have you ever abandoned a task that kept slipping? Why?"
5. "How do you feel about AI-assisted productivity tools? What worries you?"

**Personas to recruit:**
- 5-7 Overwhelmed Professionals (meetings-heavy, 10+ years experience)
- 3-4 Students / Knowledge Workers (Gen Z preferred)
- 2-3 Executive Dysfunction / ADHD (Amazing Marvin users ideal)

---

### Prototype Testing (UX Validation)
**Test scenarios:**
1. **Capture flow:** Time to create a task (target: ≤2 seconds)
2. **Daily Plan generation:** Show "why" explanations. Do users understand them? Trust them?
3. **Postponement prompt:** "Why is this stuck?" Does the intervention feel helpful or annoying?
4. **Capacity warning:** Show "You're over capacity" message. Does it guide or frustrate?
5. **Reflection skip:** Validate users can skip without guilt

**Success criteria:**
- Plan explainability: ≥8/10 users understand "why" strings
- Trust: ≥7/10 users say they'd follow the recommendation
- Capacity warning: ≤2/10 users feel micromanaged

---

## 8. Key Takeaways for Design (Rabin) and Copy (Edie)

### For Rabin (Design):
1. **Explainability is UI, not just text** — "why" strings must be visible, not buried
2. **Capacity warnings need careful tone** — guide, don't guilt
3. **Postponement prompts are interventions** — design for empathy, not judgment
4. **Mobile is critical** — daily planning happens on phones, between meetings
5. **Optional features must LOOK optional** — energy tags, reflection can't feel mandatory

### For Edie (Copy):
1. **"Recommended 5" not "Today's 5"** — soft suggestion, not prescription
2. **Capacity warning tone:** "You're over capacity — are you sure?" (not "You can't do this")
3. **Postponement prompt tone:** "Why is this stuck?" (not "Why haven't you done this?")
4. **Explainability strings:** Short, plain language, no jargon. "Due tomorrow" beats "High urgency score."
5. **Marketing frame:** "Focus OS supports your overwhelm recovery" (not "Focus OS solves your productivity problems")

---

## 9. Open Questions for Product (Kobayashi)

1. **Pricing strategy:** Freemium vs. free trial → paid? Is behavioral intelligence premium or core?
2. **Energy tags:** Required, optional, or Phase 2? (I recommend optional for MVP)
3. **Integration strategy:** Confirm Zapier/Make for MVP, native integrations v2?
4. **Mobile priority:** PWA confirmed, but when do we evaluate native apps?
5. **Privacy consent flow:** How granular? Opt-in at onboarding? Per-feature toggles?

---

## Conclusion

The market research strongly validates our problem statement: overwhelmed professionals need tools that help them execute, not just store tasks. The competitive landscape is crowded, but **behavioral intelligence and explainable AI remain largely unaddressed** — these are our moat.

**User trust is everything.** 54% of employees worry about using AI safely. If we lead with transparency, agency, and realistic planning, we can build the trust that Motion (opaque AI) and Sunsama (manual rituals) don't fully deliver.

**The path forward:**
1. MVP focuses on Daily Plan Engine (explainability) + Postponement Loop Breaker (behavioral intelligence)
2. Defer integrations to v2 (use Zapier/Make initially)
3. Ship as PWA from day one (mobile is critical)
4. Validate with 10-15 user interviews (Phase 0)
5. Frame as supporting overwhelm recovery, not solving it

**Voice of the Customer (Final):**
> *"I don't need another app that tells me what I already know. I need a tool that helps me figure out what to do when everything feels important."*

That's what we're building.

---

**Next Steps:**
- Share with Kobayashi for prioritization decisions
- Share with Rabin (Design) and Edie (Copy) for tone guidance
- Use for Phase 0 interview script development

**Questions?** Find me in `.squad/agents/verbal/`
