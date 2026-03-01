---
name: Generate Tests
description: Generate tests for a specified module, component, or store in the TaskFlow app.
---

# Generate Tests

Use the **test-writer agent** (`.github/agents/test-writer.agent.md`) mindset to write tests.

## Required Input

The user must specify what to test. Examples:
- "Generate tests for the activities store"
- "Write component tests for ActivityCard.vue"
- "Test the auth store login/logout actions"

## Prerequisites

> **No test runner is currently installed.** Before running any generated tests, the user must install a test runner. Recommended:
>
> ```bash
> pnpm add -D vitest @vue/test-utils @testing-library/vue jsdom
> ```
>
> Then configure `vite.config.ts` with Vitest and add `test` scripts to `package.json`.
> See `.github/agents/test-writer.agent.md` for full setup instructions.

## Steps

1. **Read context:**
   - `artifacts/repo_facts.json` — repo facts.
   - `docs/ARCH_SUMMARY.md` — architecture patterns.
   - `docs/REPO_MAP.md` — find the files to test.
   - The source file(s) to test.

2. **Determine test scope:**
   - **Store tests:** state initialization, getter computations, action side effects, error handling.
   - **Component tests:** rendering, props, events, user interactions, conditional rendering.
   - **Composable tests:** return values, reactive behavior.
   - **Utility tests:** pure function input/output.

3. **Write tests following conventions:**
   - Place in `__tests__/` adjacent to the source.
   - Use AAA pattern (Arrange-Act-Assert).
   - Mock external dependencies.
   - Each test is independent and isolated.
   - Use `data-testid` for component queries.

4. **Output each test file** with:
   - Full file path.
   - What is being tested.
   - Complete test file contents.

## Rules

- Do not modify product source code.
- Always warn the user about missing test runner.
- Use Vitest syntax (`describe`, `it`, `expect`, `vi.fn()`).
- Mock Pinia stores in component tests using `createTestingPinia`.
