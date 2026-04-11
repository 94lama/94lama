# Riccardo La Malfa Portfolio

## What This Is

A recruiter-focused portfolio webapp for Riccardo La Malfa. It presents his frontend-focused full-stack profile, experience, and core skills in a bold one-page format designed to make a strong first impression quickly. The content stays reusable so future milestones can refine presentation and interaction without rewriting the underlying information.

## Core Value

A recruiter can understand Riccardo's positioning and know how to contact him within one minute.

## Current State

- Latest shipped milestone: `v1.0 MVP` on 2026-04-11.
- Current planned milestone: `v1.1 portfolio TODO refresh`.
- The shipped app is a bold recruiter-focused one-page portfolio built on Next.js 16, React 19, Tailwind 4, and OGL.
- Shared content flows from `public/assets/cv.md` through a typed parser/loader into the server-rendered page.
- The page includes a content-driven hero photo, grouped skills, experience, education, languages, relocation details, the interactive experience map, and clear email/GitHub/LinkedIn contact actions.
- v1.1 focuses on tightening portfolio presentation and section interaction without changing the single-page recruiter-first structure.

## Current Milestone: v1.1 portfolio TODO refresh

**Goal:** Refine the shipped recruiter-first portfolio with stronger visual polish, tighter knowledge-map-to-experience behavior, and cleaner supporting sections.

**Target features:**
- Shift the primary visual language from green to blue and add subtle motion polish.
- Replace the standalone skills block with an upgraded knowledge map in section `01`, remove the center sphere, and spread nodes more three-dimensionally.
- Lift `skills` and `selectedPoint` into the parent component so the knowledge map and `02 - Experience` share selection state.
- Keep all experience visible but highlight and reorder related items when a map point or category is selected.
- Expand the relocation section with timing and preference details.
- Replace contact cards with icon-based links and remove duplicated relocation info from contact.

## Requirements

### Validated

- ✓ Shared portfolio content loads from `public/assets/cv.md` through a typed server-side parser/loader — v1.0
- ✓ The landing page renders recruiter-facing content from the shared source instead of starter-template copy — v1.0
- ✓ Recruiters can understand Riccardo's positioning, summary, location, relocation status, and photo from a single page — v1.0
- ✓ Recruiters can scan core skills, experience, education, and languages without leaving the landing page — v1.0
- ✓ Recruiters can contact Riccardo through clear email, GitHub, and LinkedIn actions — v1.0
- ✓ The portfolio stays usable on mobile and desktop while preserving a recruiter-first narrative — v1.0

### Active

- [ ] Recruiters see blue-led visual polish and subtle motion without losing scan speed or readability.
- [ ] Recruiters can use section `01` knowledge map instead of a separate skills block to understand skills spatially.
- [ ] Knowledge map selection and experience content stay in sync through shared parent-managed state.
- [ ] Recruiters can scan all experience entries while related items highlight and reorder on selection.
- [ ] Recruiters get clearer relocation timing and preference details in the dedicated section.
- [ ] Recruiters can use compact icon-based contact links without duplicated relocation content in contact.

### Out of Scope

- Featured project showcase in this milestone - deferred so v1.1 stays focused on presentation refinements.
- Direct CV view/download in this milestone - deferred until the updated recruiter-first page flow settles.
- Alternative portfolio UI variants in this milestone - deferred until the v1.1 structure and interactions are validated.
- Multi-page information architecture until the single-page recruiter flow no longer serves the core value.
- Client-style case-study depth until the recruiter-first narrative is expanded deliberately.

## Context

- The app is now a shipped content-driven portfolio rather than a Next.js starter template.
- `public/assets/cv.md` remains the single maintained source of truth for portfolio content.
- `README.md` is outdated and also serves as the GitHub profile README, so portfolio copy should not be coupled to it.
- The validated audience is recruiters and hiring managers rather than clients.
- Future milestones should preserve quick comprehension and contact clarity while expanding content breadth carefully.
- `TODO.md` now defines the immediate v1.1 UI and interaction refresh scope.
- The knowledge map should move up in the page and work as a companion control for the main experience section rather than living beside a duplicate experience block.

## Constraints

- **Tech stack**: Stay within the existing Next.js 16, React 19, Tailwind 4, and OGL app.
- **Scope discipline**: Keep future milestones tight and shippable.
- **Brand**: Maintain an intentional, non-starter visual language.
- **Content source**: Keep `public/assets/cv.md` as the maintained portfolio source unless a better workflow is clearly justified.
- **Contact data flow**: Keep email, GitHub, and LinkedIn sourced from authored content instead of hardcoded page constants.
- **Interaction model**: Keep `skills` and `selectedPoint` in a shared parent so the map and experience section cannot drift.
- **Experience visibility**: Highlighting and reordering are allowed, but all experience items should remain visible during map interaction.
- **Motion**: Use subtle polish instead of heavy page-wide animation that slows recruiter scan speed.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with a one-page recruiter portfolio | Keeps the first release focused on positioning and contact conversion | ✓ Good — shipped in v1.0 |
| Use `public/assets/cv.md` as the portfolio content source | The README is outdated and serves a different purpose | ✓ Good — shipped in v1.0 |
| Preserve the interactive experience map as supporting content | It adds depth without breaking the recruiter-first narrative | ✓ Good — shipped in v1.0 |
| Keep email primary while sourcing GitHub and LinkedIn from authored content | Contact paths should stay obvious without hardcoded URLs | ✓ Good — shipped in v1.0 |
| Defer project showcase and direct CV download | They added scope without improving the core recruiter flow enough for v1.0 | ⚠ Revisit next milestone |
| Prepare content for future UI variants without building a switcher now | The user wants multiple UIs eventually, but not at the cost of first-release focus | ✓ Good — foundation shipped, variants still deferred |
| Make the knowledge map replace the standalone skills block in section `01` | The user wants skill navigation to feel central rather than isolated in a separate block | — Pending |
| Drive `02 - Experience` from shared parent-managed map selection state | Sync keeps interaction consistent across both sections and supports highlight plus reorder behavior | — Pending |
| Shift accents from green to blue and keep motion subtle | Refresh visual tone without sacrificing readability or recruiter scan speed | — Pending |

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
*Last updated: 2026-04-11 after milestone v1.1 definition*
