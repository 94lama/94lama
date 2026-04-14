# Architecture

**Analysis Date:** 2026-04-13
**Purpose:** Baseline and shipped summary of the pages, components, and data flow for milestone `v1.1 implement atomization of components`.

## Pattern Overview

**Overall:** Single-page Next.js App Router portfolio with server-rendered composition and one interactive client island.

**Key Characteristics before refactor:**
- One routed page (`app/page.tsx`) renders the entire recruiter-facing experience.
- The root layout (`app/layout.tsx`) owns fonts, metadata, legal wiring, and third-party scripts.
- Portfolio content is loaded from `public/assets/cv.json` through typed models in `src/content/portfolio/`.
- `KnowledgeExperienceCoordinator` is the main client boundary for shared map and experience state.
- `SkillsKnowledgeMap` is the largest monolithic component and the main atomization hotspot.

**Key Characteristics after refactor:**
- `app/page.tsx` is now a thin server composition root that loads portfolio content once and delegates each static section to an extracted server component.
- Shared server atoms now cover section headings, shell wrappers, contact actions, and icon primitives used across hero and contact surfaces.
- The knowledge-map feature is explicitly split across pure model code, pure selection logic, an isolated OGL runtime, and separate UI panel/viewport components.
- The client boundary remains narrow: `KnowledgeExperienceCoordinator` owns shared interactive state and passes server-loaded content into the map/timeline pair.

## Pages and Layouts

| Surface | Location | Type | Responsibility | Current atomization status |
|---------|----------|------|----------------|---------------------------|
| Root layout | `app/layout.tsx` | Server component | Defines metadata, fonts, body shell, Iubenda widget bootstrap, legal footer placement, and GTM scripts | Already extracted at the file level, but still mixes multiple global concerns |
| Home page | `app/page.tsx` | Server component | Loads portfolio content once and composes the full page from extracted section components | Thin composition root with no embedded section helpers |

## Extracted Components

| Component | Location | Type | Responsibility | Notes |
|-----------|----------|------|----------------|-------|
| `LegalFooter` | `app/components/legal-footer.tsx` | Server component | Renders privacy and cookie policy links | Small isolated footer surface |
| `HeroSection` | `app/components/hero-section.tsx` | Server component | Renders the recruiter-facing hero, summary, contact CTA cluster, and profile rail | Extracted from `app/page.tsx` in v1.1 |
| `EducationSection` | `app/components/education-section.tsx` | Server component | Renders the education list in a shared section shell | Extracted from `app/page.tsx` in v1.1 |
| `LanguagesSection` | `app/components/languages-section.tsx` | Server component | Renders language cards in a shared section shell | Extracted from `app/page.tsx` in v1.1 |
| `RelocationSection` | `app/components/relocation-section.tsx` | Server component | Renders relocation summary, support cards, regions, and priorities | Extracted from `app/page.tsx` in v1.1 |
| `ContactSection` | `app/components/contact-section.tsx` | Server component | Renders primary contact CTA and contact metadata rows | Extracted from `app/page.tsx` in v1.1 |
| `SectionHeading` | `app/components/section-heading.tsx` | Server component | Shared numbered section header used by static sections and coordinator sections | Replaces duplicated heading implementations |
| `SectionShell` | `app/components/section-shell.tsx` | Server component | Shared section panel wrapper plus inner card style tokens | Shared atomic shell for static sections |
| `ContactAction` / `ContactIconAction` | `app/components/contact-actions.tsx` | Server component | Shared external contact link primitives for text and icon actions | Keeps CTA wiring/style consistent across hero and contact sections |
| `portfolio-icons` | `app/components/portfolio-icons.tsx` | Module | Shared SVG icon primitives for email/GitHub/LinkedIn | Removes page-local icon helpers |
| `KnowledgeExperienceCoordinator` | `app/components/knowledge-experience-coordinator.tsx` | Client component | Owns shared selection state and coordinates section `01` and `02` | Good client-island boundary, but still contains duplicated heading UI |
| `SkillsKnowledgeMap` | `app/components/skills-knowledge-map.tsx` | Client component | Orchestrates the knowledge-map feature from separated model/runtime/UI modules | Thin feature entrypoint after v1.1 split |
| Knowledge-map model | `app/components/knowledge-map/model.ts` | Module | Owns graph constants, node/edge types, and graph construction | Pure data/model layer |
| Knowledge-map selection | `app/components/knowledge-map/selection.ts` | Module | Owns root selection creation, normalization, and sidebar metadata derivation | Pure behavior/model layer |
| Knowledge-map runtime | `app/components/knowledge-map/runtime.ts` | Module | Owns shaders, OGL scene creation, animation, hit testing, and highlight sync | Pure imperative renderer layer |
| Knowledge-map panels | `app/components/knowledge-map/knowledge-map-panels.tsx` | Client component | Renders map controls, selection summary, legend, and shell UI | Presentational map UI layer |
| Knowledge-map viewport | `app/components/knowledge-map/viewport.tsx` | Client component | Mounts and disposes the OGL canvas runtime inside the map shell | Narrow canvas bridge |
| `ExperienceTimelineSection` | `app/components/experience-timeline-section.tsx` | Presentational component | Renders helper copy and the ordered list of experience cards | Thin wrapper around ranked data |
| `ExperienceCard` | `app/components/experience-card.tsx` | Presentational component | Renders a single experience entry with highlight state | Reusable card-level piece already extracted |
| Section style tokens | `app/components/section-card-styles.ts` | Module | Centralizes shared class recipes for section shells, cards, chips, and text tones | Useful foundation for future atoms |

## Static Surface Atomization Outcome

- The hero, education, languages, relocation, and contact sections now render through extracted server components.
- Shared numbered headings, section shells, contact action primitives, and icon primitives are reused instead of staying embedded in `app/page.tsx`.
- Search-engine-visible recruiter content still comes from the initial server-rendered route tree because the page remains a Server Component and only the knowledge-map coordinator is client-owned.

## Supporting Modules

| Module | Location | Responsibility |
|--------|----------|----------------|
| Portfolio types | `src/content/portfolio/types.ts` | Defines shared content contracts for hero, skills, experience, relocation, contact, and projects |
| Content loader | `src/content/portfolio/get-portfolio-content.ts` | Reads `public/assets/cv.json` and returns typed portfolio data |
| Experience ranking | `src/content/portfolio/rank-experience-by-selection.ts` | Derives highlighted and reordered experience entries from map selection |
| Markdown parser | `src/content/portfolio/parse-cv.ts` | Parses markdown-style CV content into `PortfolioContent`; present in repo but not on the live runtime path |
| Contact tests | `tests/phase-03-contact-validation.test.ts` | Verifies contact-related portfolio content behavior |
| Map and ranking tests | `tests/phase-04-knowledge-experience.test.ts` | Verifies ranking logic, thin page composition, and the knowledge-map split boundaries |
| Playwright parity tests | `tests/e2e/portfolio-parity.spec.ts` | Verifies recruiter-visible parity for initial render and map-to-experience interaction |

## Data Flow

1. `app/layout.tsx` defines the global HTML shell, body classes, fonts, scripts, and footer.
2. `app/page.tsx` calls `getPortfolioContent()`, which reads `public/assets/cv.json` and returns `PortfolioContent`.
3. The page renders static recruiter-facing sections through extracted server components.
4. The page passes `skillGroups` and `experience` into `KnowledgeExperienceCoordinator`.
5. `KnowledgeExperienceCoordinator` stores the current selection state, normalizes root selection, and derives ranked experience data via `rankExperienceBySelection()`.
6. `SkillsKnowledgeMap` builds graph data through `knowledge-map/model.ts`, resolves selection metadata through `knowledge-map/selection.ts`, mounts the OGL runtime through `knowledge-map/viewport.tsx`, and renders panel UI through `knowledge-map/knowledge-map-panels.tsx`.
7. `ExperienceTimelineSection` renders the reordered experience list and delegates each row to `ExperienceCard`.

## Knowledge Map Boundary Split

The shipped v1.1 knowledge-map feature now separates responsibilities explicitly:

- `knowledge-map/model.ts`: graph constants, node/edge contracts, graph construction
- `knowledge-map/selection.ts`: root selection, normalization, neighbor/group metadata derivation
- `knowledge-map/runtime.ts`: shaders, OGL scene creation, animation, picking, highlight sync, cleanup
- `knowledge-map/knowledge-map-panels.tsx`: current-selection UI, related-point controls, field buttons, legend shell
- `knowledge-map/viewport.tsx`: canvas mount/unmount bridge between React and the OGL runtime
- `skills-knowledge-map.tsx`: small feature composition entrypoint that wires the layers together

## Current Structural Pressure Points

- Remaining risk is mostly around recruiter-visible visual parity rather than ownership boundaries.
- The page still relies on one large content payload from `public/assets/cv.json`, which is acceptable for the current single-page scope.
- OGL runtime logic remains imperative by necessity, but it is now isolated from selection rules and UI rendering.
- Playwright coverage focuses on recruiter-critical parity paths rather than exhaustive visual snapshots.

## Refactor Guardrails

- Keep the current UI, copy flow, and recruiter-facing behavior effectively unchanged.
- Preserve the single-page structure and server-first page composition.
- Keep interactive state in narrow client boundaries instead of pushing it into the whole tree.
- Preserve current knowledge-map selection, highlighting, and full-timeline experience visibility.
- Use OOP only where it clearly improves maintainability inside the atomic architecture.

---
*Architecture updated: 2026-04-13 after milestone v1.1 atomization implementation*
