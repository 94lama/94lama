# Architecture

**Analysis Date:** 2026-04-13
**Purpose:** Baseline summary of the current pages, components, and data flow before milestone `v1.1 implement atomization of components`.

## Pattern Overview

**Overall:** Single-page Next.js App Router portfolio with server-rendered composition and one interactive client island.

**Key Characteristics:**
- One routed page (`app/page.tsx`) renders the entire recruiter-facing experience.
- The root layout (`app/layout.tsx`) owns fonts, metadata, legal wiring, and third-party scripts.
- Portfolio content is loaded from `public/assets/cv.json` through typed models in `src/content/portfolio/`.
- `KnowledgeExperienceCoordinator` is the main client boundary for shared map and experience state.
- `SkillsKnowledgeMap` is the largest monolithic component and the main atomization hotspot.

## Pages and Layouts

| Surface | Location | Type | Responsibility | Current atomization status |
|---------|----------|------|----------------|---------------------------|
| Root layout | `app/layout.tsx` | Server component | Defines metadata, fonts, body shell, Iubenda widget bootstrap, legal footer placement, and GTM scripts | Already extracted at the file level, but still mixes multiple global concerns |
| Home page | `app/page.tsx` | Server component | Loads portfolio content and renders hero, coordinator, education, languages, relocation, and contact sections | Large composition root with several inline helpers and section implementations |

## Extracted Components

| Component | Location | Type | Responsibility | Notes |
|-----------|----------|------|----------------|-------|
| `LegalFooter` | `app/components/legal-footer.tsx` | Server component | Renders privacy and cookie policy links | Small isolated footer surface |
| `KnowledgeExperienceCoordinator` | `app/components/knowledge-experience-coordinator.tsx` | Client component | Owns shared selection state and coordinates section `01` and `02` | Good client-island boundary, but still contains duplicated heading UI |
| `SkillsKnowledgeMap` | `app/components/skills-knowledge-map.tsx` | Client component | Builds graph data, mounts OGL scene, handles pointer interaction, and renders map detail UI | Main refactor hotspot; currently combines several responsibilities |
| `ExperienceTimelineSection` | `app/components/experience-timeline-section.tsx` | Presentational component | Renders helper copy and the ordered list of experience cards | Thin wrapper around ranked data |
| `ExperienceCard` | `app/components/experience-card.tsx` | Presentational component | Renders a single experience entry with highlight state | Reusable card-level piece already extracted |
| Section style tokens | `app/components/section-card-styles.ts` | Module | Centralizes shared class recipes for section shells, cards, chips, and text tones | Useful foundation for future atoms |

## Page-Local Helpers Still Embedded in `app/page.tsx`

- `EmailIcon`
- `ContactLink`
- `ContactIconLink`
- `SectionHeading`

These are reusable UI pieces today, but they still live inside the page file instead of a shared atomic component layer.

## Supporting Modules

| Module | Location | Responsibility |
|--------|----------|----------------|
| Portfolio types | `src/content/portfolio/types.ts` | Defines shared content contracts for hero, skills, experience, relocation, contact, and projects |
| Content loader | `src/content/portfolio/get-portfolio-content.ts` | Reads `public/assets/cv.json` and returns typed portfolio data |
| Experience ranking | `src/content/portfolio/rank-experience-by-selection.ts` | Derives highlighted and reordered experience entries from map selection |
| Markdown parser | `src/content/portfolio/parse-cv.ts` | Parses markdown-style CV content into `PortfolioContent`; present in repo but not on the live runtime path |
| Contact tests | `tests/phase-03-contact-validation.test.ts` | Verifies contact-related portfolio content behavior |
| Map and ranking tests | `tests/phase-04-knowledge-experience.test.ts` | Verifies ranking logic and some page wiring around the map and experience coordinator |

## Data Flow

1. `app/layout.tsx` defines the global HTML shell, body classes, fonts, scripts, and footer.
2. `app/page.tsx` calls `getPortfolioContent()`, which reads `public/assets/cv.json` and returns `PortfolioContent`.
3. The page renders static recruiter-facing sections directly from the loaded content.
4. The page passes `skillGroups` and `experience` into `KnowledgeExperienceCoordinator`.
5. `KnowledgeExperienceCoordinator` stores the current selection state and derives ranked experience data via `rankExperienceBySelection()`.
6. `SkillsKnowledgeMap` emits selection changes and renders the interactive graph plus detail UI.
7. `ExperienceTimelineSection` renders the reordered experience list and delegates each row to `ExperienceCard`.

## Knowledge Map Internal Responsibilities

The current `app/components/skills-knowledge-map.tsx` file still combines all of the following in one place:

- graph constants and relationship data (`CATEGORY_COLORS`, `CROSS_DOMAIN_MEMBERSHIPS`, `RELATED_SKILL_LINKS`)
- graph construction (`createGraph()` and related helpers)
- shader definitions for nodes and edges
- OGL scene creation and disposal
- animation loop and resize handling
- pointer interaction and hit testing
- selection normalization and derived sidebar metadata
- presentational UI around the canvas

This makes it the clearest candidate for deeper atomization during the milestone.

## Current Structural Pressure Points

- `app/page.tsx` still contains large amounts of section markup and reusable UI helpers.
- `SectionHeading` exists in both `app/page.tsx` and `app/components/knowledge-experience-coordinator.tsx`.
- Shared style tokens exist, but many actual atoms and molecules have not been extracted yet.
- The knowledge map mixes data modeling, renderer lifecycle, interaction control, and UI rendering in one file.
- Tests cover ranking behavior and a small amount of structural wiring, but not the full page composition boundaries the refactor will introduce.

## Refactor Guardrails

- Keep the current UI, copy flow, and recruiter-facing behavior effectively unchanged.
- Preserve the single-page structure and server-first page composition.
- Keep interactive state in narrow client boundaries instead of pushing it into the whole tree.
- Preserve current knowledge-map selection, highlighting, and full-timeline experience visibility.
- Use OOP only where it clearly improves maintainability inside the atomic architecture.

---
*Architecture baseline captured: 2026-04-13 before milestone v1.1 implementation planning*
