---
applyTo: "src/pages/**/*.vue,src/layouts/**/*.vue,src/modules/activities/**/*,src/modules/tasks/**/*,src/modules/habits/**/*"
---

# Focus Planning Domain Rules

This product is not a generic task bucket. It is intended to reduce overwhelm and help users execute a realistic daily plan.

## Product Intent

1. Favor clarity, trust, and explainability over feature volume.
2. Optimize for a realistic daily set of work, not maximum task exposure.
3. Preserve user control. Recommendations may guide users, but they must not feel opaque or irreversible.

## Planning Behavior

1. If the UI recommends, sorts, or highlights work, it should be able to communicate why.
2. When behavior involves prioritization, keep room for primary work, optional work, and deferred work instead of flattening everything into one list.
3. Avoid designs that encourage unchecked backlog growth or overplanning.
4. When a task repeatedly slips, the better response is to clarify, break down, postpone intentionally, or archive, not just resurface it again.

## User Trust

1. Prefer interfaces that explain tradeoffs with short, plain-language reasoning.
2. Keep overrides sticky where practical. If a user pins or adjusts a plan, do not casually wipe it out.
3. Reduce surprise. Major behavior changes should be visible in the UI and easy to undo.