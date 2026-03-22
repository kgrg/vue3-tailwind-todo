---
name: "explainable-ai-scoring"
description: "How to design transparent AI/ML scoring systems that explain recommendations to users"
domain: "ai-transparency, user-trust, algorithm-design"
confidence: "high"
source: "earned from Focus OS technical feasibility analysis"
---

## Context
When building AI-assisted recommendation systems (task prioritization, content ranking, etc.), users need to understand **why** a recommendation was made. This is especially critical in:
- Productivity tools (task managers, calendar assistants)
- High-stakes decisions (hiring, lending, medical)
- Regulated domains (EU AI Act, GDPR behavioral profiling)

Opaque "black box" AI creates trust issues and slows adoption (Market research: -0.7% restraint factor per Mordor Intelligence 2026).

## Patterns

### 1. Rule-Based Scoring with Transparent Weights
For MVP/early-stage products, prefer **explicit rule-based scoring** over opaque ML models:

```typescript
interface ScoringFactor {
  name: string
  weight: number
  value: number  // 0-1 normalized
}

interface ScoredItem {
  item: Task
  totalScore: number
  factors: ScoringFactor[]
}

function scoreTask(task: Task, context: Context): ScoredItem {
  const factors: ScoringFactor[] = []
  
  // Due urgency (40 points max)
  if (task.dueToday) {
    factors.push({ name: 'Due today', weight: 40, value: 1.0 })
  } else if (task.dueTomorrow) {
    factors.push({ name: 'Due tomorrow', weight: 30, value: 1.0 })
  }
  
  // Avoidance signal (30 points max)
  if (task.postponeCount >= 3) {
    factors.push({ name: 'Postponed 3+ times', weight: 30, value: 1.0 })
  }
  
  // Capacity fit (20 points max)
  if (task.estimate <= context.availableTime) {
    factors.push({ name: 'Fits your schedule', weight: 20, value: 1.0 })
  }
  
  const totalScore = factors.reduce((sum, f) => sum + (f.weight * f.value), 0)
  return { item: task, totalScore, factors }
}
```

**Why this works:**
- Every score component is traceable
- Weights can be tuned based on user feedback
- Users can see exactly why a task scored high/low

### 2. Simplified User-Facing Explanations
Don't expose raw scores in UI. Translate factors into **short, human-readable phrases**:

```typescript
function explainScore(scored: ScoredItem): string {
  // Show top 2 most impactful factors only
  const topFactors = scored.factors
    .sort((a, b) => (b.weight * b.value) - (a.weight * a.value))
    .slice(0, 2)
    .map(f => f.name)
  
  return topFactors.join(' • ')
}

// Example outputs:
// "Due today • Postponed 3+ times"
// "Fits your schedule • High energy"
// "Due tomorrow"
```

**Why 2 factors max:**
- Cognitive load: users skim, don't analyze
- Forces prioritization of most important signals
- Leaves room for UI (short pill/badge design)

### 3. Progressive Disclosure for Power Users
Provide **optional detail view** for users who want to understand the algorithm:

```
UI Layout:
┌─────────────────────────────────┐
│ Task: Review PRD                │
│ Score: 85/100                   │
│ Reason: Due today • Postponed   │  ← Default view
│                                 │
│ [Show breakdown] ←───────────── Toggle
└─────────────────────────────────┘

Expanded:
┌─────────────────────────────────┐
│ Task: Review PRD                │
│ Score: 85/100                   │
│                                 │
│ Scoring breakdown:              │
│ • Due today          +40        │
│ • Postponed 3 times  +30        │
│ • Fits schedule      +15        │
│                                 │
│ [Hide breakdown]                │
└─────────────────────────────────┘
```

### 4. Explain Negative Signals (Deferrals)
When an item is **not recommended**, explain why:

```typescript
interface DeferredItem {
  item: Task
  reason: 'no-capacity' | 'low-priority' | 'blocked' | 'energy-mismatch'
  explanation: string
}

function explainDeferral(task: Task, context: Context): DeferredItem {
  if (task.estimate > context.availableTime) {
    return {
      item: task,
      reason: 'no-capacity',
      explanation: 'Takes 2 hours, but you have 45 minutes left today'
    }
  }
  
  if (task.postponeCount === 0 && !task.due) {
    return {
      item: task,
      reason: 'low-priority',
      explanation: 'No due date; consider scheduling for later this week'
    }
  }
  
  // ... other cases
}
```

**User benefit:** Deferred tasks feel intentional, not arbitrary.

### 5. Versioning and A/B Testing
Track scoring algorithm versions to enable experimentation:

```typescript
interface ScoringConfig {
  version: string  // "v1.0", "v1.1"
  weights: {
    dueUrgency: number
    avoidanceSignal: number
    capacityFit: number
    energyMatch: number
  }
}

// Store config version in DailyPlan for auditing
interface DailyPlan {
  id: string
  date: Date
  tasks: Task[]
  scoringVersion: string  // "v1.0"
  userOverrides: Override[]
}
```

**Why this matters:**
- Can A/B test weight adjustments (e.g., "increase avoidance signal weight")
- Users report "bad recommendations" → check which scoring version they're on
- Enables safe iteration without breaking trust

## Examples

### Example 1: Focus OS Daily Plan Engine
(From technical feasibility analysis)

**Goal:** Recommend 5 tasks for today based on urgency, avoidance patterns, and capacity.

**Scoring factors:**
- Due urgency: 0-40 points
- Avoidance signal (postponed ≥3): 0-30 points
- Capacity fit: 0-20 points
- Energy match: 0-10 points

**User-facing output:**
```
Today's 5 Recommended Tasks:
─────────────────────────────────
✓ Review PRD
  Due today • Postponed 3 times
  
✓ Email client update
  Due today • Fits your schedule
  
✓ Debug login issue
  Overdue • High priority
  
...
```

## Anti-Patterns

### ❌ Anti-Pattern 1: Opaque ML Without Fallback Explanations
**Bad:**
```typescript
const score = neuralNetwork.predict(task)
// User sees: "Recommended for you" (no explanation)
```

**Why it's bad:** Erodes trust, especially when recommendations feel wrong.

**Fix:** Use SHAP/LIME for ML explainability, or fall back to rule-based system for MVP.

---

### ❌ Anti-Pattern 2: Overly Technical Explanations
**Bad:**
```
Score: 0.847 (sigmoid output)
Features: [0.9, 0.3, 0.1, 0.85, 0.2]
Model: XGBoost v1.2.3
```

**Why it's bad:** Users aren't data scientists. Explanation is worse than none.

**Fix:** Translate model outputs into plain language ("Due today", "High priority").

---

### ❌ Anti-Pattern 3: Too Many Reasons
**Bad:**
```
Recommended because:
• Due today
• Postponed 3 times
• Fits your schedule
• High energy task
• Similar to tasks you completed
• Tagged as important
• Created 3 days ago
```

**Why it's bad:** Cognitive overload. Users stop reading after 2-3 reasons.

**Fix:** Show max 2-3 most impactful factors. Hide rest behind "Show more."

---

### ❌ Anti-Pattern 4: Inconsistent Explanations
**Bad:**
- Task A: "Due today"
- Task B: "Recommended" (no reason)
- Task C: "85 points"

**Why it's bad:** Inconsistency feels buggy. Users lose trust.

**Fix:** Use a single explanation template for all items. If no strong signal, say "Low priority" or similar.

---

### ❌ Anti-Pattern 5: Explanations That Don't Match Reality
**Bad:**
```
Recommended: "Fits your schedule"
Reality: Task takes 3 hours, user has 1 hour free
```

**Why it's bad:** Destroys trust instantly. User assumes algorithm is broken.

**Fix:** Test explanations against ground truth. If task doesn't actually fit, don't claim it does.
