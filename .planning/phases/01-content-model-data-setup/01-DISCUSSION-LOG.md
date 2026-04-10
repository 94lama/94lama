# Phase 1: Content Model & Data Setup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10T19:34:36+00:00
**Phase:** 1-Content Model & Data Setup
**Areas discussed:** Content source, Data shape, Future fields

---

## Content source

| Option | Description | Selected |
|--------|-------------|----------|
| CV-led source | Keep `public/assets/cv.md` as the main editable source, and create app-ready structured data from it | ✓ |
| Portfolio data file | Create a dedicated app-owned content file and treat `cv.md` as reference material only | |
| Dual-source | Keep CV content and portfolio content as two separate maintained artifacts | |
| You decide | Let the implementation choose the simplest robust source setup | |

**User's choice:** `public/assets/cv.md` must remain the main source, but it can be extended with extra information later.
**Notes:** Extra portfolio-only content should be maintained inside `cv.md`, app sync should be automatic, and Phase 1 should keep close to the current CV structure.

---

## Data shape

| Option | Description | Selected |
|--------|-------------|----------|
| Section-based | Keep top-level groups close to the current CV sections | ✓ |
| Highly normalized | Break content down aggressively for future composition | |
| Hybrid | Use CV-like sections but normalize repeated structures inside them | |
| You decide | Let implementation choose the best structure | |

**User's choice:** Section-based shared model.
**Notes:** Skills should stay grouped by category, experience should use structured entries, and contact info should live in a dedicated contact object.

---

## Future fields

| Option | Description | Selected |
|--------|-------------|----------|
| Strictly v1 fields | Model only what the current phase and milestone need right now | |
| Add obvious future placeholders | Include a few clearly expected optional sections now | ✓ |
| Future-ready broadly | Design a richer deferred schema from the start | |
| You decide | Let implementation choose the right balance | |

**User's choice:** Add obvious future placeholders only.
**Notes:** Allow an optional empty projects section now, add optional GitHub and LinkedIn fields, and keep future-oriented fields optional instead of required.

---

## the agent's Discretion

- Exact content model types and filenames.
- Exact transformation/parsing layer between `cv.md` and the app.
- Minimal cleanup rules for turning the authored markdown into app-ready structured data.

## Deferred Ideas

- Full project showcase content and rendering.
- Broader speculative schema for later milestones beyond obvious placeholders.
