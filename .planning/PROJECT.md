# Riccardo La Malfa Portfolio

## What This Is

A recruiter-focused portfolio webapp for Riccardo La Malfa. It presents his frontend-focused full-stack profile, experience, and contact paths in a bold one-page format designed to make a strong first impression quickly. The content stays reusable so future milestones can change structure and presentation without rewriting the underlying portfolio data.

## Core Value

A recruiter can understand Riccardo's positioning and know how to contact him within one minute.

## Current State

- Latest shipped milestone: `v1.1 implement atomization of components` on 2026-04-13.
- Current planned milestone: `v1.2 improve ux and ui`.
- The live app is a recruiter-focused one-page portfolio built on Next.js 16, React 19, Tailwind 4, and OGL.
- Shared portfolio content is currently loaded from `public/assets/cv.json` into the server-rendered page through typed portfolio models.
- The page includes a hero, knowledge-map-driven skill navigation, synced experience timeline, education, languages, relocation, contact actions, legal footer links, and layout-level consent and analytics wiring.
- The page now renders through extracted server sections plus shared atomic primitives, while `app/page.tsx` stays a thin server composition root.
- The knowledge-map hotspot is now decomposed across model, selection, runtime, UI-panel, and viewport boundaries.

## Current Milestone: v1.2 improve ux and ui

**Goal:** Improve recruiter-facing polish through smoother motion, stronger responsive behavior, better loading states, and better spacing rhythm, with freedom for larger layout restructuring if it improves UX.

**Target features:**
- Add consistent motion system across components, reveals, and section loading transitions.
- Refine micro-interactions plus smoother knowledge-map, panel, and timeline transitions.
- Rebalance padding and spacing rhythm across sections and improve responsive layout behavior.
- Add skeleton screens or equivalent loading-state polish where they improve perceived performance.

## Latest Milestone: v1.1 implement atomization of components

**Outcome:** Shipped a full internal atomization refactor that preserved recruiter-facing UI and behavior while improving maintainability and verification depth.

**Target features:**
- Recompose the full rendered portfolio surface from reusable atomic components instead of leaving large page-level sections inline.
- Push atomization into the knowledge-map area too, including splitting the OGL renderer internals into smaller modules.
- Keep the recruiter-facing layout, copy flow, contact paths, and map-to-experience behavior effectively unchanged.
- Keep `app/page.tsx` as a thin server composition root and preserve narrow client islands for interactive behavior.
- Ship architecture, regression, and parity documentation alongside the refactor.

## Requirements

### Validated

- ✓ Shared portfolio content loads from `public/assets/cv.json` through typed portfolio models - v1.0
- ✓ The landing page renders recruiter-facing content from the shared source instead of starter-template copy - v1.0
- ✓ Recruiters can understand Riccardo's positioning, summary, location, relocation status, and photo from a single page - v1.0
- ✓ Recruiters can scan core skills, experience, education, and languages without leaving the landing page - v1.0
- ✓ Recruiters can contact Riccardo through clear email, GitHub, and LinkedIn actions - v1.0
- ✓ The portfolio stays usable on mobile and desktop while preserving a recruiter-first narrative - v1.0

### Active

- [ ] Recruiters experience smoother and more intentional motion across sections, loading states, and interactive components.
- [ ] Recruiters can scan and interact with the portfolio comfortably across desktop and mobile through improved spacing and responsive layout behavior.
- [ ] Recruiters experience more polished micro-interactions and smoother map, panel, and timeline transitions without losing clarity or contact paths.
- [ ] This milestone may restructure layout or section composition where it clearly improves UX/UI quality for recruiter-facing flows.

### Out of Scope

- New product-surface expansion such as project showcase, dedicated CV view, or UI-variant switching - this milestone focuses on improving the current recruiter experience before adding new features.
- Rewriting the content workflow or replacing `public/assets/cv.json` - not required for UX/UI polish and would dilute focus.
- Framework churn or replacing OGL only for novelty - experience quality matters more than stack experimentation in this milestone.
- Decorative motion that hurts readability, accessibility, or perceived performance - polish should support recruiter comprehension, not distract from it.

## Context

- The app is a shipped content-driven portfolio rather than a starter template.
- `public/assets/cv.json` is the current maintained content source consumed at runtime.
- `src/content/portfolio/parse-cv.ts` still exists as a content-shaping utility, but the live page currently reads structured JSON through `getPortfolioContent()`.
- `app/page.tsx` now acts as a thin server composition root over extracted sections.
- `KnowledgeExperienceCoordinator` remains the main client island for shared skill-map and experience selection state.
- `SkillsKnowledgeMap` is now a thin orchestration entrypoint over `knowledge-map/model.ts`, `selection.ts`, `runtime.ts`, `knowledge-map-panels.tsx`, and `viewport.tsx`.
- `section-card-styles.ts` centralizes visual tokens for the numbered sections.
- `app/layout.tsx` owns the root shell, fonts, metadata, Iubenda bootstrap, GTM scripts, and `LegalFooter`.
- Tests now cover contact validation, composition/wiring regressions, knowledge-map split invariants, and Playwright parity for initial render plus map interaction.

## Constraints

- **Tech stack**: Stay within the existing Next.js 16, React 19, Tailwind 4, and OGL app.
- **Core value**: Preserve fast recruiter understanding and clear contact paths even if layout or section composition changes.
- **UX scope**: Motion, spacing, loading states, responsive behavior, and layout composition can change if they materially improve recruiter experience.
- **Rendering**: Preserve fast initial scan speed and SEO-safe content delivery while improving perceived performance and motion quality.
- **Performance/accessibility**: Animation and loading polish must stay responsive, accessible, and respectful of reduced-motion and mobile constraints.
- **Content source**: Keep `public/assets/cv.json` as the maintained runtime content source unless a stronger workflow is chosen deliberately.
- **Quality bar**: Improve desktop/mobile responsiveness, motion consistency, and spacing rhythm without making primary recruiter actions harder to find.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with a one-page recruiter portfolio | Keeps the first release focused on positioning and contact conversion | ✓ Good - shipped in v1.0 |
| Use structured portfolio content instead of starter-template copy | Shared content keeps the portfolio maintainable and reusable | ✓ Good - shipped in v1.0 |
| Keep `public/assets/cv.json` as the current runtime content source | The live app already reads structured portfolio data directly | ✓ Good - shipped in v1.0 |
| Preserve the interactive knowledge map as supporting recruiter context | It adds depth without breaking the one-page narrative | ✓ Good - shipped in v1.0 |
| Keep email primary while sourcing GitHub and LinkedIn from authored content | Contact paths should stay obvious without hardcoded profile URLs | ✓ Good - shipped in v1.0 |
| Replace the unshipped `v1.1 TODO refresh` plan with an architecture-first `v1.1` | The current priority is maintainability and safer future iteration, not new surface changes | ✓ Good - shipped in v1.1 |
| Use atomic component architecture across the full rendered app | The page is functional but still too monolithic for safe iteration | ✓ Good - shipped in v1.1 |
| Split the knowledge map into smaller modules instead of leaving one large interactive file | The current file mixes graph data, rendering, interaction, and UI responsibilities | ✓ Good - shipped in v1.1 |
| Treat OOP as a supporting tool, not a strict rewrite doctrine | The user wants cleaner structure without forcing class-heavy patterns where they add friction | ✓ Good - shipped in v1.1 |
| Add `.planning/ARCHITECTURE.md` as a baseline before refactoring | The milestone needs an explicit inventory of pages and components before the structure changes | ✓ Good - shipped in v1.1 |
| Run Playwright against a dedicated production port | Reusing an existing local server can produce false parity failures unrelated to shipped behavior | ✓ Good - shipped in v1.1 |
| Start v1.2 as a recruiter-facing UX/UI improvement milestone | The architecture refactor is shipped, so next leverage should go into smoother experience quality and responsive polish | - Pending |
| Allow broader layout restructuring during v1.2 | UX/UI improvements may require more than parity-safe tuning to materially improve desktop and mobile experience | - Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-21 after milestone v1.2 kickoff*
