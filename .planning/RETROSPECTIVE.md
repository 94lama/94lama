# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-04-11
**Phases:** 3 | **Plans:** 7 | **Sessions:** 3

### What Was Built
- A typed server-side portfolio content pipeline sourced from `public/assets/cv.json` (markdown source migrated into JSON for runtime consumption).
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

## Milestone: v1.1 — implement atomization of components

**Shipped:** 2026-04-13
**Phases:** 4 | **Plans:** 4 | **Sessions:** 1

### What Was Built
- A thin server-first `app/page.tsx` that composes the portfolio from extracted section components.
- Shared section and contact atoms reused across the recruiter-facing page surface.
- A decomposed knowledge-map feature with explicit model, selection, runtime, panel, and viewport layers.
- Playwright parity coverage plus an explicit QA checklist for release signoff.

### What Worked
- Starting with architecture and regression guardrails made the later refactor safer and easier to verify.
- Keeping the client island narrow preserved server-first rendering while still allowing the interactive map to evolve internally.
- Running Playwright against a dedicated production port removed false negatives caused by reused local servers.

### What Was Inefficient
- The phase directories for 4-7 were missing even though the roadmap already referenced them, so some planning scaffolding had to be created during execution.
- The initial Playwright failure looked like an app bug but was actually test-environment nondeterminism from server reuse.

### Patterns Established
- For App Router refactors, keep `app/page.tsx` server-first and move only true interaction hotspots behind client boundaries.
- When end-to-end parity matters, use deterministic production-server startup instead of reusing whatever is already running locally.

### Key Lessons
1. Architecture-first milestones benefit from shipping docs and guardrail tests before deeper extraction.
2. E2E reliability is part of product confidence; dedicated test infrastructure decisions can matter as much as selectors.

### Cost Observations
- Sessions: 1
- Notable: Most risk was concentrated in release verification and test determinism, not in the component extraction itself.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 3 | 3 | Established typed content-pipeline planning plus UAT-backed frontend verification |
| v1.1 | 1 | 4 | Established architecture-first refactor workflow with parity automation and deterministic Playwright setup |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | lint, build, test:phase-03, UAT | Nyquist-compliant across 3 phases | 2 |
| v1.1 | lint, build, test, test:e2e | Nyquist-compliant across 4 phases | 2 |

### Top Lessons (Verified Across Milestones)

1. Start with one maintained content source when future presentation variants are expected.
2. Treat manual visual verification as a first-class artifact for frontend-heavy milestones.
3. Keep Playwright isolated from ambient local server state when release parity is part of the milestone bar.
