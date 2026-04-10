# Roadmap: Riccardo La Malfa Portfolio

## Overview

This milestone turns the starter app into a recruiter-focused one-page portfolio by first moving portfolio information into a reusable content source, then building a bold landing-page experience around that data, and finally sharpening contact actions and release polish for a strong first public version.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Content Model & Data Setup** - Move portfolio content into a reusable structured source for future UI reuse. (Completed 2026-04-10)
- [ ] **Phase 2: Portfolio Page Experience** - Replace the starter page with a bold, recruiter-focused one-page portfolio. (Implementation complete 2026-04-10; manual verification pending)
- [ ] **Phase 3: Contact & Final Polish** - Make recruiter action obvious and finish the first release cleanly.

## Phase Details

### Phase 1: Content Model & Data Setup
**Goal**: Move portfolio content into a reusable structured source so future UI variants can reuse the same information.
**Depends on**: Nothing (first phase)
**Requirements**: CONT-01, CONT-02
**Success Criteria** (what must be TRUE):
  1. App content is sourced from a dedicated structured module or dataset, not scattered across the page component.
  2. The content shape covers all v1 sections: hero, summary, skills, experience, education, languages, relocation, and contact.
  3. The page can render from that shared content source without breaking current app behavior.
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Define the shared portfolio content contract and markdown loader/parser.
- [x] 01-02-PLAN.md — Refactor the page to render required sections from the shared content source.
**UI hint**: yes

### Phase 2: Portfolio Page Experience
**Goal**: Replace the starter page with a bold, recruiter-focused one-page portfolio layout.
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, HERO-03, SKIL-01, EXPR-01, EXPR-02, PORT-01, PORT-02
**Success Criteria** (what must be TRUE):
  1. The landing section clearly communicates name, role, summary, and relocation context at first glance.
  2. Skills, experience, education, and languages are presented in a visually strong, easy-to-scan sequence.
  3. The layout works cleanly on both mobile and desktop as a single-page experience.
  4. The design language feels intentionally bold/creative rather than like the default starter template.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Contact & Final Polish
**Goal**: Make recruiter action obvious and complete the first milestone with clear outbound contact paths.
**Depends on**: Phase 2
**Requirements**: CNTC-01, CNTC-02, CNTC-03
**Success Criteria** (what must be TRUE):
  1. Email is presented as the primary contact CTA.
  2. GitHub and LinkedIn are available as clear secondary actions.
  3. The final page feels release-ready for a first public portfolio version.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Content Model & Data Setup | 2/2 | Complete | 2026-04-10 |
| 2. Portfolio Page Experience | 3/3 | Awaiting manual verification | - |
| 3. Contact & Final Polish | 0/0 | Not started | - |
