# Phase 10: Responsive Hierarchy Rewrite - Research

**Completed:** 2026-04-21
**Status:** Research complete

## Research Question

What is the smallest credible implementation path to materially improve recruiter scan speed across mobile, tablet, and desktop through spacing rhythm, responsive reflow, and proof-first composition without breaking DOM order, server-first rendering, or the Phase 8 and 9 motion and loading rules?

## Findings

### 1. The current page already has the right narrative order, but not enough hierarchy separation

- `app/page.tsx` already keeps the intended recruiter order: hero, proof block, education/languages, relocation/contact.
- The main weakness is density and composition: the page currently reads as one evenly spaced stack with lower grids that feel functional rather than intentionally prioritized.

Implication: Phase 10 should preserve the current DOM order and rework grouping, gaps, and grid relationships instead of attempting an information-architecture rewrite.

### 2. The hero is the highest-leverage place to improve scan speed

- `hero-section.tsx` already contains positioning, summary, relocation, and primary contact signals.
- The hero layout still gives large visual weight to secondary surfaces, especially the aside, while the CTA cluster and support facts could be organized more deliberately.

Implication: one plan should focus on hero and page-level proof handoff before touching lower supporting sections.

### 3. Shared section primitives are ready to absorb density variants

- `SectionShell` already owns common outer padding and panel treatment for supporting sections.
- `section-card-styles.ts` already centralizes panel and card surfaces, and previous phases extended it with motion and continuity tokens.
- There is no existing `layout/` helper directory yet, which means the rewrite can introduce one small server-safe layout module if it clarifies rhythm instead of scattering classes through `app/page.tsx`.

Implication: CSS-first layout recipes are the lowest-risk way to implement coherent rhythm across sections and breakpoints.

### 4. The proof block should be visually closer to the hero than the lower grids

- `KnowledgeExperienceCoordinator` already presents the skills and experience sections as one coordinated area.
- Its current spacing is internally consistent, but the page-level wrapper does not yet make it feel like the primary proof continuation of the hero.

Implication: Phase 10 should give the proof block stronger page-level prominence through spacing, wrapper composition, and responsive rhythm, not through new client logic.

### 5. Supporting sections benefit more from compaction than from redesign

- Education, languages, relocation, and contact are already readable and semantically clear.
- Their opportunity is density tuning, cleaner pairings, and CTA-aware balance so they reinforce trust without competing with the proof block.

Implication: a second plan can recompose the lower supporting surfaces with compact layouts and CTA visibility checks rather than broad component rewrites.

### 6. Route-level loading should stay structurally aligned if page composition changes materially

- Phase 9 added `app/loading.tsx` and `RouteShellSkeleton` to mirror the page structure.
- If Phase 10 changes hero proportions or lower-grid grouping, the loading shell may need a matching pass to preserve continuity.

Implication: any plan that changes page structure should explicitly decide whether `route-shell-skeleton.tsx` also needs updates.

## Recommended Implementation Shape

1. Add one small shared layout recipe surface for page rhythm and responsive section grouping.
2. Rework `app/page.tsx`, `hero-section.tsx`, and the proof-block wrapper so positioning leads into evidence more clearly.
3. Tune `SectionShell` and the supporting sections for compact lower-page density and CTA visibility.
4. Extend the existing Node source-assertion suite with Phase 10 guardrails for DOM-order-safe composition, CTA prominence wiring, and page-structure alignment.

## Risks To Avoid

- Solving responsive layout with viewport listeners or client-only branching.
- Desktop-only visual cleverness that obscures source order or makes mobile feel unrelated.
- Enlarging supporting sections so they compete with the proof path.
- Changing page structure without updating the route shell or verification coverage.
- Accidentally re-litigating Phase 8 motion or Phase 9 continuity instead of carrying them forward.

## Validation Architecture

### Test infrastructure

| Property | Value |
|----------|-------|
| Framework | Next.js build plus existing Node test runner |
| Config file | `package.json` |
| Quick run command | `npm run build` |
| Full suite command | `npm run build && npm test` |
| Estimated runtime | ~90 seconds |

### Feedback sampling

- After each plan wave: run `npm run build`.
- Before phase signoff: run `npm run build && npm test`.
- Use source assertions for page structure, DOM-order-safe composition, and loading-shell alignment so the hierarchy rewrite is not judged only by subjective screenshots.

## Output For Planning

Phase 10 should likely split into two execution plans:

1. shared page-rhythm and proof-first composition changes for `app/page.tsx`, `hero-section.tsx`, and the proof block
2. supporting-section density, contact visibility, loading-shell alignment, and automated guardrail updates

That split keeps the most disruptive composition work isolated from the supporting-section polish and verification hardening.

---

*Phase: 10-responsive-hierarchy-rewrite*
*Research completed: 2026-04-21*
