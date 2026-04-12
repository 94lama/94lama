# Stack Research: v1.1 TODO refresh

**Project:** Riccardo La Malfa Portfolio  
**Milestone:** v1.1 TODO refresh  
**Researched:** 2026-04-12

## Recommendation

Keep the existing stack: **Next.js 16.2.3 + React 19.2.4 + Tailwind 4 + OGL 1.0.11**.  
For this milestone, **do not add major libraries**. The new scope is best handled with:

- **Tailwind 4 theme-token updates** for the blue refresh
- **native CSS/Tailwind motion utilities** for subtle motion
- **existing OGL graph** with layout/highlight changes instead of a new 3D lib
- **existing iubenda integration** for consent prompting at bootstrap
- **React lifted state + small client islands** for atomized composition

## Stack additions / changes needed

| Capability | Recommendation | Version | Why | Integration point |
|---|---|---:|---|---|
| Blue visual refresh | **No new library**; expand Tailwind theme tokens in `app/globals.css` | n/a | Current app already uses CSS variables (`--accent`, `--surface`, etc.); changing the design system at the token layer gives the refresh without stack growth | `app/globals.css`, section class cleanup in `app/page.tsx` and extracted atoms |
| Subtle motion | **No animation library**; use Tailwind `motion-safe:*`, `motion-reduce:*`, `transition-*`, `transform` | Tailwind 4.2 docs verified | The requested motion is polish, not choreography. CSS/Tailwind is enough and keeps recruiter scan speed high | CTA hover/focus, card emphasis, section micro-interactions, map-adjacent UI |
| Knowledge map replacing section 01 | **Keep OGL**; remove the center node in graph generation and rebalance positions | OGL 1.0.11 installed | The app already has a functioning graph. Reworking node generation is cheaper and safer than swapping engines | `app/components/skills-knowledge-map.tsx` |
| Map-driven experience sync | **No state library**; keep a single parent-owned selection state | React 19 docs pattern verified | This is classic lifted state, already partly present via `ExperienceMapController`; Zustand/Jotai would be unnecessary | Shared controller above map + experience atoms |
| Cookie consent at bootstrap | **Use existing iubenda setup**; extend current config instead of adding a new consent library | iubenda remote config docs current | The repo already ships policy embeds and an `app/head.tsx` iubenda bootstrap. Reuse it so consent appears on first load and remains legally aligned with the current provider | `app/head.tsx`, `app/layout.tsx`, existing policy snippets |
| Icon-based contact links | **No icon package**; use inline SVG for email/GitHub/LinkedIn | n/a | Only a few icons are needed. Avoid adding a dependency just for 3-4 marks | Replace `ContactLink`/contact cards with small icon buttons |
| Atomized composition | **Refactor into small presentational atoms + one interaction controller** | n/a | Matches milestone constraint: incremental React composition, not an OOP orchestration layer | Split current page and `ExperienceMapSection` into server shells + client subcomponents |

## Implementation pattern

### 1. Design system change: token-first, not component-library-first

Update `app/globals.css` to move from lime/green-led accents to blue-led accents:

- replace `--accent` / `--accent-foreground`
- add supporting tokens such as `--accent-soft`, `--accent-glow`, `--surface-tint`
- update body/background radial gradients so the whole page shifts tone consistently

This is the right layer because the current UI already consumes global variables through Tailwind theme mapping.

### 2. Motion: CSS first, OGL only where already justified

Use Tailwind utilities for:

- hover/focus elevation on buttons and icon links
- soft opacity/transform transitions on cards and section headers
- subtle reorder/highlight transitions in experience items
- `motion-safe` / `motion-reduce` variants everywhere motion is decorative

Use the existing OGL render loop only for map-specific polish.

**Do not add Framer Motion** for this milestone.

### 3. Knowledge map + experience: one source of truth

Keep the selection state in one parent controller and pass it down as controlled props.

Recommended shape:

- `KnowledgeExperienceSection` *(client controller)*
  - `SectionHeading` *(server/presentational)*
  - `KnowledgeMapPanel` *(client; wraps OGL map)*
  - `SelectionSummary` *(server/presentational or client if derived locally)*
  - `ExperienceTimeline` *(client/presentational)*
  - `ExperienceCard` *(presentational atom)*

Key change vs current structure:

- move the map into **section `01`**
- remove the duplicated standalone skills grid
- keep **all** experience entries visible in section `02`
- apply **highlight + optional reorder**, not filtering-only replacement

### 4. OGL graph changes needed

In `skills-knowledge-map.tsx`:

- remove or demote the current `core` sphere from the rendered graph
- keep a logical “all” selection in React state if needed, but it does **not** need a visible center node
- increase Z spread and reduce ring-like placement so nodes feel less flat
- preserve current pointer picking/highlight model

This is an implementation change, not a stack change.

### 5. Consent prompting: reuse iubenda, do not add Bootstrap

The repo already has:

- `app/head.tsx` loading `https://cdn.iubenda.com/cs/iubenda_cs.js`
- policy embed snippets in `app/components/cookie-policy.html` and `privacy-policy.html`
- footer rendering via `LegalEmbedFooter`

For v1.1, the needed stack move is:

- keep iubenda as the consent provider
- complete/configure `_iub.csConfiguration` so banner behavior is correct at bootstrap
- keep consent script loading at app start
- ensure any non-exempt future trackers stay blocked before consent

**Do not add:**

- Bootstrap CSS/JS
- `react-cookie-consent`
- a second CMP
- custom cookie state management with `localStorage` or cookie helper libraries

## What to refactor, not add

| Area | Change |
|---|---|
| `app/page.tsx` | Break into section atoms; keep page as server composition shell |
| `experience-map-section.tsx` | Stop owning both a full skills section and a filtered experience list; separate map, summary, and timeline concerns |
| `experience-map-controller.tsx` | Keep as the single interaction state owner, or rename to milestone-specific controller |
| `skills-knowledge-map.tsx` | Limit to graph rendering + selection callbacks; remove extra layout responsibilities over time |
| Contact UI | Replace card grid with compact icon link cluster and single primary email CTA |

## Explicit no-add list

- **No Framer Motion**
- **No Zustand / Redux / Jotai**
- **No Bootstrap UI framework**
- **No shadcn/ui or Radix adoption just for this refresh**
- **No icon package unless icon count expands materially later**
- **No new WebGL / 3D engine**
- **No OOP component manager layer**

## Confidence

**Overall:** HIGH for stack direction, MEDIUM for exact iubenda banner options because the repo already integrates iubenda but final legal configuration depends on the project’s real site/account settings.

## Sources

- Codebase: `/workspaces/94lama/package.json`
- Codebase: `/workspaces/94lama/app/globals.css`
- Codebase: `/workspaces/94lama/app/page.tsx`
- Codebase: `/workspaces/94lama/app/components/skills-knowledge-map.tsx`
- Codebase: `/workspaces/94lama/app/components/experience-map-controller.tsx`
- Codebase: `/workspaces/94lama/app/components/experience-map-section.tsx`
- Codebase: `/workspaces/94lama/app/head.tsx`
- Codebase: `/workspaces/94lama/app/components/legal-embed-footer.tsx`
- React docs: https://react.dev/learn/sharing-state-between-components
- Tailwind docs: https://tailwindcss.com/docs/transition-property
- Tailwind docs: https://tailwindcss.com/docs/hover-focus-and-other-states#prefers-reduced-motion
- iubenda docs: https://www.iubenda.com/en/help/1177-iubenda-cookie-solution-introduction-and-getting-started
- iubenda docs: https://www.iubenda.com/en/help/3081-prior-consent-cookie-solution
