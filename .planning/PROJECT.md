# Riccardo La Malfa Portfolio

## What This Is

A recruiter-focused portfolio webapp for Riccardo La Malfa. It presents his frontend-focused full-stack profile, experience, and core skills in a bold one-page format designed to make a strong first impression quickly. The content should stay reusable so future milestones can add alternative portfolio UIs without rewriting the underlying information.

## Core Value

A recruiter can understand Riccardo's positioning and know how to contact him within one minute.

## Current Milestone: v1.0 Professional Portfolio

**Goal:** Build a bold, recruiter-focused one-page portfolio webapp that quickly establishes Riccardo as a frontend-focused full-stack developer and drives contact.

**Target features:**
- One-page portfolio landing experience
- Hero, summary, skills, experience, education, languages, and relocation content sourced from `public/assets/cv.md`
- Clear primary email CTA plus GitHub and LinkedIn contact links
- Shared content foundation that can support future UI variants

## Requirements

### Validated

- CONT-01 validated in Phase 1: shared portfolio content now loads from `public/assets/cv.md` through a typed server-side parser/loader.
- CONT-02 validated in Phase 1: the landing page now renders required recruiter-facing sections from shared content instead of starter-template copy.

### Active

- [ ] Recruiters can understand Riccardo's role, summary, location, and relocation availability from a single page.
- [ ] Recruiters can scan core skills, experience, education, and languages without leaving the landing page.
- [ ] Recruiters can contact Riccardo through clear email, GitHub, and LinkedIn actions.
- [ ] Portfolio content is driven from a reusable structured source so future UI variants can reuse the same data.

### Out of Scope

- Project showcase in v1.0 - defer until the base portfolio narrative and contact flow are shipped.
- Direct CV view/download in v1.0 - the CV is the source for page content, not the primary artifact yet.
- Multiple switchable UIs in v1.0 - build the foundation now, add alternative layouts in later milestones.
- Multi-page information architecture in v1.0 - keep the first release focused, fast to ship, and easy to review.

## Context

- The current app is a fresh Next.js 16 / React 19 starter with App Router and Tailwind 4.
- `public/assets/cv.md` is the current source of truth for portfolio content; it contains Riccardo's summary, skills, experience, education, languages, and relocation details.
- `README.md` is outdated and also serves as the GitHub profile README, so portfolio copy should not be coupled to it.
- The initial audience is recruiters and hiring managers rather than clients.
- The first public release should prioritize quick comprehension and a clear path to contact over depth or breadth of content.

## Constraints

- **Tech stack**: Stay within the existing Next.js 16, React 19, and Tailwind 4 app - use the current codebase rather than replatforming.
- **Scope**: One page only - keep the first milestone tight and shippable.
- **Brand**: Bold/creative presentation - the final design should feel intentional, not like the starter template.
- **Content source**: Use `public/assets/cv.md` as the planning source of truth - avoid depending on the outdated profile README.
- **Contact dependency**: LinkedIn is approved for the contact section, but the actual profile URL still needs to be supplied before implementation is complete.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with a one-page recruiter portfolio | Keeps the first release focused on positioning and contact conversion | Completed in Phase 1 |
| Use `public/assets/cv.md` as the portfolio content source | The README is outdated and serves a different purpose | Completed in Phase 1 |
| Defer project showcase and direct CV download | They add scope without improving the core recruiter flow enough for v1.0 | Pending |
| Prepare content for future UI variants without building a switcher now | The user wants multiple UIs eventually, but not at the cost of first-release focus | Pending |

## Current State

Phase 1 is complete, and Phase 2 implementation is now in place. The app keeps the same reusable typed content pipeline from `public/assets/cv.md` while the landing page has been redesigned into a bold recruiter-facing portfolio; manual browser verification is still pending before Phase 2 can be treated as fully signed off.

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
2. Core Value check -> still the right priority?
3. Audit Out of Scope -> reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-10 after Phase 1 completion*
