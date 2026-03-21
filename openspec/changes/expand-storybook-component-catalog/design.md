## Context

`packages/ui` already exists as the shared Vue component package and has a package-local Storybook setup, but the current catalog is small and uneven. Stories exist only for `BaseCard`, `BaseCheckbox`, `BaseInput`, `BaseSelect`, and `BaseTextarea`, with titles limited to `Layout` and `Form`. The requested change is not just additive component work; it also establishes the information architecture that future stories should follow.

The category list includes both conventional UI primitive groups such as `Layout`, `Element`, `Form`, and `Overlay`, and product-flavored groups such as `Dashboard`, `AI Chat`, `Editor`, `Color Mode`, and `i18n`. Some of those categories map cleanly to reusable Vue components, while others are better represented by lightweight Storybook demo components or documentation-oriented stories that showcase shared patterns without pulling app-specific stores, routing, or localization infrastructure into the package.

## Goals / Non-Goals

**Goals:**
- Expand the shared UI package with a broader starter catalog of basic components and supporting stories.
- Standardize Storybook story titles under the requested category taxonomy so navigation remains predictable.
- Keep new components app-agnostic and package-owned, with exports available from `packages/ui/src/index.ts` when the components are intended for reuse.
- Represent category-only concerns such as `Color Mode` and `i18n` with lightweight shared demos or wrappers when a full reusable primitive is not warranted.

**Non-Goals:**
- Build a complete production-ready design system for every category in one change.
- Introduce application state, router dependencies, or backend integration into the shared UI package.
- Rework the existing visual language beyond what is needed to create coherent starter components and stories.

## Decisions

### Use Storybook title prefixes as the category contract
The category taxonomy should be enforced through Storybook `title` values such as `Navigation/BaseTabs` and `Overlay/BaseModal`. This keeps categorization local to each story file, requires no custom Storybook addon work, and aligns with current practice in the package.

Alternative considered: maintain a separate mapping file for categories. Rejected because it creates another source of truth and does not naturally shape the Storybook sidebar.

### Add a thin starter component per reusable category, not a large multi-feature widget set
The package should grow through small, composable primitives such as buttons, badges, tabs, modal shells, empty states, stat cards, and message bubbles. This satisfies the request for more basic components while keeping implementation risk low and stories easy to understand.

Alternative considered: add a few large showcase components only. Rejected because it would make the catalog look broader without actually improving the base reusable surface.

### Represent product-flavored categories with package-safe demo components when needed
Categories such as `AI Chat`, `Editor`, `Color Mode`, and `i18n` should be represented by package-safe demos or wrappers if there is no existing production primitive yet. For example, a chat message row, an editor toolbar shell, a color mode toggle, or a locale switcher can demonstrate the category without requiring app stores or real translation infrastructure.

Alternative considered: skip categories that are not already backed by a strong primitive. Rejected because the user explicitly asked for these groups and the Storybook taxonomy should reflect the intended breadth of the catalog.

### Keep stories realistic and stateful enough to be useful
Each new story should cover more than a default static render. Stories should demonstrate representative states such as active, selected, disabled, empty, or populated variants so Storybook remains useful as a discovery and regression surface.

Alternative considered: create one default story per component. Rejected because the current gap is partly about Storybook being too thin to guide reuse.

## Risks / Trade-offs

- [Risk] Some requested categories may tempt implementation of app-specific behavior rather than reusable primitives. → Mitigation: keep package additions focused on shells, toggles, lists, and presentational components with serializable props.
- [Risk] Storybook taxonomy can become inconsistent if a few new stories follow the convention but later additions drift. → Mitigation: define the category list in the design and tasks, then normalize existing story titles as part of the same change.
- [Risk] Adding too many components at once can create shallow or redundant primitives. → Mitigation: prefer one well-scoped starter component per category over multiple overlapping components.
- [Risk] Categories like `Color Mode` and `i18n` may create misleading expectations about platform-wide infrastructure. → Mitigation: document them as basic shared demos and avoid implying full theme or localization systems in this change.

## Migration Plan

1. Normalize existing Storybook titles so current components align with the target taxonomy.
2. Add a first batch of reusable starter components in `packages/ui/src/components/` and export the reusable ones from `packages/ui/src/index.ts`.
3. Add or update stories so each requested category has at least one entry in Storybook.
4. Keep category-specific demo-only stories package-local when exporting them as public components would create unnecessary API surface.
5. Validate the shared package build and Storybook startup using the existing supported workspace commands.

Rollback is straightforward: revert the new components, exports, and story files, then restore any renamed Storybook titles.

## Open Questions

- Which exact starter component should represent each of the product-flavored categories if implementation scope needs to shrink.
- Whether any of the demo-only category stories should later graduate into exported public components after real usage appears in the web app.