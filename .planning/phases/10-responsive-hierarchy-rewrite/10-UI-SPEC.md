# Phase 10: Responsive Hierarchy Rewrite - UI Design Contract

**Generated:** 2026-04-21
**Status:** Ready for planning

## Visual Intent

The portfolio should feel materially reworked for recruiter scanning without turning into a different product. The page should read as clearer, more deliberate chunks: strong positioning first, proof close behind, and contact actions kept obvious across mobile, tablet, and desktop. The visual shift should come from spacing, grouping, and responsive composition rather than spectacle or DOM-order tricks.

## Experience Principles

1. Proof arrives early: the hero should hand off quickly into the skills and experience evidence block.
2. Single-column-first clarity: mobile and narrow widths should read as one calm vertical narrative with no relearning.
3. CTA visibility is non-negotiable: the primary email action stays prominent at every breakpoint, with secondary actions nearby but quieter.
4. Shared rhythm, not isolated tuning: section spacing, card density, and lower-grid relationships should feel like one system.
5. Supporting sections stay lighter: education, languages, relocation, and contact should reinforce trust without competing with the proof block.

## Layout Contract

### Page rhythm and chunking

- Introduce a clearer page-level rhythm with larger section-to-section separation than the current stacked layout.
- Use compact internal grouping for supporting metadata while giving hero proof and CTA surfaces noticeably more breathing room.
- Let shared section wrappers or layout recipes own spacing density so the rewrite does not degrade into per-section one-off classes.

### Hero and proof hierarchy

- Keep the DOM order unchanged: hero, skills, experience, education, languages, relocation, contact.
- Recompose the hero so positioning, summary, and primary contact action remain the first read, while support facts and profile details become easier secondary chunks.
- Treat the interactive skills and experience region as the main proof block and visually connect it more tightly to the hero than to the lower supporting sections.

### Responsive reflow

- Mobile and narrow tablet layouts should prefer a clean single-column stack.
- Desktop may use richer grid compositions, but only when source-order reading and CTA visibility remain obvious.
- Lower supporting sections can use intentional pairings, but should collapse back to simple, readable stacks on smaller screens.
- Avoid sticky or floating layout tricks that steal viewport height from the reading path.

### CTA and supporting detail balance

- The email CTA remains the strongest contact affordance in both hero and contact contexts.
- Secondary actions stay grouped with the primary CTA rather than drifting into distant corners.
- Contact, relocation, languages, and education cards should feel compact and scannable, not oversized enough to compete with proof content.

## Targeted Surfaces

- `app/page.tsx`: page-level section grouping, rhythm, and lower-grid composition.
- `app/components/hero-section.tsx`: positioning, proof intro, hero support-card density, and CTA prominence.
- `app/components/knowledge-experience-coordinator.tsx`: proof-block spacing and relationship between skills and experience sections.
- `app/components/section-shell.tsx`: shared density and spacing variants for numbered supporting sections.
- `app/components/section-card-styles.ts`: rhythm-friendly panel and card tokens reused across the rewrite.
- `app/components/education-section.tsx`, `app/components/languages-section.tsx`, `app/components/relocation-section.tsx`, `app/components/contact-section.tsx`: supporting-section density tuning and responsive pairings.
- `app/components/loading/route-shell-skeleton.tsx`: optional alignment pass so the loading shell still mirrors the revised structure.

## Constraints

- Do not reorder the DOM for desktop-only cosmetics.
- Do not add viewport-width client logic for layout decisions.
- Do not introduce sticky recruiter navigation, fake loading, or theatrical transitions in this phase.
- Do not widen the client-island boundary beyond the existing interactive skills and experience surface.
- Do not let supporting sections overshadow positioning, proof, or primary contact actions.

## Acceptance Signals

- The page composition reads as distinct recruiter-friendly chunks instead of one crowded vertical stack.
- The hero leads naturally into the proof block, and the lower sections feel clearly secondary.
- Mobile, tablet, and desktop all preserve comfortable scan order and CTA visibility.
- Shared spacing and density logic appears in reusable layout or section primitives, not only as ad hoc per-section tuning.

---

*Phase: 10-responsive-hierarchy-rewrite*
*UI contract generated: 2026-04-21*
