# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize Vue 3 + TypeScript project with Vite
- [ ] T003 [P] Configure ESLint + Prettier with Vue 3 rules
- [ ] T004 [P] Setup Tailwind CSS with design tokens
- [ ] T005 [P] Configure Pinia store structure
- [ ] T006 [P] Setup testing framework (Vitest + Vue Test Utils)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] T007 [P] Unit test component rendering in tests/unit/components/
- [ ] T008 [P] Integration test user interactions in tests/integration/
- [ ] T009 [P] E2E test critical user journeys in tests/e2e/
- [ ] T010 [P] Accessibility test with axe-core in tests/a11y/
- [ ] T011 [P] Performance test with Lighthouse CI in tests/performance/

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] T012 [P] Base components (BaseInput, BaseButton) in src/core/components/
- [ ] T013 [P] Pinia stores (auth, tasks, activities, habits) in src/stores/
- [ ] T014 [P] Vue components with Composition API in src/modules/
- [ ] T015 [P] TypeScript interfaces and types in src/types/
- [ ] T016 [P] Composables for shared logic in src/composables/
- [ ] T017 Input validation with Zod schemas
- [ ] T018 Error handling and user feedback

## Phase 3.4: Integration

- [ ] T019 [P] Router configuration with lazy loading in src/router/
- [ ] T020 [P] Layout components (MainLayout, AuthLayout) in src/layouts/
- [ ] T021 [P] localStorage persistence with error handling
- [ ] T022 [P] Dark mode toggle with system preference detection
- [ ] T023 [P] Responsive design implementation
- [ ] T024 [P] Accessibility features (ARIA labels, keyboard navigation)

## Phase 3.5: Polish

- [ ] T025 [P] Performance optimization (code splitting, lazy loading)
- [ ] T026 [P] Bundle size analysis and optimization
- [ ] T027 [P] Lighthouse CI performance validation
- [ ] T028 [P] Code coverage verification (90%+ target)
- [ ] T029 [P] Documentation updates (README, API docs)
- [ ] T030 [P] Final accessibility audit
- [ ] T031 [P] Manual testing and user acceptance

## Dependencies

- Tests (T007-T011) before implementation (T012-T018)
- T012 (Base components) blocks T014 (Vue components)
- T013 (Pinia stores) blocks T021 (localStorage persistence)
- T015 (TypeScript types) blocks T016 (Composables)
- Implementation before integration (T012-T018) before (T019-T024)
- Integration before polish (T019-T024) before (T025-T031)

## Parallel Example

```
# Launch T007-T011 together (Tests First):
Task: "Unit test component rendering in tests/unit/components/"
Task: "Integration test user interactions in tests/integration/"
Task: "E2E test critical user journeys in tests/e2e/"
Task: "Accessibility test with axe-core in tests/a11y/"
Task: "Performance test with Lighthouse CI in tests/performance/"

# Launch T012-T016 together (Core Implementation):
Task: "Base components (BaseInput, BaseButton) in src/core/components/"
Task: "Pinia stores (auth, tasks, activities, habits) in src/stores/"
Task: "Vue components with Composition API in src/modules/"
Task: "TypeScript interfaces and types in src/types/"
Task: "Composables for shared logic in src/composables/"
```

## Notes

- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Follow Vue 3 Composition API patterns
- Use TypeScript strict mode throughout
- Ensure accessibility compliance (WCAG 2.1 AA)
- Maintain performance targets (<200ms core actions)
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules

_Applied during main() execution_

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist

_GATE: Checked by main() before returning_

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
