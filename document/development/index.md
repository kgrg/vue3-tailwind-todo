# JustDo Vue - Documentation

Welcome to the JustDo Vue documentation. This documentation provides comprehensive guidelines and best practices for building consistent, maintainable, and scalable Vue 3 applications with Pinia state management.

## Table of Contents

### Core Concepts

1. **[File Structure](./file-structure.md)**
   - Learn about the recommended project structure
   - Understand how to organize your Vue 3 application
   - Follow guiding principles for file organization

2. **[Component Organisation](./component-organisation.md)**
   - Feature-first folder structure for components
   - Naming conventions for shared and feature components
   - Composition patterns and testing strategy

3. **[State Management](./state-management.md)**
   - Pinia patterns and best practices
   - Store composition and reactive state
   - Module organization and naming conventions

4. **[Routing](./routing.md)**
   - Modular routing architecture
   - Route organization and structure
   - Navigation guards and lazy loading

5. **[Architecture Review & Refactor Plan](./refactor-plan.md)**
   - Current architecture snapshot
   - Refactor goals and phased plan
   - Suggested progress metrics

### Development Practices

5. **[Testing](./testing.md)**
   - AAA (Arrange-Act-Assert) testing pattern
   - Vue Testing Utils and Jest setup
   - Component and unit testing strategies

6. **[Error Handling](./error-handling.md)**
   - Global error handling strategies
   - Component-level error boundaries
   - API error management

7. **[Logging](./logging.md)**
   - Centralized logging with Pinia stores
   - Log levels and formatting
   - Production logging best practices

### Utilities & Configuration

8. **[Utility Functions](./utility.md)**
   - Date formatting utilities
   - Common helper functions
   - Type-safe utility patterns

9. **[Middleware](./milddware.md)**
   - Route middleware implementation
   - Authentication and authorization guards
   - Request/response interceptors

10. **[Custom Environment](./custom-enviroment.md)**
   - Environment variable configuration
   - Multi-environment setup
   - Build-time vs runtime configuration

## Guiding Principles

Our coding styleguide is built on these core principles:

1. **Consistency**: Code should look like it was written by a single developer
2. **Maintainability**: Prioritize code that is easy to understand and modify
3. **Scalability**: Structure should support growth from small to large applications
4. **Type Safety**: Leverage TypeScript for better developer experience
5. **Testing**: Write testable code with comprehensive coverage
6. **Performance**: Optimize for bundle size and runtime performance

## Quick Start

If you're new to this styleguide, we recommend reading the documentation in this order:

1. Start with [File Structure](./file-structure.md) to understand project organization
2. Read [State Management](./state-management.md) to learn Pinia patterns
3. Review [Routing](./routing.md) for navigation setup
4. Study [Testing](./testing.md) to write quality tests
5. Explore other guides as needed

## Code Quality Standards

All code in this project should:

- ✅ Follow Vue 3 Composition API best practices
- ✅ Use TypeScript for type safety
- ✅ Include unit tests with >80% coverage
- ✅ Pass all linting rules (ESLint + Prettier)
- ✅ Follow accessibility (a11y) guidelines
- ✅ Be documented with JSDoc comments for complex logic

## Contributing

When adding new patterns or guidelines:

1. Ensure they align with Vue 3 best practices
2. Provide clear examples
3. Document the reasoning behind the pattern
4. Update relevant sections in this guide

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Vue Version**: 3.x  
**Pinia Version**: 2.x  
**Vite Version**: 5.x
