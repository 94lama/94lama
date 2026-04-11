# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-04-11
**Phases:** 3 | **Plans:** 7 | **Sessions:** 3

### What Was Built
- A typed server-side portfolio content pipeline sourced from `public/assets/cv.md`.
- A bold recruiter-focused one-page portfolio with a content-driven hero, grouped credentials, and an integrated experience map.
- An email-first contact flow with authored GitHub and LinkedIn secondary actions.

### What Worked
- Keeping content in one authored markdown source reduced rewrite cost across all three phases.
- Small phase-scoped plans made it easy to separate content foundation, UI composition, and contact polish.

### What Was Inefficient
- Phase 2 needed a late re-verification loop after UAT exposed the hero clarity gap.
- Several planning artifacts needed retroactive sync after manual UAT and Nyquist validation were completed.

### Patterns Established
- Use a typed server-side content loader when the same portfolio data must drive multiple UI iterations.
- Pair lint/build checks with explicit manual UAT for visually driven frontend milestones.

### Key Lessons
1. Keep visual/UAT gaps concrete so they can be closed with a targeted follow-up plan instead of a broad redesign.
2. When shipped behavior depends on authored content, validate the data flow end-to-end, not just the rendered component tree.

### Cost Observations
- Model mix: n/a
- Sessions: 3
- Notable: Most milestone risk concentrated in late visual verification rather than base implementation.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 3 | 3 | Established typed content-pipeline planning plus UAT-backed frontend verification |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | lint, build, test:phase-03, UAT | Nyquist-compliant across 3 phases | 2 |

### Top Lessons (Verified Across Milestones)

1. Start with one maintained content source when future presentation variants are expected.
2. Treat manual visual verification as a first-class artifact for frontend-heavy milestones.
