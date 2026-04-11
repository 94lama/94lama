# Riccardo La Malfa Portfolio

## What This Is

A recruiter-focused portfolio webapp for Riccardo La Malfa. It presents his frontend-focused full-stack profile, experience, and core skills in a bold one-page format designed to make a strong first impression quickly. The content stays reusable so future milestones can add alternative portfolio UIs without rewriting the underlying information.

## Core Value

A recruiter can understand Riccardo's positioning and know how to contact him within one minute.

## Current State

- Latest shipped milestone: `v1.0 MVP` on 2026-04-11.
- The shipped app is a bold recruiter-focused one-page portfolio built on Next.js 16, React 19, Tailwind 4, and OGL.
- Shared content flows from `public/assets/cv.md` through a typed parser/loader into the server-rendered page.
- The page includes a content-driven hero photo, grouped skills, experience, education, languages, relocation details, the interactive experience map, and clear email/GitHub/LinkedIn contact actions.

## Requirements

### Validated

- ✓ Shared portfolio content loads from `public/assets/cv.md` through a typed server-side parser/loader — v1.0
- ✓ The landing page renders recruiter-facing content from the shared source instead of starter-template copy — v1.0
- ✓ Recruiters can understand Riccardo's positioning, summary, location, relocation status, and photo from a single page — v1.0
- ✓ Recruiters can scan core skills, experience, education, and languages without leaving the landing page — v1.0
- ✓ Recruiters can contact Riccardo through clear email, GitHub, and LinkedIn actions — v1.0
- ✓ The portfolio stays usable on mobile and desktop while preserving a recruiter-first narrative — v1.0

### Active

- [ ] Add a featured project showcase sourced from the shared content model.
- [ ] Add direct CV view/download support without weakening the recruiter-first landing flow.
- [ ] Explore alternative portfolio UI variants on the same content pipeline.

### Out of Scope

- Multi-page information architecture until the single-page recruiter flow no longer serves the core value.
- Client-style case-study depth until the recruiter-first narrative is expanded deliberately.

## Context

- The app is now a shipped content-driven portfolio rather than a Next.js starter template.
- `public/assets/cv.md` remains the single maintained source of truth for portfolio content.
- `README.md` is outdated and also serves as the GitHub profile README, so portfolio copy should not be coupled to it.
- The validated audience is recruiters and hiring managers rather than clients.
- Future milestones should preserve quick comprehension and contact clarity while expanding content breadth carefully.

## Constraints

- **Tech stack**: Stay within the existing Next.js 16, React 19, Tailwind 4, and OGL app.
- **Scope discipline**: Keep future milestones tight and shippable.
- **Brand**: Maintain an intentional, non-starter visual language.
- **Content source**: Keep `public/assets/cv.md` as the maintained portfolio source unless a better workflow is clearly justified.
- **Contact data flow**: Keep email, GitHub, and LinkedIn sourced from authored content instead of hardcoded page constants.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with a one-page recruiter portfolio | Keeps the first release focused on positioning and contact conversion | ✓ Good — shipped in v1.0 |
| Use `public/assets/cv.md` as the portfolio content source | The README is outdated and serves a different purpose | ✓ Good — shipped in v1.0 |
| Preserve the interactive experience map as supporting content | It adds depth without breaking the recruiter-first narrative | ✓ Good — shipped in v1.0 |
| Keep email primary while sourcing GitHub and LinkedIn from authored content | Contact paths should stay obvious without hardcoded URLs | ✓ Good — shipped in v1.0 |
| Defer project showcase and direct CV download | They added scope without improving the core recruiter flow enough for v1.0 | ⚠ Revisit next milestone |
| Prepare content for future UI variants without building a switcher now | The user wants multiple UIs eventually, but not at the cost of first-release focus | ✓ Good — foundation shipped, variants still deferred |

## Next Milestone Goals

- Choose whether the next milestone should prioritize project breadth, CV access, or alternate presentation.
- Keep `public/assets/cv.md` as the single maintained source of truth unless a stronger content workflow becomes necessary.
- Preserve recruiter-first scan speed and CTA clarity while adding any new content.

## Evolution

This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-04-11 after v1.0 milestone completion*
