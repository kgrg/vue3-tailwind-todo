# UI Flows & Interactions — Focus OS

## Purpose
This document defines the screen-by-screen user flows for the core "Capture → Plan → Reflect" loop. It serves as the design specification for the "When" steps in Gherkin scenarios.

---

## 1. Capture Flow
**Goal:** Get tasks out of the user's head instantly to reduce cognitive load.

### Screen: Global Quick Capture (Overlay) & Inbox View
**Context:** Accessible from anywhere in the app (or via global shortcut).

#### Visual Hierarchy
1.  **Primary Focus:** Text input cursor (auto-focused).
2.  **Secondary:** Quick attributes row (Due Date, Estimate, Energy, Tag) — visible but subtle.
3.  **Tertiary:** "Add Task" button (users should primarily use Enter).

#### Key Interactions
*   **Type & Enter:** User types task title -> presses `Enter` -> Task saves to "Inbox" -> Input clears instantly for next task.
*   **Smart Parsing (Nice-to-have):** Typing "tomorrow" or "15m" highlights the attribute chip.
*   **Expand Details:** `Cmd+Enter` (or tap expand icon) opens the full task detail modal for adding notes/subtasks immediately.
*   **Dismiss:** `Esc` or tapping outside closes the capture window.

---

## 2. Plan Flow (The "Daily Ritual")
**Goal:** Convert a messy backlog into a realistic "Today's 5".

### Screen: Planning Interface
**Context:** A dedicated mode, often triggered at the start of the day.

#### Layout
*   **Split View:**
    *   **Left/Bottom (Backlog):** "Suggestions" (Smartly ranked), "Inbox", "Overdue".
    *   **Right/Top (The Plan):** "Today's 5" (Empty slots or pre-filled recommendations), "Optional", "Capacity Meter".

#### Visual Hierarchy
1.  **Hero:** The "Today's 5" container. It looks special, finite, and valuable.
2.  **Guidance:** "Reasoning" text under recommended tasks (e.g., "Due today", "Avoided 3x").
3.  **Constraint:** The Capacity Meter (Time/Energy) fills up as tasks are added.

#### Key Interactions
*   **Review Recommendations:** App presents a pre-filled plan.
*   **Drag to Prioritize:** User drags a task from "Suggestions" into a "Today" slot.
*   **Swap:** Dragging a new task on top of a "Today" task swaps them.
*   **Pin:** Clicking "Pin" locks a task into Today (AI won't remove it on regenerate).
*   **Commit:** "Start My Day" button acts as a psychological contract, locking the plan.

---

## 3. Reflect Flow (End of Day)
**Goal:** Close the loop, acknowledge progress, and diagnose "Why" tasks slipped.

### Screen: Shutdown Modal
**Context:** Triggered manually or at a set time (e.g., 5 PM).

#### Sequence
**Step 1: The Wins**
*   **Visuals:** Large, celebratory stats (Tasks completed, Focus time).
*   **Interaction:** "Celebrate" (confetti/animation), then "Next".

**Step 2: The Leftovers (Behavioral Intelligence)**
*   **Visuals:** List of incomplete tasks from "Today's 5".
*   **Interaction:** For each slipped task, user *must* choose an action:
    *   *Reschedule:* Moves to tomorrow.
    *   *Split:* Opens breakdown modal (for "Too big").
    *   *Archive:* "Not important actually".
    *   *Diagnosis:* Select why: "Ran out of time", "Procrastinated", "Blocked".

**Step 3: Closing**
*   **Visuals:** Summary of the day's mood/energy (Emoji selector).
*   **Interaction:** "End Day" button clears the view for tomorrow.

---

## 4. Execute (Day View)
**Goal:** Focus on one thing at a time without seeing the mountain of backlog.

### Screen: Today View
**Context:** The main dashboard during work hours.

#### Visual Hierarchy
1.  **Active Task:** The top task in "Today's 5" is visually dominant (larger, distinct background).
2.  **Up Next:** The remaining 4 tasks are visible but dimmed/smaller.
3.  **Hidden:** Inbox and other lists are tucked away in a drawer or separate tab.

#### Key Interactions
*   **Focus Mode:** Clicking the Active Task hides everything else and shows a timer/notes view.
*   **Complete:** Large checkbox or "Swipe Right" (mobile) triggers completion sound/visual.
*   **Postpone:** "Swipe Left" or specific button moves it out of Today -> asks "Reason".

---

## General Interaction Patterns
*   **Feedback:** All state changes (Move, Complete) need immediate optimistic UI updates.
*   **Drag & Drop:** Primary mechanism for organizing lists and planning.
*   **Progressive Disclosure:** Don't show "Notes" or "Metadata" unless the user asks for them or they are relevant (e.g., due today).
