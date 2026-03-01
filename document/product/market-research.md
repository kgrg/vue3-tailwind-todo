# Market Research — Focus OS
**Document Type:** ODCS (Operational Document Control Sheet)  
**Version:** v1.0  
**Date:** 28 February 2026  
**Owner:** Product  
**Purpose:** Log all market research, competitive intelligence, and data points that inform the Focus OS PRD.

---

## 1. Research Summary

This document consolidates market research conducted in February 2026 to validate the Focus OS PRD's problem statement, target personas, and core assumptions. All findings are sourced from industry reports, academic research, and competitor analysis.

**Overall finding:** The PRD's problem diagnosis is **strongly validated** by 2025–2026 data. The five identified gaps are real. However, the competitive landscape is more crowded than initially assumed — Motion, Sunsama, and Amazing Marvin already address 3 of the 5 gaps. Focus OS's strongest unique differentiators are **behavioral intelligence** and **explainable AI**.

---

## 2. Market Size & Growth

### 2.1 Global Task Management Software Market

| Metric | Value | Source |
|---|---|---|
| Market size (2025) | **$1.27 billion** | Mordor Intelligence, Jan 2026 [^1] |
| Market size (2026) | **$1.44 billion** | Mordor Intelligence, Jan 2026 [^1] |
| Projected market size (2031) | **$2.66 billion** | Mordor Intelligence, Jan 2026 [^1] |
| CAGR 2026–2031 | **13.1%** | Mordor Intelligence, Jan 2026 [^1] |
| Largest regional market | North America (37.1% of 2025 revenue) | Mordor Intelligence, Jan 2026 [^1] |
| Fastest-growing region | Asia-Pacific (13.8% CAGR) | Mordor Intelligence, Jan 2026 [^1] |
| Cloud deployment share | **77.1%** (2025) | Mordor Intelligence, Jan 2026 [^1] |
| SME segment growth rate | **14.1% CAGR** through 2031 | Mordor Intelligence, Jan 2026 [^1] |
| Large enterprise revenue share | **54.6%** (2025) | Mordor Intelligence, Jan 2026 [^1] |

### 2.2 Market Drivers

| Driver | Impact | Source |
|---|---|---|
| Cloud adoption by SMEs | +4.9% | Mordor Intelligence [^1] |
| Hybrid/remote workforce permanence | +3.8% | Mordor Intelligence [^1] |
| Low-code/no-code embedding task engines | +1.9% | Mordor Intelligence [^1] |
| Generative AI integration | Accelerant across all segments | Mordor Intelligence [^1] |

### 2.3 Market Restraints

| Restraint | Impact | Source |
|---|---|---|
| SaaS sprawl / integration fatigue | -2.2% | Mordor Intelligence [^1] |
| Data residency regulations | -1.8% | Mordor Intelligence [^1] |
| AI-generated task recommendations facing explainability scrutiny | -0.7% | Mordor Intelligence [^1] |

### 2.4 Market Leaders by 2025 Revenue
1. Microsoft (Planner/Project, bundled with Office 365)
2. Atlassian (Jira, 5,000+ integrations)
3. RingCentral
4. Asana
5. monday.com

Top 5 vendors control ~40% of global revenue; market is "moderately fragmented."

**Source:** Mordor Intelligence, "Task Management Software Market — Growth, Trends, and Forecasts (2026–2031)", Jan 2026 [^1]

---

## 3. Problem Validation

### 3.1 Gap: "To-do apps help store, not execute"

**Validation level: STRONGLY VALIDATED**

| Data Point | Source |
|---|---|
| Amazing Marvin uses identical language: *"Traditional To-do apps store your tasks. They don't help you do them."* | Amazing Marvin homepage [^2] |
| Motion frames itself as the anti-todo-list: *"Normal Task Manager: Endless lists, missed deadlines, forgotten tasks"* | Motion homepage [^3] |
| HBR (Daniel Markovitz): *"Stop making to-do lists. They're simply setting you up for failure and frustration."* | Harvard Business Review [^4] |
| Sunsama markets around solving chaos: *"Work is chaotic... Always on, working late, never done..."* | Sunsama homepage [^5] |
| Multiple well-funded products (Motion: 1M+ users; Sunsama: NYT Wirecutter "Best Scheduling Tool"; Akiflow: YC-backed) all built on this exact thesis | Various [^3] [^5] [^6] |

**Note:** The existence of these competitors confirms the problem is real, but also means the insight is no longer novel.

### 3.2 Gap: "Users accumulate backlogs, overplan, lose trust"

**Validation level: VALIDATED**

| Data Point | Value | Source |
|---|---|---|
| Employees experiencing productivity anxiety | **80%** | Yomly, 2025 [^7] |
| Gen Z facing productivity anxiety daily | **30%** | Yomly, 2025 [^7] |
| Gen Z experiencing productivity anxiety several times/week | **58%** | Yomly, 2025 [^7] |
| Employee burnout rate (all-time high) | **66%** | Modern Health / Forbes, 2025 [^8] |
| Annual cost of burnout to businesses | **$322 billion** | Modern Health / Forbes, 2025 [^8] |
| Employees who feel productive at work | **Only 7%** | Forbes / Zippia, 2025 [^9] |
| Average productive time per day | **2 hours 23 minutes** (31% of workday) | Voucher Cloud / BLS, 2025 [^10] |
| Employees feeling distracted at work | **70%** | Zippia, 2026 [^9] |
| Productivity loss from multitasking | **Up to 40%** | Forbes, 2025 [^8] |

**Analysis:** The overplanning → overwhelm → abandonment cycle described in the PRD is consistent with the Zeigarnik effect (uncompleted tasks creating persistent cognitive load) and modern research on decision fatigue.

### 3.3 Gap: Cognitive Load Management

**Validation level: VALIDATED — emerging as competitive differentiator**

| Data Point | Value | Source |
|---|---|---|
| Workers interrupted every | **3 minutes 5 seconds** | UC Irvine [^11] |
| Time needed to refocus after interruption | **23 minutes** | UC Irvine [^11] |
| Amazing Marvin's "Super Focus Mode" | See just one task at a time | Amazing Marvin [^2] |
| Sunsama's "Mute apps" feature | Reduces distractions during focus time | Sunsama [^5] |
| Motion's auto-prioritization | Resurfaces tasks so users don't stare at long lists | Motion [^3] |

### 3.4 Gap: Behavioral Intelligence

**Validation level: VALIDATED — least addressed by competitors, BEST differentiator**

| Competitor | What They Do | What They Don't Do |
|---|---|---|
| Amazing Marvin | "Procrastination Wizard" (step-by-step unsticking), "Accountability Pledge" (financial stakes) | No automatic loop detection or plan adjustment |
| Motion | Auto-reschedules undone tasks | Doesn't surface *why* tasks are stuck |
| Sunsama | Tracks "where your time actually went" via analytics | Doesn't proactively detect avoidance loops |

**Key finding:** No major competitor offers the full behavioral intelligence loop: detect postponement → diagnose cause → suggest intervention → adjust plan. **This is Focus OS's most differentiated feature.**

### 3.5 Gap: Energy-Based Planning

**Validation level: VALIDATED — growing recognition, partial implementations**

| Data Point | Value | Source |
|---|---|---|
| Burnout rate (all-time high, 2025) | **66%** | Modern Health, 2025 [^8] |
| Annual cost of stress to employers | **$300 billion** | American Institute of Stress [^12] |
| Productivity loss in high-burnout teams | **18–20% lower** | Meditopia, 2025 [^13] |
| Women experiencing burnout (2024) | **59%** | Forbes, 2024 [^8] |
| Men experiencing burnout (2024) | **46%** | Forbes, 2024 [^8] |

**Competitor coverage:** Sunsama has break reminders and "maintain energy" features. Amazing Marvin mentions energy considerations. Motion approaches indirectly via capacity-based planning. **No major player has fully productized deep-work vs. light-work energy matching.**

### 3.6 Gap: Actionable Reflection

**Validation level: PARTIALLY VALIDATED**

| Competitor | Reflection Features |
|---|---|
| Sunsama | Daily shutdown ritual, time tracking analytics |
| Motion | Performance analytics dashboard |
| Amazing Marvin | Basic completion stats |

**Finding:** Sunsama's shutdown ritual is closest, but no competitor does "why tasks slip" analysis well. The PRD's reflection features (blocker diagnosis + weekly most-postponed tasks) are differentiated.

---

## 4. Competitive Landscape

### 4.1 Direct Competitors (AI-Powered Personal Daily Planning)

| Competitor | Users | Key Differentiator | Pricing | Backing | Source |
|---|---|---|---|---|---|
| **Motion** | 1M+ | Full AI auto-scheduling, project management, docs, meetings | ~$34/mo (individual) | Y Combinator | [^3] |
| **Sunsama** | Unknown (enterprise-ready) | Calm daily planning, shutdown rituals, integrations | ~$20/mo | NYT Wirecutter "Best Scheduling Tool" | [^5] |
| **Amazing Marvin** | 5K+ | Extreme customizability, 300+ settings, ADHD focus, procrastination tools | ~$12/mo (+ lifetime option) | Indie / bootstrapped | [^2] |
| **Akiflow** | 10K+ | Universal inbox, time-blocking, AI assistant "Aki" | Premium tier | Y Combinator | [^6] |
| **Todoist** | Millions (170K+ newsletter) | Simple task management, AI assistant (recent), team features | Freemium | Bootstrapped (Doist) | [^14] |
| **TickTick** | Millions | Calendar + tasks, habit tracking, Pomodoro | Freemium | — | [^15] |

### 4.2 How Competitors Handle AI

| Competitor | AI Approach | Explainability Level |
|---|---|---|
| **Motion** | Full auto-scheduling (OpenAI / Anthropic) | **Low** — "automatically" plans; little visible reasoning |
| **Sunsama** | Guided planning rituals, AI summaries | **Medium** — analytics-driven insights, more ritual than AI |
| **Amazing Marvin** | Minimal AI; user-driven customization | **N/A** — trusts user judgment over algorithms |
| **Akiflow** | AI assistant "Aki", prioritization | **Low-Medium** — AI assigns priorities but reasoning unclear |
| **Focus OS** (proposed) | Rule-based scoring + lightweight learning | **High** — every task includes "why" explanation string |

**Strategic positioning:** Focus OS's "explainable recommendations" sits in a strategic sweet spot. Motion goes all-in on opaque AI. Marvin goes all-in on user control. **No major player currently combines AI assistance with per-task reasoning transparency.**

### 4.3 Key Industry Developments (2024–2025)

| Date | Event | Source |
|---|---|---|
| Dec 2024 | Smartsheet privatized by Blackstone + Vista Equity Partners | Industry news [^16] |
| Mar 2025 | ClickUp launched integrated calendar for task & meeting management | ClickUp blog [^17] |
| Jun 2025 | Projectworks raised $12M Series A for project automation | TechCrunch [^18] |
| Aug 2024 | Unbounce merged with Insightly for unified sales+marketing+task suite | Industry news [^19] |

---

## 5. User Behavior & Productivity Data

### 5.1 Productivity & Focus

| Metric | Value | Source |
|---|---|---|
| Average productive time per workday | **2h 23min** (31% of workday) | Voucher Cloud / BLS [^10] |
| Interruption frequency | Every **3 minutes** | UC Irvine [^11] |
| Refocus time after interruption | **23 minutes** | UC Irvine [^11] |
| Employees feeling distracted at work | **70%** | Zippia [^9] |
| Productivity loss from multitasking | **Up to 40%** | Forbes [^8] |
| Time spent in meetings per week | **11.3 hours** | Various [^20] |
| Employees who consider meetings wasted time | **50%** | Various [^20] |

### 5.2 Engagement & Burnout

| Metric | Value | Source |
|---|---|---|
| Global employee engagement rate | **Only 21%** (lowest in a decade) | Gallup, 2025 [^21] |
| Employee burnout rate | **66%** (all-time high) | Modern Health / Forbes, 2025 [^8] |
| Employees reporting burnout (2024) | **52%** (women: 59%, men: 46%) | Forbes, 2024 [^8] |
| Burned-out employees more likely to take sick days | **63% more likely** | Modern Health [^8] |
| Productivity loss in high-burnout teams | **18–20% lower** | Meditopia, 2025 [^13] |
| Employees experiencing productivity anxiety | **80%** | Yomly, 2025 [^7] |
| Gen Z facing daily productivity anxiety | **30%** | Yomly, 2025 [^7] |
| Stress causing productivity loss | **41% of employees** | AIS [^12] |

### 5.3 Workforce Disengagement

| Metric | Value | Source |
|---|---|---|
| Global workforce disengaged or going through motions | **79%** | Gallup, 2025 [^21] |
| Employees actively disengaged | **53%** | SMBGuide, 2025 [^22] |
| Employees "quietly quitting" (doing minimum) | **6 in 10 globally** | Gallup, 2025 [^21] |

---

## 6. AI Adoption in the Workplace

### 6.1 Adoption Rates

| Metric | Value | Source |
|---|---|---|
| U.S. employees using AI at work (Q3 2025) | **45%** (up from 40% Q2) | Pew Research / industry surveys [^23] |
| Daily AI usage in workforce | **~10%** | Industry surveys [^23] |
| Organizations with AI implemented for productivity | **37%** | McKinsey, 2025 [^24] |
| AI users productivity gain per hour | **33% more productive** | Industry studies [^23] |
| Companies planning to increase AI investments (next 3 years) | **92%** | Industry surveys [^24] |
| Organizations using AI in at least one function (2025) | **78%** | McKinsey, 2025 [^24] |

### 6.2 Trust & Adoption Barriers

| Metric | Value | Source |
|---|---|---|
| Employees worried about using AI safely | **54%** | Industry surveys [^23] |
| Managers invested in automation for teams | **Only 45%** | Industry surveys [^23] |
| Employees not feeling trained on workplace tech | **50%** | Industry surveys [^23] |
| AI explainability identified as market restraint | **-0.7% impact** | Mordor Intelligence [^1] |

**Key insight for Focus OS:** The AI trust gap directly validates the "explainable AI" differentiator. Opaque AI recommendations are actively slowing adoption industry-wide.

---

## 7. Persona Validation

### 7.1 P1: Overwhelmed Professional

| Supporting Evidence | Source |
|---|---|
| 66% burnout rate (all-time high) | Modern Health [^8] |
| 70% feel distracted at work | Zippia [^9] |
| 11.3 hours/week in meetings, 50% considered wasted | Various [^20] |
| Interrupted every 3 minutes, 23 min to refocus | UC Irvine [^11] |
| Only 2h 23min productive per day | Voucher Cloud [^10] |

**Verdict:** Strongly validated. The data confirms this persona's core pain points are widespread and worsening.

### 7.2 P2: Student / Knowledge Worker

| Supporting Evidence | Source |
|---|---|
| 30% of Gen Z face productivity anxiety daily | Yomly [^7] |
| 58% of Gen Z experience it several times per week | Yomly [^7] |
| Energy-based planning benefits validated by burnout research | Meditopia [^13] |

**Verdict:** Validated. Gen Z productivity anxiety data directly supports this persona.

### 7.3 P3: Executive Dysfunction / ADHD

| Supporting Evidence | Source |
|---|---|
| Amazing Marvin's 4.8-star rating driven by ADHD users | App Store reviews [^2] |
| Amazing Marvin's "Procrastination Wizard" specifically targets this cohort | Amazing Marvin [^2] |
| Marvin's marketing: *"You've tried the popular apps... somehow you still end up overwhelmed"* | Amazing Marvin [^2] |

**Verdict:** Validated by Amazing Marvin's success in this niche. Demand is proven, and the PRD's decision to support by design (not specialize) for MVP is appropriate.

---

## 8. Risks & Blindspots Identified

### Risk 1: Crowded Competitive Space
**Severity: HIGH**

The PRD frames gaps as largely unaddressed. In reality, Motion (1M+ users, YC), Sunsama (NYT Wirecutter), and Amazing Marvin already address 3 of 5 gaps. Focus OS needs sharper differentiation around behavioral intelligence + explainable AI specifically.

### Risk 2: Consumer vs. Enterprise Market Dynamics
**Severity: MEDIUM-HIGH**

Large enterprises hold 54.6% of task management market revenue [^1]. The PRD targets consumers/individuals. Consumer task apps face high churn and fierce attention competition. The Week-4 retention target of ≥ 25% is realistic but implies significant expected churn.

### Risk 3: "Today's 5" Hard Limit May Frustrate Power Users
**Severity: MEDIUM**

Users with 20+ genuine daily obligations may find it restrictive. The "+3 Optional" buffer may not be enough. Sunsama found success with a similar philosophy but uses soft "over capacity" warnings rather than hard limits [^5].

**Recommendation:** Consider "recommended 5" with capacity warnings instead of a hard cap.

### Risk 4: Behavioral Data Collection vs. Privacy Claims
**Severity: MEDIUM**

Section 10 of the PRD claims "minimal data collection" but behavioral intelligence features require extensive tracking (postponement counts, plan overrides, completion patterns). GDPR and EU AI Act may create compliance overhead for behavioral profiling. This tension should be resolved explicitly.

### Risk 5: Web-First May Miss Core Use Cases
**Severity: MEDIUM**

Daily planning, quick capture, and energy check-ins are inherently mobile-first interactions. Sunsama, Motion, and Akiflow all have native mobile apps. A web-first approach risks missing key decision moments (morning routine, between meetings, commute).

### Risk 6: MCP Integrations / Workflow Engine Premature for MVP
**Severity: MEDIUM**

None of the comparable startups launched with custom workflow engines. Sunsama, Marvin, and Akiflow relied on Zapier for initial automation and added native integrations later. The workflow engine significantly expands MVP scope without validating the core "overwhelm → clarity" loop first.

**Recommendation:** Defer custom workflow engine to v2. Use Zapier/Make for initial automation. Redirect engineering to core differentiators.

### Risk 7: Problem Is Not Purely Tool-Shaped
**Severity: LOW-MEDIUM**

Burnout (66%), disengagement (79%), and distraction (70%) are systemic workplace problems — not purely tool problems. 70% of engagement depends on the manager (Gallup) [^21]. Focus OS should frame itself as *supporting* overwhelm recovery, not *solving* it.

### Risk 8: Missing Pricing Strategy
**Severity: MEDIUM**

The PRD contains no monetization section. Given the competitive landscape:
- Motion: ~$34/mo (positions as replacing 10+ tools)
- Sunsama: ~$20/mo
- Amazing Marvin: ~$12/mo (+ lifetime option)
- Todoist: Freemium
- TickTick: Freemium

Focus OS needs early pricing thinking to validate willingness-to-pay.

---

## 9. Validation Summary Scorecard

| PRD Assumption | Validation Level | Evidence Strength | Action |
|---|---|---|---|
| To-do apps help store, not execute | **Strongly validated** | Multiple competitors + HBR + user data | Sharpen differentiation |
| Users accumulate backlogs & lose trust | **Validated** | 80% productivity anxiety, 66% burnout | No change needed |
| Cognitive load management gap | **Validated** | 3-min interrupts, 23-min refocus, competitors building features | No change needed |
| Context awareness gap | **Partially validated** | Calendar integration standard; location is niche | De-emphasize location |
| Behavioral intelligence gap | **Validated — best differentiator** | No competitor offers full loop | Elevate as hero feature |
| Energy-based planning gap | **Validated** | Burnout all-time high; partial implementations exist | Keep as optional MVP |
| Actionable reflection gap | **Partially validated** | Sunsama has daily shutdown; none do "why tasks slip" | Differentiate on causal analysis |
| Explainable AI as differentiator | **Strongly validated** | Market data confirms AI explainability is a real restraint | Elevate in positioning |
| "Today's 5" task limit | **Validated concept, execution risk** | Sunsama validates philosophy; hard limit may frustrate | Soften to recommendation |
| Market opportunity exists | **Validated** | $1.44B market at 13.1% CAGR | Opportunity confirmed |
| Web-first platform choice | **Risky** | Competitors all mobile-first; use case is inherently mobile | Consider mobile-first or simultaneous |
| MCP integrations in MVP | **Premature** | No competitor launched with custom workflow engine | Defer to v2 |

---

## 10. References

[^1]: Mordor Intelligence. "Task Management Software Market — Growth, Trends, and Forecasts (2026–2031)." January 2026.  
https://www.mordorintelligence.com/industry-reports/task-management-software-market

[^2]: Amazing Marvin. Product homepage and App Store listing. Accessed February 2026.  
https://amazingmarvin.com/

[^3]: Motion. Product homepage. Accessed February 2026.  
https://www.usemotion.com/

[^4]: Markovitz, Daniel. "To-Do Lists Don't Work." Harvard Business Review.  
https://hbr.org/2012/01/to-do-lists-dont-work

[^5]: Sunsama. Product homepage. Accessed February 2026.  
https://www.sunsama.com/

[^6]: Akiflow. Product homepage. Accessed February 2026.  
https://akiflow.com/

[^7]: Yomly. "Productivity Anxiety Report 2025." 2025.  
https://www.yomly.com/research/productivity-anxiety-2025

[^8]: Forbes / Modern Health. "Employee Burnout Statistics 2025." Forbes, 2025.  
https://www.forbes.com/advisor/business/burnout-statistics/

[^9]: Zippia. "Workplace Distraction Statistics 2025–2026."  
https://www.zippia.com/advice/workplace-distraction-statistics/

[^10]: Voucher Cloud / Bureau of Labor Statistics. "Productive Hours Per Day Study."  
https://www.vouchercloud.com/resources/office-worker-productivity

[^11]: Mark, Gloria. "The Cost of Interrupted Work." UC Irvine / ACM CHI.  
https://www.ics.uci.edu/~gmark/chi08-mark.pdf

[^12]: American Institute of Stress. "Workplace Stress Statistics."  
https://www.stress.org/workplace-stress

[^13]: Meditopia. "Burnout Impact on Team Productivity 2025."  
https://meditopia.com/en/blog/burnout-statistics/

[^14]: Todoist. Product homepage. Accessed February 2026.  
https://todoist.com/

[^15]: TickTick. Product homepage. Accessed February 2026.  
https://ticktick.com/

[^16]: Smartsheet / Blackstone-Vista acquisition. Industry news, December 2024.  
https://www.smartsheet.com/

[^17]: ClickUp. "Integrated Calendar Launch." ClickUp Blog, March 2025.  
https://clickup.com/blog/

[^18]: Projectworks. "$12M Series A." TechCrunch, June 2025.  
https://techcrunch.com/

[^19]: Unbounce-Insightly merger. Industry news, August 2024.  
https://unbounce.com/

[^20]: Various sources on meeting time statistics. Aggregated 2025 data.  
https://www.zippia.com/advice/meeting-statistics/

[^21]: Gallup. "State of the Global Workplace 2025."  
https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx

[^22]: SMBGuide. "Employee Engagement Statistics 2025."  
https://www.smbguide.com/employee-engagement-statistics/

[^23]: Pew Research Center / various industry surveys. "AI Adoption in the Workplace, 2025."  
https://www.pewresearch.org/

[^24]: McKinsey & Company. "The State of AI in 2025." McKinsey Global Survey, 2025.  
https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai

---

*Last updated: 28 February 2026*
