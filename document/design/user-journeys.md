# Focus OS User Journeys & Psychology

**Author:** Verbal (User Researcher)  
**Date:** March 2026  
**Context:** Supporting Gherkin scenario definition for Focus OS.

---

## 1. Core Philosophy: From Management to Relief

Focus OS is not just about *managing* tasks; it is about **managing overwhelm**. The user journey moves from a state of high cognitive load and anxiety to a state of clarity and intentional action.

The system acts as an **External Executive Function**, handling prioritization and realistic planning so the user doesn't have to spend energy on "what to do next."

---

## 2. The User Journey: Emotional States & Psychological Drivers

### Phase 1: Capture (The Brain Dump)

*   **User Goal:** Get every nagging thought, task, and obligation out of their head immediately.
*   **Context:** Commuting, in a meeting, lying in bed, or feeling a sudden spike of panic about forgotten items.
*   **Emotional State:**
    *   **Before:** `Anxious`, `Scattered`, `Overwhelmed`, `Mental Buzzing`.
    *   **During:** `Urgent`, `Frantic`.
    *   **After:** `Relief`, `Lighter`.
*   **Psychological "Why" (The Science):**
    *   **Zeigarnik Effect:** Uncompleted tasks occupy working memory, creating background anxiety. Capturing them "closes the loop" mentally, even if the task isn't done, freeing up cognitive resources.
    *   **Cognitive Offloading:** Trusting the system to hold the information reduces the mental energy required to "remember to remember."

### Phase 2: Clarify (Processing)

*   **User Goal:** Turn vague "stuff" into actionable tasks with realistic constraints (time, energy).
*   **Context:** Start of the day, or a dedicated "processing" block.
*   **Emotional State:**
    *   **Before:** `Resistant` (dread of the pile), `Skeptical`.
    *   **During:** `Evaluative`, `Realistic`.
    *   **After:** `Organized`, `Prepared`.
*   **Psychological "Why" (The Science):**
    *   **Overcoming Task Paralysis:** Vague tasks ("Project X") trigger avoidance. Clarifying specific actions ("Email J about X") lowers the activation energy required to start.
    *   **Combating the Planning Fallacy:** Humans naturally underestimate how long tasks take. Forcing an estimate (even a rough one) triggers *System 2 thinking* (analytical), leading to more realistic planning.

### Phase 3: Plan (The Selection - "Today's 5")

*   **User Goal:** Create a doable list for *today*, accepting that not everything can happen.
*   **Context:** Morning routine. The critical decision point.
*   **Emotional State:**
    *   **Before:** `Indecisive`, `Greedy` (wanting to do it all).
    *   **During:** `Intentional`, `Ruthless` (in a good way).
    *   **After:** `Focused`, `Confident`, `Empowered`.
*   **Psychological "Why" (The Science):**
    *   **Decision Fatigue Reduction:** Making decisions drains energy. By limiting the daily list to 5 items, we preserve willpower for *doing* rather than *deciding*.
    *   **Paradox of Choice:** Too many options lead to paralysis. A constrained list increases the likelihood of starting.
    *   **Commitment & Consistency:** Explicitly selecting "Today's 5" creates a psychological contract with oneself, increasing adherence.

### Phase 4: Execute & Adapt (The Flow & The Block)

*   **User Goal:** Do the work. When stuck, get unstuck without shame.
*   **Context:** Deep work blocks, between meetings.
*   **Emotional State:**
    *   **Ideally:** `Flow`, `Productive`.
    *   **When Stuck:** `Avoidant`, `Guilty`, `Distracted`.
    *   **Intervention (Loop Breaker):** `Supported`, `Understood` (not judged).
*   **Psychological "Why" (The Science):**
    *   **Single-Tasking:** Reduces context-switching penalty (which can cost up to 40% of productivity).
    *   **Shame Reduction (Loop Breaker):** Procrastination is often emotional regulation, not laziness. When a task is postponed repeatedly, the system asking "Why?" (neutral curiosity) disrupts the shame cycle and moves the user to problem-solving (e.g., "It's too big" -> "Split it").

### Phase 5: Reflect (The Review)

*   **User Goal:** Close the day, acknowledge progress, and learn for tomorrow.
*   **Context:** End of workday shutdown ritual.
*   **Emotional State:**
    *   **Before:** `Tired`, perhaps `Defensive` (if tasks were missed).
    *   **During:** `Accepting`, `Analytical`.
    *   **After:** `Accomplished`, `Closure`, `Disconnected` (ready to rest).
*   **Psychological "Why" (The Science):**
    *   **Positive Reinforcement:** acknowledging "Done" releases dopamine, reinforcing the habit of using the system.
    *   **Growth Mindset:** Framing incomplete tasks as data points ("Why did this slip?") rather than failures encourages learning and better estimation for the future.
    *   **Psychological Detachment:** A formal "shutdown" ritual signals the brain that work is done, aiding recovery and reducing burnout.

---

## 3. Implications for Gherkin Scenarios

When writing scenarios, Kujan should ensure the language reflects these psychological needs:

*   **Avoid:** Dry, mechanical steps (e.g., "Given I have a task...").
*   **Prefer:** Scenarios that acknowledge the user's state (e.g., "Given I am feeling overwhelmed by a backlog of 50 tasks...").
*   **Feature Focus:**
    *   **Smart Suggestions:** Should feel like a "relief," not a "command."
    *   **Postponement prompts:** Must be non-judgmental to avoid triggering shame.
    *   **"Today's 5":** Should feel like a protective boundary, not a restrictive limit.
