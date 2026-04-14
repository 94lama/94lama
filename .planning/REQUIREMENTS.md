# Requirements: Riccardo La Malfa Portfolio

**Defined:** 2026-04-13
**Core Value:** A recruiter can understand Riccardo's positioning and know how to contact him within one minute.

## Milestone v1.1 Requirements

### Composition

- [x] **COMP-01**: Recruiter can view the hero, education, languages, relocation, and contact sections from extracted section components without changes to section order, copy flow, or visible semantics.
- [x] **COMP-02**: Recruiter can experience consistent section shells, headings, metadata rows, contact actions, and legal/contact surface styling through shared atomic UI primitives without visible drift.
- [x] **COMP-03**: Maintainer can assemble the full portfolio page from extracted section components in a thin `app/page.tsx` composition root that loads portfolio content once.

### Rendering and Indexability

- [x] **REND-01**: Recruiter can access the main portfolio shell and primary contact path from the initial server-rendered page without waiting for non-essential interactive code.
- [x] **REND-02**: Search engine can index the recruiter-facing hero, experience, education, relocation, and contact content from the server-rendered document.
- [x] **REND-03**: Maintainer can keep static sections server-first and isolate interactive map behavior to a narrow client island with explicit server/client ownership guards where needed.

### Knowledge Map Architecture

- [x] **MAP-03**: Maintainer can edit knowledge-map graph constants, graph construction, and selection normalization in pure modules separate from React and OGL runtime code.
- [x] **MAP-04**: Maintainer can edit OGL scene setup, shaders, animation, picking, highlighting, and cleanup in dedicated runtime modules without changing recruiter-visible map behavior.
- [x] **MAP-05**: Maintainer can edit knowledge-map panels, legend, controls, and canvas shell in separate UI components without mixing them with renderer lifecycle code.
- [x] **MAP-06**: Recruiter can still use the current knowledge-map and experience interaction model, including overview reset, selection highlighting, and full-timeline visibility, after the refactor.

### Verification and Documentation

- [x] **QUAL-01**: Maintainer can review `.planning/ARCHITECTURE.md` for a current inventory of pages, components, boundaries, and data flow before and after the refactor.
- [x] **QUAL-02**: Maintainer can run automated regression checks for page composition, CTA visibility and wiring, and map-to-experience invariants during the refactor.
- [x] **QUAL-03**: Maintainer can run Playwright parity checks for key recruiter-visible flows, including initial page render and map-to-experience interaction.
- [x] **QUAL-04**: Maintainer can follow an explicit QA checklist covering map interaction parity, accessibility, responsive parity, and layout-level legal and analytics wiring before signoff.

## Future Requirements

### Product Extensions

- **PROJ-01**: Recruiter can browse selected project or case-study highlights from the portfolio.
- **CV-01**: Recruiter can open or download a dedicated CV view.
- **VAR-01**: Recruiter can switch between alternative portfolio UI variants without changing the shared content pipeline.

### Architecture Tooling

- **TOOL-01**: Maintainer can review extracted atoms and sections in a dedicated component workbench if iteration frequency later justifies the overhead.
- **RULE-01**: Maintainer can enforce stricter import-boundary or typing rules if server/client drift becomes a recurring maintenance problem.
- **DATA-01**: Maintainer can adopt a richer portfolio content workflow if `public/assets/cv.json` becomes too limiting for future milestones.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Visual redesign during the refactor | This milestone is judged on parity and structure, not on changing the recruiter-facing UI. |
| New recruiter-facing sections or SEO copy expansion | Architecture refactor and product expansion should not be mixed in the same milestone. |
| Strict class-heavy OOP rewrite across the entire app | OOP should be used only where it clearly improves ownership, especially around imperative runtime code. |
| Global clientification of the page tree | It would hurt fast rendering, bundle discipline, and technical SEO. |
| Replacing OGL or changing the map interaction model | The milestone should preserve behavior while refactoring internals. |
| Storybook rollout or generalized design-system packaging | Premature for a single-app parity refactor and not needed to ship v1.1 safely. |
| Migrating away from `public/assets/cv.json` | Unrelated to the current atomization and parity goals. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| COMP-01 | Phase 5 | Completed 2026-04-13 |
| COMP-02 | Phase 5 | Completed 2026-04-13 |
| COMP-03 | Phase 5 | Completed 2026-04-13 |
| REND-01 | Phase 5 | Completed 2026-04-13 |
| REND-02 | Phase 5 | Completed 2026-04-13 |
| REND-03 | Phase 5 | Completed 2026-04-13 |
| MAP-03 | Phase 6 | Completed 2026-04-13 |
| MAP-04 | Phase 6 | Completed 2026-04-13 |
| MAP-05 | Phase 6 | Completed 2026-04-13 |
| MAP-06 | Phase 6 | Completed 2026-04-13 |
| QUAL-01 | Phase 4 | Completed 2026-04-13 |
| QUAL-02 | Phase 4 | Completed 2026-04-13 |
| QUAL-03 | Phase 7 | Completed 2026-04-13 |
| QUAL-04 | Phase 7 | Completed 2026-04-13 |

**Coverage:**
- Milestone requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-13*
*Last updated: 2026-04-13 after milestone v1.1 shipment*
