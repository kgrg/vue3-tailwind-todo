# SKILL: User Research Analysis

## When to Use
Apply this skill when analyzing market research documents to extract user personas, validate product features, and provide prioritization guidance.

## Context
Use for translating competitive intelligence and user data into actionable product insights. Particularly valuable when:
- Validating product-market fit assumptions
- Identifying differentiation opportunities
- Prioritizing MVP features
- Assessing user trust and adoption risks

## Inputs Required
- Market research document (competitive analysis, user data, industry reports)
- Product requirements document (PRD) or product vision
- Access to persona definitions and feature scope

## Execution Steps

### 1. Synthesize User Personas
**Goal:** Validate and enrich personas with research data

- Map research data points to proposed personas
- Calculate validation level (strongly validated / validated / partially validated / not validated)
- Extract "voice of the customer" quotes from competitor messaging and research
- Prioritize personas (primary / secondary / expansion)
- Document pain points with quantitative evidence

**Output format:**
```
### P1: [Persona Name] (PRIMARY/SECONDARY/EXPANSION)
**Who they are:** [demographics, context]
**Their pain:** [quantified pain points with sources]
**What they need:** [prioritized needs]
**Voice of the customer:** [quote that captures their perspective]
**Market validation:** [competitor/research evidence]
```

### 2. Validate Feature-to-Problem Fit
**Goal:** Assess whether proposed features actually solve user problems

For each proposed feature:
- Identify the user need it claims to solve
- Find research evidence supporting or contradicting that need
- Check competitive landscape (who else solves this, how well?)
- Assign validation score: ✅ VALIDATED / ⚠️ PARTIALLY VALIDATED / ❌ NOT VALIDATED
- Rate user trust score (⭐⭐⭐⭐⭐ = high trust)
- Assess differentiator strength (MAXIMUM / HIGH / MEDIUM / LOW / NONE)

**Red flags:**
- Feature validated but heavily addressed by competitors (not differentiated)
- Feature not validated by research data (assumption, not evidence)
- Feature requires user behavior that conflicts with their pain points (e.g., mandatory tracking for overwhelmed users)

### 3. Build Prioritization Framework
**Goal:** Recommend MVP scope based on user value and differentiation

Create three buckets:
- **Must-Have (MVP):** Validated + differentiated + core to value prop
- **Nice-to-Have (MVP):** Validated but not differentiated, or optional enhancements
- **Defer (v2):** Unvalidated, risky, or scope-heavy without clear user value

**Prioritization criteria:**
1. Does it solve a validated pain point? (research evidence)
2. Is it differentiated? (competitive gap analysis)
3. Does it build or destroy trust? (user control, transparency, agency)
4. Is it core to the value loop? (can product work without it?)
5. What's the scope risk? (engineering time vs. validation)

### 4. Identify Trust Requirements
**Goal:** Define what builds vs. destroys user trust

Extract trust signals from research:
- What worries users? (e.g., "54% worried about AI safety")
- What market restraints exist? (e.g., "AI explainability -0.7% restraint")
- What do successful competitors do? (e.g., "Sunsama uses soft warnings, not hard limits")

**Output:**
- **What Builds Trust:** [list with evidence]
- **What Destroys Trust:** [list with evidence]
- **Voice of the Customer (Trust):** [quote]

### 5. Map Risks to User Perspective
**Goal:** Translate business/technical risks into user experience concerns

For each identified risk:
- Translate technical language into user perspective
- Add "Voice of the Customer" quote
- Recommend mitigation that respects user needs

**Example:**
```
### Risk: Web-First Misses Core Use Cases
**Market reality:** [data]
**User perspective:** "I'm checking my plan between meetings on my phone. Where's the app?"
**Mitigation:** [user-centered solution]
```

### 6. Define Success Metrics (User-Centered)
**Goal:** Ensure metrics reflect actual user value, not vanity

Group metrics by user question:
- **Activation:** Do users understand the value?
- **Engagement:** Are users getting value?
- **Trust:** Do users believe the system?
- **Retention:** Are we solving real problems?

Validate each metric:
- Does it measure user outcome (not just behavior)?
- Is the target realistic given market data?
- Does it reflect product differentiation?

## Output Deliverables

1. **User Research Insights Document** (`document/product/user-research-insights.md`)
   - Validated personas with quantified pain points
   - Feature validation (✅ / ⚠️ / ❌)
   - Prioritization guidance (Must-Have / Nice-to-Have / Defer)
   - Trust requirements
   - Risk analysis (user perspective)
   - Success metrics (user-centered)

2. **Decision Document** (`.squad/decisions/inbox/[agent]-user-insights.md`)
   - Key decisions (prioritization, design principles)
   - Rationale with user evidence
   - Impact if not addressed
   - Open questions for Product

3. **Updated History** (`.squad/agents/[agent]/history.md`)
   - Architecture decisions discovered
   - User preferences learned
   - Key file paths
   - Competitive positioning patterns

## Quality Checks

Before finalizing:
- [ ] Every persona has quantified pain points with sources
- [ ] Every feature validation includes competitive analysis
- [ ] Prioritization guidance includes explicit trade-offs
- [ ] Trust requirements are backed by research data
- [ ] Risk analysis includes "Voice of the Customer" quotes
- [ ] Success metrics reflect user outcomes, not just behavior
- [ ] Design principles are actionable (for designers/copywriters)
- [ ] Open questions are clearly flagged for Product owner

## Anti-Patterns to Avoid

❌ **Confirmation bias:** Only citing research that supports PRD assumptions  
✅ **Balanced analysis:** Highlight both validations AND contradictions

❌ **Feature list thinking:** "Users need X, Y, Z"  
✅ **Problem-first thinking:** "Users struggle with overwhelm → feature X addresses it → here's the evidence"

❌ **Competitor dismissal:** "We're different, competitors don't matter"  
✅ **Competitive reality:** "Competitors A, B, C already solve this → we need sharper differentiation"

❌ **Vanity metrics:** "DAU, MAU, task creation count"  
✅ **Outcome metrics:** "Completion rate improvement, plan usefulness rating, override rate"

❌ **Tech-speak:** "Opaque ML model," "Integration fatigue"  
✅ **User voice:** "I don't trust AI I can't understand," "Another tool to manage"

## Example Use Cases

### Use Case 1: MVP Scope Validation
**Input:** PRD with 10 proposed features, market research with competitor analysis  
**Output:** Must-Have (4 features), Nice-to-Have (3 features), Defer (3 features) with user-centered rationale

### Use Case 2: Differentiation Analysis
**Input:** Market research showing crowded competitive space  
**Output:** Gap matrix showing which problems competitors solve, which gaps remain unfilled, where to position product

### Use Case 3: Trust Risk Assessment
**Input:** PRD with AI-powered recommendations, privacy concerns in market research  
**Output:** Trust requirements (explainability, user control, data transparency), design principles, consent flow recommendations

## Related Skills
- `competitive-analysis` — for deeper competitor feature comparison
- `persona-development` — for creating personas from scratch (this skill assumes personas exist)
- `user-interview-synthesis` — for analyzing primary research (this skill focuses on secondary research)

## Maintenance Notes
- Update validation criteria as market data sources evolve
- Refresh competitive landscape quarterly (fast-moving space)
- Add new anti-patterns as they're discovered in practice
