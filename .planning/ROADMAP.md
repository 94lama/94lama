# Roadmap: Riccardo La Malfa Portfolio

## Overview

v1.1 is a focused refresh of the shipped recruiter-first single-page portfolio. The roadmap keeps the single-page flow intact, establishes the shared knowledge-map/experience interaction contract before heavier UI polish, then finishes with isolated consent bootstrap work.

## Milestones

- ✅ **v1.0 MVP** — Phases 1-3 shipped 2026-04-11
- 🚧 **v1.1 TODO refresh** — Phases 4-6 planned

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) - SHIPPED 2026-04-11</summary>

Archived milestone. See `.planning/MILESTONES.md` for shipped milestone summary.

</details>

### 🚧 v1.1 TODO refresh (In Progress)

**Milestone Goal:** Refine the shipped recruiter-first portfolio with map-first interaction, readable blue-led polish, clearer recruiter utility sections, and isolated consent bootstrap while preserving atomized composition and the single-page flow.

- [ ] **Phase 4: Knowledge Map & Experience Contract** - Establish the shared map-to-experience interaction model and replace the duplicate skills surface.
- [ ] **Phase 5: Recruiter Clarity Polish** - Improve visual readability, motion restraint, relocation clarity, and compact contact actions.
- [ ] **Phase 6: Consent Bootstrap Integration** - Add a single bootstrap consent path after the structural refresh is stable.

## Phase Details

### Phase 4: Knowledge Map & Experience Contract
**Goal**: Recruiters can use one shared knowledge-map interaction model to navigate skills and immediately understand relevant experience without losing the full timeline.
**Depends on**: Phase 3
**Requirements**: MAP-01, MAP-02, EXP-01, EXP-02
**Success Criteria** (what must be TRUE):
  1. Recruiter can use section `01` knowledge map as the primary skills surface instead of a separate skills block.
  2. Recruiter can inspect a cleaner knowledge map with the center sphere removed and nodes spaced clearly enough to scan.
  3. Recruiter can select a map node or category and immediately see related experience entries highlighted from the same page state.
  4. Recruiter can still scan the full experience timeline while related entries reorder to the top instead of hiding nonmatching entries.
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — Lock and test the shared map-to-experience ranking contract.
- [x] 04-02-PLAN.md — Replace duplicate skills/experience surfaces with a shared coordinator and refined map rendering.
- [ ] 04-03-PLAN.md — Human-verify the de-centered map and synced full-timeline experience behavior.
**UI hint**: yes

### Phase 5: Recruiter Clarity Polish
**Goal**: Recruiters can scan a more legible and polished single-page portfolio in light mode or dark mode, with clearer relocation details and cleaner contact actions.
**Depends on**: Phase 4
**Requirements**: UI-01, UI-02, UI-03, RELO-01, CONT-01, CONT-02
**Success Criteria** (what must be TRUE):
  1. Recruiter can scan the page with blue-led accents and strong contrast without losing readability in either light mode or dark mode.
  2. Recruiter gets subtle motion cues on interactive elements and state changes without page-wide animation slowing scan speed.
  3. Users who prefer reduced motion can use the same page flow without non-essential animation.
  4. Recruiter can read clearer relocation timing and preference details in the dedicated relocation section.
  5. Recruiter can use compact icon-based GitHub and LinkedIn actions while email stays primary and relocation details are not duplicated in contact.
**Plans**: TBD
**UI hint**: yes

### Phase 6: Consent Bootstrap Integration
**Goal**: Visitors get the required cookie/privacy consent prompt at app bootstrap without disrupting the recruiter-first single-page experience.
**Depends on**: Phase 5
**Requirements**: CONS-01
**Success Criteria** (what must be TRUE):
  1. Visitor is prompted for cookie/privacy consent on initial app load when consent is required.
  2. Visitor sees one working consent flow, without duplicate banners or broken legal preference actions.
  3. Visitor can continue using the same single-page portfolio after consent handling without losing access to policy links.
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 4. Knowledge Map & Experience Contract | 0/0 | Not started | - |
| 5. Recruiter Clarity Polish | 0/0 | Not started | - |
| 6. Consent Bootstrap Integration | 0/0 | Not started | - |
