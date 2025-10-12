# File Structure

## Overview

This document outlines the actual file structure of the Vue 3 + Tailwind Todo application (JustDo Vue). The project follows a modular architecture with clear separation between core functionality, feature modules, and shared components.

## Current Project Structure

The Vue 3 + Tailwind Todo application (JustDo Vue) is organized using a **modular architecture** that separates concerns and promotes maintainability:

1. **Core System** - Shared components, utilities, and infrastructure
2. **Feature Modules** - Self-contained business logic (activities, habits, tasks, auth, labels)
3. **Layout System** - Application layouts and navigation
4. **Pages** - Route-level components
5. **State Management** - Pinia stores for modern state management
6. **Testing** - Comprehensive test coverage across all layers

## Guiding Principles

1. **Modular Architecture** - Each feature is self-contained with its own components, store, and types
2. **Core Reusability** - Shared components and utilities in the core system
3. **Feature Isolation** - Business logic is encapsulated within feature modules
4. **Clear Boundaries** - Distinct separation between UI, business logic, and data layers

## Current Project Structure

```bash
├── src/
│   ├── main.ts                      # Application entry point
│   ├── App.vue                      # Root component
│   ├── core/                        # Core system - shared components & utilities
│   │   ├── components/              # Reusable UI components
│   │   │   ├── BaseCard.vue         # Base card component
│   │   │   ├── BaseInput.vue        # Base input component
│   │   │   ├── BaseCheckbox.vue     # Base checkbox component
│   │   │   ├── BaseSelect.vue       # Base select component
│   │   │   ├── BaseTextarea.vue     # Base textarea component
│   │   │   ├── BaseTag.vue          # Base tag component
│   │   │   ├── BaseListItem.vue     # Base list item component
│   │   │   ├── ActivityStats.vue    # Activity statistics component
│   │   │   ├── NavItem.vue          # Navigation item component
│   │   │   └── charts/              # Chart components
│   │   │       ├── ActivityCategoryChart.vue
│   │   │       ├── ActivityCompletionChart.vue
│   │   │       ├── ActivityHoursChart.vue
│   │   │       └── ProductivityChart.vue
│   │   ├── icons/                   # Icon components
│   │   │   ├── index.js             # Icon exports
│   │   │   └── SpinnerIcon.vue      # Spinner icon component
│   │   ├── composables/             # Shared composables
│   │   ├── accessibility/           # Accessibility utilities
│   │   ├── error-boundaries/        # Error handling components
│   │   ├── migrations/              # Data migration utilities
│   │   ├── performance/             # Performance optimization utilities
│   │   ├── persistence/             # Data persistence utilities
│   │   ├── repositories/            # Data access layer
│   │   ├── search/                  # Search functionality
│   │   ├── styles/                  # Core styles
│   │   ├── themes/                  # Theme system
│   │   ├── utils/                   # Core utility functions
│   │   └── validation/              # Validation utilities
│   ├── modules/                     # Feature modules
│   │   ├── activities/              # Activity management module
│   │   │   ├── components/          # Activity-specific components
│   │   │   │   ├── ActivityCard.vue
│   │   │   │   └── NewActivityModal.vue
│   │   │   ├── store/               # Activity store (Pinia)
│   │   │   │   └── activities.store.ts
│   │   │   └── types/               # Activity type definitions
│   │   │       └── activity.types.ts
│   │   ├── auth/                    # Authentication module
│   │   │   ├── components/          # Auth-specific components
│   │   │   │   └── LoginForm.vue
│   │   │   ├── pages/               # Auth pages
│   │   │   │   └── LoginPage.vue
│   │   │   ├── store/               # Auth store (Pinia)
│   │   │   │   └── auth.store.ts
│   │   │   └── types/               # Auth type definitions
│   │   │       └── index.ts
│   │   ├── habits/                  # Habit tracking module
│   │   │   ├── components/          # Habit-specific components
│   │   │   │   └── HabitCard.vue
│   │   │   ├── store/               # Habit store (Pinia)
│   │   │   │   └── habits.store.ts
│   │   │   └── types/               # Habit type definitions
│   │   │       └── index.ts
│   │   ├── labels/                  # Label management module
│   │   │   ├── components/          # Label-specific components
│   │   │   ├── store/               # Label store (Pinia)
│   │   │   └── types/               # Label type definitions
│   │   └── tasks/                   # Task management module
│   │       ├── components/          # Task-specific components
│   │       │   ├── TaskItem.vue
│   │       │   └── TodoList.vue
│   │       ├── store/               # Task store (Pinia)
│   │       └── types/               # Task type definitions
│   ├── layouts/                     # Layout components
│   │   ├── AppHeader.vue            # Application header
│   │   ├── AppSidebar.vue           # Application sidebar
│   │   ├── AuthLayout.vue           # Authentication layout
│   │   ├── DashboardLayout.vue     # Dashboard layout
│   │   └── MainLayout.vue           # Main application layout
│   ├── pages/                       # Page components
│   │   ├── TodayView.vue            # Today page component
│   │   ├── ActivityListView.vue     # Activity list view
│   │   └── DashboardView.vue        # Dashboard view
│   ├── router/                      # Router configuration
│   │   └── index.ts                 # Main router setup
│   ├── stores/                      # Legacy stores (migration in progress)
│   │   └── todoStore.js             # Legacy todo store (Pinia)
│   ├── styles/                      # Global styles
│   │   └── main.css                 # Main stylesheet
│   ├── types/                       # Global type definitions
│   └── assets/                      # Static assets
│       └── vue.svg                  # Vue logo
├── public/                          # Public static files
│   ├── images/                      # Public images
│   │   ├── habit_cooking.png
│   │   ├── habit_observing.png
│   │   ├── habit_reading.png
│   │   ├── habit_selfcaring.png
│   │   ├── habit_singing.png
│   │   ├── habits/                  # Habit-specific images
│   │   └── ms-todo-logo.png
│   └── vite.svg                     # Vite logo
├── tests/                           # Test files
│   ├── unit/                        # Unit tests
│   │   ├── components/              # Component unit tests
│   │   └── stores/                  # Store unit tests
│   ├── integration/                 # Integration tests
│   ├── e2e/                        # End-to-end tests
│   ├── a11y/                       # Accessibility tests
│   └── performance/                 # Performance tests
├── document/                        # Project documentation
│   ├── index.md
│   ├── file-structure.md
│   ├── state-management.md
│   ├── routing.md
│   ├── testing.md
│   ├── error-handling.md
│   ├── logging.md
│   ├── milddware.md
│   ├── utility.md
│   └── custom-enviroment.md
├── specs/                           # Feature specifications
│   └── 001-make-labels-feature/
│       └── contracts/
├── scripts/                         # Build and utility scripts
├── test-results/                    # Test execution results
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── pnpm-lock.yaml                   # Package lock file
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.node.json               # Node.js TypeScript configuration
├── vite.config.ts                   # Vite configuration
├── cleanup.sh                       # Project cleanup script
└── README.md                        # Project documentation
```

## Directory Explanations

### `src/`

The main source directory containing all application code, organized using a modular architecture.

#### `src/core/`

The core system containing shared components, utilities, and infrastructure:

- **`components/`**: Reusable UI components with consistent design patterns
  - Base components (BaseCard, BaseInput, BaseCheckbox, etc.)
  - Specialized components (ActivityStats, NavItem)
  - Chart components for data visualization
- **`icons/`**: Icon components and icon management
- **`composables/`**: Shared composition functions
- **`accessibility/`**: Accessibility utilities and helpers
- **`error-boundaries/`**: Error handling components
- **`migrations/`**: Data migration utilities
- **`performance/`**: Performance optimization utilities
- **`persistence/`**: Data persistence utilities
- **`repositories/`**: Data access layer abstractions
- **`search/`**: Search functionality and utilities
- **`styles/`**: Core styling system
- **`themes/`**: Theme system and customization
- **`utils/`**: Core utility functions
- **`validation/`**: Validation utilities and schemas

#### `src/modules/`

Feature modules containing self-contained business logic:

Each module follows a consistent structure:
- **`components/`**: Module-specific components
- **`store/`**: Pinia store for state management
- **`types/`**: TypeScript type definitions
- **`pages/`**: Module-specific pages (when applicable)

**Current modules:**
- **`activities/`**: Activity management (tracking, creation, statistics)
- **`auth/`**: Authentication and user management
- **`habits/`**: Habit tracking and management
- **`labels/`**: Label management system
- **`tasks/`**: Task management and todo functionality

#### `src/layouts/`

Layout components that define the application structure:

- **`AppHeader.vue`**: Application header with navigation
- **`AppSidebar.vue`**: Sidebar navigation component
- **`AuthLayout.vue`**: Layout for authentication pages
- **`DashboardLayout.vue`**: Main dashboard layout
- **`MainLayout.vue`**: Primary application layout

#### `src/pages/`

Page components for specific routes and main application views:

- **`TodayPage.vue`**: Today page implementation
- **`ActivityListView.vue`**: Activity list and management view
- **`DashboardView.vue`**: Main dashboard with statistics
- **`TodayView.vue`**: Today's activities and tasks view

#### `src/router/`

Router configuration and navigation:

- **`index.ts`**: Main router setup with route definitions and navigation guards

#### `src/stores/`

Legacy store files (currently being migrated to module-based Pinia stores):

- **`todoStore.js`**: Legacy todo store using Pinia (defineStore pattern)

#### `src/styles/`

Global styling and CSS:

- **`main.css`**: Main stylesheet with Tailwind CSS imports

#### `src/types/`

Global TypeScript type definitions and interfaces.

#### `src/assets/`

Static assets and resources:

- **`vue.svg`**: Vue.js logo and branding assets

### `tests/`

Comprehensive testing structure organized by test type:

- **`unit/`**: Unit tests for components and stores
  - **`components/`**: Component unit tests
  - **`stores/`**: Store unit tests
- **`integration/`**: Integration tests for feature workflows
- **`e2e/`**: End-to-end tests for user journeys
- **`a11y/`**: Accessibility tests
- **`performance/`**: Performance and load tests

### `public/`

Public static files served directly by the web server:

- **`images/`**: Public images and assets
  - Habit-related images (cooking, reading, self-care, etc.)
  - Application logos and branding
- **`vite.svg`**: Vite logo and assets

### `document/`

Project documentation and guides:

- **`index.md`**: Main documentation index
- **`file-structure.md`**: This file structure guide
- **`state-management.md`**: State management patterns
- **`routing.md`**: Routing and navigation guide
- **`testing.md`**: Testing strategies and patterns
- **`error-handling.md`**: Error handling approaches
- **`logging.md`**: Logging and monitoring
- **`milddware.md`**: Middleware patterns
- **`utility.md`**: Utility functions guide
- **`custom-enviroment.md`**: Environment configuration

### `specs/`

Feature specifications and contracts:

- **`001-make-labels-feature/`**: Label management feature specification
  - **`contracts/`**: API contracts and interfaces

### Root Level Files

- **`index.html`**: HTML entry point
- **`package.json`**: Dependencies and npm scripts
- **`pnpm-lock.yaml`**: Package lock file for dependency management
- **`tailwind.config.ts`**: Tailwind CSS configuration
- **`tsconfig.json`**: TypeScript configuration
- **`tsconfig.node.json`**: Node.js TypeScript configuration
- **`vite.config.ts`**: Vite build tool configuration
- **`cleanup.sh`**: Project cleanup and organization script
- **`README.md`**: Project overview and setup instructions

## Naming Conventions

### Files

- **Components**: PascalCase (e.g., `ActivityCard.vue`, `BaseInput.vue`, `TodoList.vue`)
- **Stores**: camelCase with `.store.ts` suffix (e.g., `activities.store.ts`, `auth.store.ts`)
- **Types**: camelCase with `.types.ts` suffix (e.g., `activity.types.ts`)
- **Pages**: PascalCase with `Page.vue` suffix (e.g., `LoginPage.vue`)
- **Views**: PascalCase with `View.vue` suffix (e.g., `DashboardView.vue`)
- **Layouts**: PascalCase with `Layout.vue` suffix (e.g., `AuthLayout.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useAuth.ts`, `useForm.ts`)
- **Utilities**: camelCase (e.g., `dateFormat.ts`, `validation.ts`)
- **Tests**: Same as source file with `.test.ts` or `.spec.ts` suffix

### Directories

- Use **kebab-case** for directory names when they contain multiple words
- Use singular for feature modules (`activities`, `habits`, `tasks`)
- Use plural for collections (`components`, `stores`, `types`)
- Use descriptive names that clearly indicate purpose

## Best Practices

### 1. Modular Architecture

Organize code by feature modules with clear boundaries:

```bash
# ✅ Good - Self-contained modules
src/modules/activities/
  ├── components/          # Activity-specific components
  ├── store/              # Activity state management
  ├── types/              # Activity type definitions
  └── pages/              # Activity pages (if needed)

# ❌ Avoid - Scattered across directories
src/components/ActivityCard.vue
src/stores/activities.js
src/types/activity.ts
```

### 2. Core System Reusability

Keep shared components and utilities in the core system:

```bash
# ✅ Good - Reusable base components
src/core/components/
  ├── BaseCard.vue
  ├── BaseInput.vue
  └── BaseButton.vue

# ❌ Avoid - Duplicating common functionality
src/modules/activities/components/ActivityCard.vue
src/modules/habits/components/HabitCard.vue  # Similar functionality
```

### 3. Consistent Module Structure

Each feature module should follow the same structure:

```bash
# ✅ Good - Consistent module structure
src/modules/[feature]/
  ├── components/         # Feature-specific components
  ├── store/             # Pinia store
  ├── types/             # TypeScript definitions
  └── pages/             # Feature pages (optional)
```

### 4. Clear Separation of Concerns

Distinguish between different layers of the application:

```bash
# ✅ Good - Clear separation
src/core/                # Shared infrastructure
src/modules/             # Business logic
src/layouts/             # Layout components
src/pages/               # Page components and route-level components
```

### 5. Avoid Deep Nesting

Keep directory depth manageable (3-4 levels max):

```bash
# ✅ Good
src/modules/activities/components/

# ❌ Avoid
src/modules/activities/components/forms/inputs/fields/ActivityTitleInput.vue
```

## Path Aliases

Configure path aliases in `tsconfig.json` and `vite.config.ts` for clean imports:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["./src/core/*"],
      "@modules/*": ["./src/modules/*"],
      "@layouts/*": ["./src/layouts/*"],
      "@pages/*": ["./src/pages/*"],
      "@stores/*": ["./src/stores/*"],
      "@types/*": ["./src/types/*"],
      "@styles/*": ["./src/styles/*"]
    }
  }
}
```

## Technology Stack

The JustDo Vue application uses modern web technologies:

- **Vue 3**: Composition API with TypeScript
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework (v4.1.4)
- **Pinia**: Modern state management for Vue (v2.1.7)
- **Vue Router**: Client-side routing (v4.5.0)
- **Heroicons**: Beautiful SVG icons (v2.2.0)
- **Chart.js**: Data visualization (v4.4.9)
- **Headless UI**: Accessible UI components (v1.7.23)

## Key Architectural Decisions

1. **Modular Architecture**: Features are self-contained with clear boundaries
2. **Core System**: Shared components and utilities in a centralized location
3. **Pinia Stores**: Modern state management with composition API
4. **TypeScript**: Type safety throughout the application
5. **Component Composition**: Reusable base components with consistent patterns
6. **Layout System**: Flexible layout components for different application contexts
7. **Route-based Layouts**: Different layouts for auth and dashboard sections

## Additional Notes

- Each module should be self-contained and testable independently
- Core components should be highly reusable across modules
- Keep the root directory clean with only configuration files
- Use TypeScript for type safety and better developer experience
- Follow Vue 3 Composition API patterns consistently
- Document complex directory structures and architectural decisions

---

[← Back to Index](./index.md) | [Next: State Management →](./state-management.md)

