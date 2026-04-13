# Stack Research

**Domain:** Architecture-first refactor of a recruiter-facing one-page portfolio with a narrow OGL interactive island
**Researched:** 2026-04-13
**Confidence:** HIGH

## Recommended Stack

**Bottom line:** keep the runtime stack almost unchanged. This milestone needs **better boundaries, tests, and module structure**, not a new UI framework.

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.2.3 | Server-first App Router composition | Official docs confirm pages/layouts are Server Components by default and `'use client'` defines the client bundle boundary. That directly matches the milestone goal: keep `app/page.tsx` thin and server-first while isolating the knowledge map as a narrow client island. |
| React + react-dom | 19.2.4 | Component model for atomic composition | React 19 is already the correct base for atomization. For this milestone, prefer pure components, local state, and prop-driven composition over introducing broader state machinery. Do **not** add manual memoization everywhere; React docs position memoization as a performance optimization, not a structuring tool. |
| Tailwind CSS | 4.x | Visual parity during refactor | Tailwind’s current guidance favors reusing styles through components and selective composition. That fits this refactor better than adding a new design system: extract atoms/molecules while preserving the existing utility-class output and current visual tokens in `section-card-styles.ts`. |
| OGL | 1.0.11 | Existing knowledge-map renderer | Keep OGL. Its low-abstraction design is a good fit for splitting the current monolith into smaller renderer modules without changing the visual behavior. Refactor around it instead of replacing it with Three.js, React Three Fiber, or a canvas abstraction. |
| TypeScript | 5.x | Safe extraction of UI and renderer modules | Strict TS is already enabled. It is the main safety net when breaking `app/page.tsx` and `skills-knowledge-map.tsx` into smaller units, especially for serializable server/client props and graph data contracts. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `server-only` | 0.0.1 | Guard server-only modules | **Optional but recommended** for modules like `get-portfolio-content()` and any future server-only composition helpers. Next.js officially supports it and it gives build-time errors if server code leaks into client islands. |
| `client-only` | 0.0.1 | Guard browser-only modules | **Optional but recommended** for OGL lifecycle helpers or browser API wrappers extracted out of `skills-knowledge-map.tsx`. Use when a non-component module must never be imported from the server tree. |
| `@playwright/test` | 1.59.1 | UI-parity regression testing | **Recommended dev addition** if you want safe refactoring without visual drift. Use screenshot comparisons for the recruiter-facing page and interaction checks for the knowledge-map island. This is the one material new tool for proving “same UI, new internals.” |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Existing ESLint flat config (`eslint-config-next/core-web-vitals` + `typescript`) | Boundary and correctness checks | Already aligned with Next 16 guidance. Keep it; do not swap lint stacks during this refactor. |
| TypeScript strict mode | Refactor safety | Keep `strict: true`. Consider tightening with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` once module extraction starts touching graph maps, optional CV fields, and index-based lookups. |
| Node built-in test runner | Pure logic tests | Keep for data/graph/ranking helpers. It is enough for extracted pure functions; no need to introduce Jest or Vitest just to atomize modules. |

## Installation

```bash
# Core
# No required runtime additions for this milestone.

# Supporting (optional but useful boundary markers)
npm install server-only client-only

# Dev dependencies (recommended for safe UI-parity refactor)
npm install -D @playwright/test
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Keep OGL and split it into graph/model + renderer lifecycle + interaction + presentational UI modules | Replace with Three.js / React Three Fiber | Only if the product is changing into a much richer 3D experience. For this milestone, replacement increases risk and changes too many variables at once. |
| Tailwind 4 + extracted local UI atoms | Add a component kit such as shadcn/ui, Radix-heavy primitives, or a new design system | Only if the milestone included a visual redesign or a larger multi-page UI system. It does not. |
| Node test runner + Playwright snapshots | Add Jest or Vitest + Storybook-first workflow | Use those later only if the app becomes a broader reusable component library. For this app, they add setup cost without being necessary to preserve current UI. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| React context or a global state library for selection state | The current shared state is local to the knowledge-map/timeline island. Expanding it upward would weaken the server/client boundary and spread client rendering across the page. | Keep state local in `KnowledgeExperienceCoordinator` and pass serializable props down. |
| New UI abstraction layers (`cva`, full design-system scaffolding, CSS-in-JS) | This milestone is preserving UI, not inventing a theming API. More abstraction would slow the refactor and increase churn. | Reuse `section-card-styles.ts`, extract plain atoms, and keep class output stable. |
| React Compiler adoption during this same milestone | React docs position it as a separate optimization path. Introducing compiler rollout while restructuring the tree makes failures harder to attribute. | Finish the architectural refactor first; evaluate compiler separately later. |
| OGL replacement or a new rendering engine | Replacing the renderer changes both architecture and rendering semantics at once. | Keep OGL and isolate it behind a small internal renderer/controller surface. |
| Storybook for this milestone | Helpful for design systems, but unnecessary overhead for a single-page UI-parity refactor with one interactive island. | Use Playwright screenshots on the actual page instead. |

## Stack Patterns by Variant

**If extracting server-rendered portfolio sections:**
- Keep sections as Server Components by default.
- Move only reusable presentational atoms/molecules into shared component files.
- Pass plain serializable props from `app/page.tsx` into any client island.
- Because Next 16 keeps pages/layouts server-first by default, this preserves the current boundary model instead of fighting it.

**If splitting the OGL knowledge map:**
- Use a small internal module split, not a new framework:
  - `graph/` pure TypeScript data construction and selection helpers
  - `renderer/` OGL scene setup, resize, render loop, disposal
  - `interaction/` pointer hit-testing and selection normalization
  - `ui/` presentational React pieces around the canvas
- If OOP helps, use it only inside the renderer layer for a scene/controller object that owns OGL resources and cleanup.
- Keep React responsible for orchestration and UI, not low-level WebGL lifetime management.

**If tightening refactor safety:**
- Add Playwright page screenshots for full-page parity.
- Add Playwright interaction coverage for “select skill -> related experience rises” behavior.
- Keep Node tests for ranking, graph generation, and selection normalization.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@16.2.3` | `react@19.2.4`, `react-dom@19.2.4` | Matches the current repo and official Next 16 docs used for boundary guidance. |
| `eslint-config-next@16.2.3` | `eslint@9` | Already configured correctly in the repo using flat config. |
| `server-only@0.0.1` / `client-only@0.0.1` | Next.js App Router | Next docs state these are optional marker packages handled internally to catch wrong-environment imports. |
| `@playwright/test@1.59.1` | Next.js app under local dev/build server | Use consistent environment for screenshot baselines; Playwright docs warn rendering can vary across OS/hardware. |

## Milestone-Specific Recommendation

### Required additions

None.

This milestone can be completed on the existing runtime stack if the refactor is disciplined about:
- server-first composition,
- pure presentational atoms,
- narrow client islands,
- and OGL internals split into focused modules.

### Recommended additions

1. **`@playwright/test`** for UI-parity and interaction regression checks.
2. **`server-only` / `client-only`** markers for extracted boundary-sensitive modules.

### Optional config tightening

1. Turn on **`noUncheckedIndexedAccess`** when graph/node maps are extracted further.
2. Turn on **`exactOptionalPropertyTypes`** if optional CV fields start leaking ambiguity into atom props.

These are useful because this refactor will create more small modules, more optional props, and more map/index lookups than the current monolith.

## Sources

- Next.js docs — https://nextjs.org/docs/app/getting-started/server-and-client-components — verified Server/Client Component boundaries and `server-only` / `client-only` guidance — **HIGH**
- Next.js docs — https://nextjs.org/docs/app/api-reference/config/eslint — verified Next 16 ESLint guidance and `next lint` removal — **HIGH**
- React docs — https://react.dev/reference/react/memo — verified memoization guidance for refactors — **HIGH**
- React docs — https://react.dev/learn/react-compiler — verified compiler exists but is a separate adoption path — **HIGH**
- Tailwind docs — https://tailwindcss.com/docs/styling-with-utility-classes — verified component-based reuse/composition guidance in Tailwind 4.x — **HIGH**
- OGL README — https://github.com/oframe/ogl — verified low-abstraction, modular WebGL positioning — **MEDIUM**
- Playwright docs — https://playwright.dev/docs/test-snapshots — verified screenshot comparison workflow and environment caveats — **HIGH**
- TypeScript TSConfig reference — https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess — verified stricter indexed-access behavior and related strict options — **HIGH**

---
*Stack research for: v1.1 implement atomization of components*
*Researched: 2026-04-13*
