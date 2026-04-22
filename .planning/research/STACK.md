# Stack Research

**Domain:** Recruiter-facing portfolio UX/UI improvement milestone (v1.2)
**Researched:** 2026-04-21
**Confidence:** HIGH

## Recommended Stack

**Bottom line:** keep the core stack unchanged. This milestone does **not** justify framework churn. Tailwind 4 already covers responsive layout work, spacing rhythm, and skeleton styling; Next.js 16 already covers SEO-safe server rendering and loading boundaries. Add **one** runtime dependency only if CSS-only motion becomes too limited: **`motion`**.

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.2.3 (current app), docs verified on 16.2.4 | Server-first App Router, SEO-safe recruiter content, route/loading boundaries | Keep it. Official docs confirm pages/layouts are Server Components by default, which is exactly what this milestone needs: preserve server-rendered recruiter content while adding polish only where interactivity is needed. |
| React + react-dom | 19.2.4 | UI composition, Suspense, transitions in client islands | Keep it. React 19 already provides the primitives needed for pending/loading coordination; do not add state or animation frameworks to solve problems React already handles. |
| Tailwind CSS | 4.x | Responsive layout, spacing rhythm, skeleton screens, reduced-motion variants, container queries | Keep it. Official Tailwind docs confirm built-in responsive utilities, `motion-safe` / `motion-reduce`, `animate-pulse`, custom theme variables, and built-in container queries. That covers most of this milestone without extra packages. |
| OGL | 1.0.11 | Existing knowledge-map renderer | Keep it. The milestone is polish, not renderer replacement. Motion should animate surrounding UI and panel transitions; OGL should stay isolated in the existing narrow client island. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `motion` | 12.37.0 | Coordinated reveals, `AnimatePresence`, shared transition timing, reduced-motion hook, optional layout animation | **Optional but recommended** if Tailwind transitions become hard to coordinate across section reveals, panel swaps, and timeline emphasis. Use it sparingly at leaf components, not as a page-wide client wrapper. |
| `server-only` | 0.0.1 | Guard SEO/content loaders from leaking into client bundles | **No new install needed** (already present). Keep using it around recruiter-content loaders like `getPortfolioContent()` so layout restructuring does not accidentally widen the client boundary. |
| `client-only` | 0.0.1 | Guard extracted browser-only animation/OGL helpers | **Optional addition** only if v1.2 extracts browser-only motion or canvas utilities into shared modules. Useful for protecting the narrow client island during refactors. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Existing Playwright (`@playwright/test` 1.51.1) | Responsive and motion-regression verification | Keep it. Use viewport coverage and interaction checks instead of adding a visual-regression platform for this milestone. |
| Existing ESLint + Next rules | Prevent accidental server/client boundary mistakes | Keep current tooling; this milestone does not need lint-stack churn. |

## Installation

```bash
# Core
# No required core stack changes for v1.2

# Optional runtime addition for richer motion orchestration
npm install motion@12.37.0

# Optional boundary guard if browser-only helpers are extracted
npm install client-only@0.0.1
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Tailwind 4 utilities + theme tokens for skeletons and spacing | `react-loading-skeleton` or similar placeholder library | Only if the app grows into a multi-surface design system with many reusable skeleton patterns. For one recruiter page, Tailwind `animate-pulse` is enough. |
| `motion` | GSAP | Only if the portfolio becomes a choreography-heavy storytelling site with complex scroll timelines or SVG sequencing. That is not this milestone. |
| Tailwind 4 built-in container queries | `@tailwindcss/container-queries` plugin | Only for older Tailwind versions. Tailwind 4 already ships container query support. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `react-loading-skeleton` | Extra dependency for simple placeholders; adds API surface without solving a hard problem here | Tailwind `animate-pulse` plus local skeleton atoms sized to real recruiter content blocks |
| `@tailwindcss/container-queries` | Redundant in Tailwind 4; built-in container queries already exist | Tailwind 4 `@container`, `@md`, `@max-*`, and custom `--container-*` values |
| GSAP / ScrollTrigger | Overpowered and too imperative for a mostly static recruiter page; increases bundle and complexity | Tailwind transitions for simple polish, `motion` only where orchestration is genuinely needed |
| Smooth-scroll / parallax libraries (Lenis-style additions, heavy scroll hijacking) | Risky for accessibility, recruiter readability, and perceived performance; can fight browser defaults | Native scrolling plus restrained reveal animations |
| Replacing OGL | Changes too many variables during a polish milestone | Keep OGL and improve the surrounding UI transitions only |

## Stack Patterns by Variant

**If the change is only spacing, responsive behavior, and simple hover polish:**
- Use existing Tailwind 4 utilities only.
- Add or refine `@theme` tokens for spacing, section gaps, radii, and animation durations/easings.
- Use `motion-safe:` / `motion-reduce:` variants for accessibility.
- Because this keeps the page fully server-first and adds zero runtime JS.

**If the change needs coordinated motion across multiple UI elements:**
- Add `motion@12.37.0`.
- For server-rendered section wrappers, prefer `motion/react-client` so the section can stay server-rendered instead of turning the whole file into a broad client component.
- Inside the existing `KnowledgeExperienceCoordinator` island, prefer `LazyMotion` with `m` components.
- Start with `domAnimation`; switch to `domMax` only if you truly need layout animations for reflow/reordering.
- Because this preserves the narrow-client-island architecture and keeps bundle growth controlled.

**If adding loading states:**
- Do **not** add a loading-state library.
- Use Tailwind skeleton atoms for inline placeholders.
- Use Next.js `loading.tsx` or local `Suspense` fallbacks only for genuinely async/streamed subtrees.
- For this app specifically, route-level loading is probably unnecessary unless layout restructuring introduces real async segmentation; the recruiter page already reads structured local content and should primarily server-render immediately.

**If layout restructuring gets deeper:**
- Keep content sections as Server Components.
- Move only interaction-heavy wrappers to client boundaries.
- Use Tailwind container queries and responsive utilities before adding any layout framework.
- Because the main product value is scan speed and SEO-safe recruiter content, not animation novelty.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@16.2.3` | `react@19.2.4`, `react-dom@19.2.4` | Matches the current repo; official Next 16 docs used for server/client and loading guidance. |
| `motion@12.37.0` | React `18.2+` | Official Motion docs state compatibility with React 18.2 and higher, so React 19.2.4 is supported. |
| `motion@12.37.0` | Next.js App Router | Official Motion docs show App Router usage via client components or `motion/react-client`. |
| `tailwindcss@4.x` | Next.js 16 app styles | Official Tailwind docs confirm built-in responsive utilities, animation utilities, reduced-motion variants, and container queries. |
| `server-only@0.0.1` / `client-only@0.0.1` | Next.js App Router | Official Next docs treat them as optional boundary markers handled internally by Next.js. |

## Milestone-Specific Recommendation

### Required additions

None.

This milestone can ship on the existing stack for:
- spacing/padding rhythm tuning,
- responsive layout improvements,
- skeleton screens,
- basic hover/focus micro-interactions,
- and SEO-safe layout restructuring.

### Optional additions

1. **`motion@12.37.0`** — add only if you want a single, consistent motion system for:
   - section reveals,
   - panel enter/exit,
   - timeline emphasis transitions,
   - reduced-motion-aware animation logic,
   - or layout animation during component reshuffles.
2. **`client-only@0.0.1`** — add only if extracted browser-only helpers start crossing module boundaries.

### No-change areas

1. **Next.js 16** — keep server-first rendering and SEO-safe recruiter content delivery.
2. **React 19** — keep native Suspense/transition primitives; do not add state-management libraries.
3. **Tailwind 4** — keep as the primary tool for responsive behavior, spacing rhythm, and skeleton styling.
4. **OGL** — keep the current renderer; animate around it, not through a replacement.

## Sources

- Repo source — `/home/riccardolm/github/94lama/package.json` — verified currently installed versions (`next@16.2.3`, `react@19.2.4`, `ogl@1.0.11`) — **HIGH**
- Next.js docs — https://nextjs.org/docs/app/getting-started/server-and-client-components — verified Server/Client Component boundaries and narrow client bundle guidance — **HIGH**
- Next.js docs — https://nextjs.org/docs/app/api-reference/file-conventions/loading — verified `loading.tsx`, Suspense integration, and SEO-safe streaming behavior — **HIGH**
- Next.js docs — https://nextjs.org/docs/app/getting-started/project-structure — verified route/loading/layout organization options for restructuring without changing URLs — **HIGH**
- React docs — https://react.dev/reference/react/Suspense — verified Suspense fallback behavior and loading-boundary tradeoffs — **HIGH**
- Tailwind docs — https://tailwindcss.com/docs/animation — verified `animate-pulse`, reduced-motion variants, and custom animation theme variables — **HIGH**
- Tailwind docs — https://tailwindcss.com/docs/responsive-design — verified mobile-first responsive utilities and built-in container queries in Tailwind 4 — **HIGH**
- Motion docs — https://motion.dev/docs/react-installation — verified package name, React compatibility (`18.2+`), and Next.js App Router usage — **HIGH**
- Motion docs — https://motion.dev/docs/react-reduce-bundle-size — verified `LazyMotion`, `m`, `domAnimation`, and `domMax` bundle-size strategy — **HIGH**
- Motion docs — https://motion.dev/docs/react-use-reduced-motion — verified `useReducedMotion` hook for accessible motion fallback logic — **HIGH**
- Motion docs — https://motion.dev/docs/react-tailwind — verified Tailwind + Motion integration patterns and transition-conflict caveats — **HIGH**

---
*Stack research for: recruiter-facing portfolio UX/UI improvement milestone v1.2*
*Researched: 2026-04-21*
