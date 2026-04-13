# Roadmap: Riccardo La Malfa Portfolio

## Overview

v1.1 is an architecture-first refactor of the shipped recruiter-facing portfolio. The roadmap keeps the current UI and interaction behavior effectively unchanged while rebuilding the rendered app around reusable atomic components, a thin server-first `app/page.tsx`, an explicitly bounded knowledge-map client island, and parity safeguards strong enough to ship the refactor safely.

## Milestones

- ✅ **v1.0 MVP** — Phases 1-3 shipped 2026-04-11
- 🚧 **v1.1 implement atomization of components** — Phases 4-7 planned

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) - SHIPPED 2026-04-11</summary>

Archived milestone. See `.planning/MILESTONES.md` for shipped milestone summary.

</details>

### 🚧 v1.1 implement atomization of components (In Progress)

**Milestone Goal:** Atomize the full rendered app without changing recruiter-facing UI or behavior, keep the page server-first and SEO-safe, split the knowledge-map feature across model/OGL/UI layers, and ship with documentation plus regression confidence.

- [ ] **Phase 4: Architecture Baseline & Refactor Guardrails** - Capture the current architecture and lock regression guardrails before structural extraction starts.
- [ ] **Phase 5: Server-First Static Surface Atomization** - Extract reusable atoms and static sections while keeping `app/page.tsx` thin, server-rendered, and indexable.
- [ ] **Phase 6: Knowledge Map Feature Decomposition** - Split the knowledge-map hotspot into model, OGL runtime, and UI layers without changing recruiter-visible behavior.
- [ ] **Phase 7: Parity Hardening & Release Signoff** - Prove recruiter-visible parity with Playwright and QA before the milestone ships.

## Phase Details

### Phase 4: Architecture Baseline & Refactor Guardrails
**Goal**: Maintainer has a trusted architectural baseline and regression safety net before the refactor starts moving the rendered app apart.
**Depends on**: Phase 3
**Requirements**: QUAL-01, QUAL-02
**Success Criteria** (what must be TRUE):
  1. Maintainer can review `.planning/ARCHITECTURE.md` for a current inventory of pages, components, data flow, and server/client boundaries before and after the refactor.
  2. Maintainer can run automated regression checks that catch page composition drift, CTA visibility/wiring regressions, and map-to-experience invariant breaks during later phases.
  3. Maintainer can use the documented baseline and regression suite as the acceptance guardrail for every later extraction step.
**Plans**: TBD

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
**Plans**: TBD
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
**Plans**: TBD
**UI hint**: yes

### Phase 7: Parity Hardening & Release Signoff
**Goal**: Maintainer can prove the refactor preserved recruiter-facing behavior, accessibility, responsive parity, and layout integrations well enough to release.
**Depends on**: Phase 6
**Requirements**: QUAL-03, QUAL-04
**Success Criteria** (what must be TRUE):
  1. Maintainer can run Playwright parity checks for initial page render, primary recruiter contact visibility, and map-to-experience interaction.
  2. Maintainer can follow an explicit QA checklist covering map interaction parity, accessibility smoke checks, responsive parity, and layout-level legal and analytics wiring.
  3. Recruiter-facing UI and interaction behavior remain effectively unchanged across final parity verification on desktop and mobile checkpoints.
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 4. Architecture Baseline & Refactor Guardrails | 0/TBD | Not started | - |
| 5. Server-First Static Surface Atomization | 0/TBD | Not started | - |
| 6. Knowledge Map Feature Decomposition | 0/TBD | Not started | - |
| 7. Parity Hardening & Release Signoff | 0/TBD | Not started | - |
