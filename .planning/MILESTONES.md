# Project Milestones: Riccardo La Malfa Portfolio

## v1.1 implement atomization of components (Shipped: 2026-04-13)

**Delivered:** A full internal atomization refactor of the recruiter-facing portfolio that preserved the shipped UI and behavior while making the page more maintainable and verification-ready.

**Phases completed:** 4-7 (4 plans)

**Key accomplishments:**
- Slimmed `app/page.tsx` into a thin server composition root backed by a single portfolio content load.
- Extracted hero, education, languages, relocation, and contact sections into reusable server components plus shared atomic primitives.
- Split the knowledge-map feature into separate model, selection, OGL runtime, panel UI, and viewport bridge layers.
- Added architecture documentation, stronger regression coverage, Playwright parity tests, and a release QA checklist.
- Hardened Playwright to run against a dedicated production server port for deterministic parity checks.

**Stats:**
- 14 mapped milestone requirements validated.
- 4 milestone phases shipped.
- 1 architecture baseline doc, 1 QA checklist, 2 node regression suites, and 1 Playwright parity suite updated or added.

**What's next:** Define the next milestone around project showcase, CV access, or alternate UI variants on top of the new atomic structure.

---

## v1.0 MVP (Shipped: 2026-04-11)

**Delivered:** A recruiter-focused one-page portfolio powered by shared CV content, with a bold editorial layout, an integrated experience map, and clear email/GitHub/LinkedIn contact paths.

**Phases completed:** 1-3 (7 plans, 11 tasks)

**Key accomplishments:**
- Established a typed server-side content pipeline rooted in `public/assets/cv.md`.
- Replaced the starter page with a recruiter-first one-page portfolio.
- Preserved the interactive experience map as supporting content inside the redesigned flow.
- Tightened responsive behavior and completed lint, build, validation, and UAT sign-off across all milestone phases.
- Closed the hero clarity gap with a content-driven profile photo and deduplicated hero copy.
- Added GitHub and LinkedIn as authored secondary actions while keeping email as the primary CTA.

**Stats:**
- 16 key app/content files created or modified in shipped scope.
- ~2,208 lines across the shipped app/content implementation surface.
- 3 phases, 7 plans, 11 tasks.
- 2 days from milestone definition to ship.

**Git range:** `9c20411` -> `aecb186`

**What's next:** Define the next milestone around project showcase, CV access, or alternate UI variants while preserving the shared content pipeline.

---
