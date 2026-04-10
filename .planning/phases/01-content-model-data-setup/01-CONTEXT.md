# Phase 1: Content Model & Data Setup - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a reusable content source for the portfolio and wire the current app to render from it. This phase defines how portfolio information is authored and shaped for app use; it does not decide the final bold UI design for the page.

</domain>

<decisions>
## Implementation Decisions

### Content source
- **D-01:** `public/assets/cv.md` remains the main editable source of truth for portfolio content.
- **D-02:** Portfolio-only information should be added by extending `public/assets/cv.md` with extra sections rather than introducing a separate maintained content source.
- **D-03:** The app should stay in sync automatically from the maintained source, without a manual sync step.
- **D-04:** Phase 1 should preserve the current CV structure and wording closely, with only light normalization needed for app rendering.

### Content model shape
- **D-05:** The shared content model should use section-based top-level groups that stay close to the CV structure.
- **D-06:** Skills should remain grouped by category, not flattened into a single list.
- **D-07:** Professional experience should be represented as structured entries with separate fields for role, company, dates, and highlights.
- **D-08:** Contact information should live in a dedicated contact object rather than being scattered through profile text.

### Future-oriented fields
- **D-09:** Phase 1 should add only obvious future placeholders, not a broad speculative schema.
- **D-10:** The content model may include an optional empty projects section now, even though projects are deferred from v1.0 delivery.
- **D-11:** The source and shared model should support explicit optional GitHub and LinkedIn contact fields now.
- **D-12:** Future-oriented fields must be optional rather than required placeholders.

### the agent's Discretion
- Exact TypeScript shape and file/module names for the shared content model.
- Whether normalization happens directly at read time or through a small transformation layer.
- Small parsing/cleanup choices needed to make the current `cv.md` app-ready while keeping it close to the authored source.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning contract
- `.planning/PROJECT.md` — Product framing, milestone scope, constraints, and locked content-source decisions.
- `.planning/REQUIREMENTS.md` — Requirement IDs `CONT-01` and `CONT-02`, plus deferred items that should not expand Phase 1 scope.
- `.planning/ROADMAP.md` — Phase 1 goal, requirements, and success criteria.
- `.planning/STATE.md` — Current active phase and outstanding blocker note about LinkedIn URL.

### Source content
- `public/assets/cv.md` — Main editable source of truth for portfolio content.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/page.tsx` — Current single-page consumer that will be replaced with content-driven rendering.
- `app/layout.tsx` — Existing app shell and metadata entry point.
- `app/globals.css` — Global theme tokens and baseline styling already in place.
- `public/assets/foto profilo.jpg` — Existing profile image asset available for future use.
- `public/assets/Riccardo_La_Malfa_CV.pdf` — Existing CV file asset available for later milestones.

### Established Patterns
- App Router structure is already in use via `app/`.
- Styling is handled with Tailwind 4 utility classes plus a small global theme setup.
- The current app is extremely minimal, so Phase 1 can establish the first real content/data pattern without needing to conform to an existing domain model.

### Integration Points
- The shared content model will feed `app/page.tsx` first.
- Any content helpers or transformation utilities should fit naturally into the existing Next.js app structure and remain reusable by future UI variants.

</code_context>

<specifics>
## Specific Ideas

- Keep the authored content close to the CV rather than rewriting it into a portfolio-specific source immediately.
- Extra portfolio-only information, such as personal projects later, should still live alongside the main source instead of creating a second content maintenance workflow.

</specifics>

<deferred>
## Deferred Ideas

- Rich project content and project showcase rendering — deferred to a later phase or milestone.
- Broader future-ready schema beyond obvious placeholders — intentionally deferred to avoid over-design in Phase 1.

</deferred>

---

*Phase: 01-content-model-data-setup*
*Context gathered: 2026-04-10*
