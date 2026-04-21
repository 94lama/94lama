# Roadmap: Riccardo La Malfa Portfolio

## Overview

The roadmap preserves the shipped recruiter-first portfolio milestones and extends them with v1.2, a polish-focused milestone that improves scan speed, motion clarity, responsive behavior, and loading continuity without sacrificing performance discipline, proof-first reading order, or contact discoverability.

## Milestones

- ✅ **v1.0 MVP** — Phases 1-3 shipped 2026-04-11
- ✅ **v1.1 implement atomization of components** — Phases 4-7 shipped 2026-04-13
- 🚧 **v1.2 improve ux and ui** — Phases 8-11 planned

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) - SHIPPED 2026-04-11</summary>

Archived milestone. See `.planning/MILESTONES.md` for shipped milestone summary.

</details>

<details>
<summary>✅ v1.1 implement atomization of components (Phases 4-7) - SHIPPED 2026-04-13</summary>

- [x] **Phase 4: Architecture Baseline & Refactor Guardrails** - Captured the current architecture and locked regression guardrails before structural extraction.
- [x] **Phase 5: Server-First Static Surface Atomization** - Extracted reusable atoms and static sections while keeping `app/page.tsx` thin, server-rendered, and indexable.
- [x] **Phase 6: Knowledge Map Feature Decomposition** - Split the knowledge-map hotspot into model, OGL runtime, and UI layers without changing recruiter-visible behavior.
- [x] **Phase 7: Parity Hardening & Release Signoff** - Proved recruiter-visible parity with Playwright and QA before shipping the milestone.

</details>

### 🚧 v1.2 improve ux and ui (Current milestone)

**Milestone Goal:** Make the one-page recruiter portfolio feel more polished and easier to scan through shared motion rules, coordinated map/panel/timeline transitions, selective real loading polish, stronger spacing rhythm, and responsive hierarchy improvements without turning the page into spectacle.

- [ ] **Phase 8: Motion Language & Reveal Rhythm** - Establish a consistent recruiter-first motion system for section reveals and interaction feedback.
- [ ] **Phase 9: Interactive Continuity & Real Loading States** - Preserve context through coordinated map/panel/timeline transitions and only-real loading polish.
- [ ] **Phase 10: Responsive Hierarchy Rewrite** - Rework spacing, composition, and responsive reflow so proof and CTAs scan faster across screen sizes.
- [ ] **Phase 11: Recruiter-First Finish & Quality Guardrails** - Validate that the polish still preserves one-minute understanding, trust, and performance discipline.

## Phase Details

### Phase 4: Architecture Baseline & Refactor Guardrails
**Goal**: Maintainer has a trusted architectural baseline and regression safety net before the refactor starts moving the rendered app apart.
**Depends on**: Phase 3
**Requirements**: QUAL-01, QUAL-02
**Success Criteria** (what must be TRUE):
  1. Maintainer can review `.planning/ARCHITECTURE.md` for a current inventory of pages, components, data flow, and server/client boundaries before and after the refactor.
  2. Maintainer can run automated regression checks that catch page composition drift, CTA visibility/wiring regressions, and map-to-experience invariant breaks during later phases.
  3. Maintainer can use the documented baseline and regression suite as the acceptance guardrail for every later extraction step.
**Plans**: `04-01-PLAN.md`

### Phase 5: Server-First Static Surface Atomization
**Goal**: Recruiters get the same static portfolio experience from reusable atomic components while the page stays server-first, fast to scan, and SEO-safe.
**Depends on**: Phase 4
**Requirements**: COMP-01, COMP-02, COMP-03, REND-01, REND-02, REND-03
**Success Criteria** (what must be TRUE):
  1. Recruiter can access the main portfolio shell and primary contact path from the initial server-rendered page without waiting for non-essential interactive code.
  2. Search engine and maintainer inspection can see hero, experience, education, relocation, and contact content in the server-rendered document.
  3. Recruiter can view the hero, education, languages, relocation, and contact sections from extracted section components without changes to section order, copy flow, or visible semantics.
  4. Recruiter sees consistent section shells, headings, metadata rows, contact actions, and legal/contact surfaces through shared atomic UI primitives without visible drift.
  5. Maintainer can assemble the page from a thin server-first `app/page.tsx` that loads portfolio content once and keeps interactive state isolated to a narrow client island with explicit ownership guards.
**Plans**: `05-01-PLAN.md`
**UI hint**: yes

### Phase 6: Knowledge Map Feature Decomposition
**Goal**: Maintainer can evolve the knowledge-map hotspot through clean model, runtime, and UI boundaries while recruiters experience the same map-driven journey.
**Depends on**: Phase 5
**Requirements**: MAP-03, MAP-04, MAP-05, MAP-06
**Success Criteria** (what must be TRUE):
  1. Maintainer can edit graph constants, graph construction, and selection normalization in pure knowledge-map modules without touching React or OGL runtime code.
  2. Maintainer can edit OGL scene setup, shaders, animation, picking, highlighting, and cleanup in dedicated runtime modules without mixing them into presentational UI files.
  3. Maintainer can edit knowledge-map panels, legend, controls, and canvas shell in separate UI components without mixing them with renderer lifecycle code.
  4. Recruiter can still use overview reset, selection highlighting, and full-timeline experience visibility with the same recruiter-facing interaction model as before the refactor.
**Plans**: `06-01-PLAN.md`
**UI hint**: yes

### Phase 7: Parity Hardening & Release Signoff
**Goal**: Maintainer can prove the refactor preserved recruiter-facing behavior, accessibility, responsive parity, and layout integrations well enough to release.
**Depends on**: Phase 6
**Requirements**: QUAL-03, QUAL-04
**Success Criteria** (what must be TRUE):
  1. Maintainer can run Playwright parity checks for initial page render, primary recruiter contact visibility, and map-to-experience interaction.
  2. Maintainer can follow an explicit QA checklist covering map interaction parity, accessibility smoke checks, responsive parity, and layout-level legal and analytics wiring.
  3. Recruiter-facing UI and interaction behavior remain effectively unchanged across final parity verification on desktop and mobile checkpoints.
**Plans**: `07-01-PLAN.md`
**UI hint**: yes

### Phase 8: Motion Language & Reveal Rhythm
**Goal**: Recruiters experience one restrained, consistent motion language that improves orientation and interaction clarity without slowing their scan.
**Depends on**: Phase 7
**Requirements**: MOTN-01, MOTN-02, MOTN-03
**Success Criteria** (what must be TRUE):
  1. Recruiter experiences a consistent motion rhythm across section reveals, interaction feedback, and state changes instead of mismatched speeds or styles.
  2. Recruiter can enter and scan each major section through polished reveals that orient the eye without hiding already-available reading for too long.
  3. Recruiter gets immediate, noticeable feedback on primary CTAs, links, cards, and interactive controls.
**Plans**: TBD
**UI hint**: yes

### Phase 9: Interactive Continuity & Real Loading States
**Goal**: Recruiters keep context during real waits and interactive state changes, especially through the knowledge-map, panel, and timeline choreography.
**Depends on**: Phase 8
**Requirements**: MOTN-04, LOAD-01, LOAD-02, LOAD-03
**Success Criteria** (what must be TRUE):
  1. Recruiter sees skeletons or reserved placeholders only where delayed surfaces genuinely need time, especially around interactive map-related loading boundaries.
  2. Recruiter can move between knowledge-map hotspots, detail panels, and timeline emphasis through smooth coordinated transitions that preserve which item is active.
  3. Recruiter keeps orientation during pending updates because surrounding structure stays stable instead of swapping abruptly.
  4. Recruiter sees a route-level loading shell that preserves page structure and perceived continuity during real page-start or navigation waits.
**Plans**: TBD
**UI hint**: yes

### Phase 10: Responsive Hierarchy Rewrite
**Goal**: Recruiters can scan a materially reworked one-page layout faster across mobile, tablet, and desktop through better spacing rhythm, reflow, and proof-first composition.
**Depends on**: Phase 9
**Requirements**: LAY-01, LAY-02, LAY-03
**Success Criteria** (what must be TRUE):
  1. Recruiter can identify positioning, proof, and primary contact actions more quickly because spacing, padding, and section chunking feel clearer and less crowded.
  2. Recruiter can read and interact comfortably across mobile, tablet, and desktop through stronger responsive reflow and clearer CTA visibility.
  3. Recruiter experiences a reworked page composition that makes section relationships and proof hierarchy easier to follow than the previous layout.
**Plans**: TBD
**UI hint**: yes

### Phase 11: Recruiter-First Finish & Quality Guardrails
**Goal**: The polished portfolio still optimizes for one-minute recruiter understanding, trust, and performance discipline after the UX/UI rewrite.
**Depends on**: Phase 10
**Requirements**: QUAL-05, QUAL-06
**Success Criteria** (what must be TRUE):
  1. Recruiter can still understand Riccardo's positioning and find primary contact actions within one minute after the milestone changes.
  2. Recruiter experiences the added polish without fake waiting, distracting instability, or motion that makes the page harder to scan.
  3. Recruiter can use the updated page on common desktop and mobile views without noticeable performance regressions in core reading and interaction flows.
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 4. Architecture Baseline & Refactor Guardrails | 1/1 | Shipped | 2026-04-13 |
| 5. Server-First Static Surface Atomization | 1/1 | Shipped | 2026-04-13 |
| 6. Knowledge Map Feature Decomposition | 1/1 | Shipped | 2026-04-13 |
| 7. Parity Hardening & Release Signoff | 1/1 | Shipped | 2026-04-13 |
| 8. Motion Language & Reveal Rhythm | 0/TBD | Not started | - |
| 9. Interactive Continuity & Real Loading States | 0/TBD | Not started | - |
| 10. Responsive Hierarchy Rewrite | 0/TBD | Not started | - |
| 11. Recruiter-First Finish & Quality Guardrails | 0/TBD | Not started | - |
