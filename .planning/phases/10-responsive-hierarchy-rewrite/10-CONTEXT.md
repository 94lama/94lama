# Phase 10: Responsive Hierarchy Rewrite - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 10 reworks the existing one-page recruiter portfolio hierarchy so positioning, proof, and primary contact actions scan faster across mobile, tablet, and desktop. The scope is spacing rhythm, section chunking, responsive reflow, and proof-first composition within the current page narrative, not new product surfaces, fake loading behavior, or a broader information-architecture rewrite beyond what is needed to improve recruiter comprehension.

</domain>

<decisions>
## Implementation Decisions

### Page Rhythm And Section Chunking
- **D-01:** Use a clearer vertical rhythm across the page with more deliberate section spacing, padding, and internal grouping so each recruiter-facing block reads as a distinct chunk instead of a crowded continuous stack.
- **D-02:** Tighten related metadata into compact supporting cards while giving primary positioning, proof, and CTA surfaces more breathing room than secondary supporting details.
- **D-03:** Keep shared section spacing driven by reusable layout primitives or tokens rather than ad hoc per-section tuning so the rewrite stays coherent across all breakpoints.

### Responsive Reflow And CTA Visibility
- **D-04:** Treat mobile and narrow layouts as single-column-first reading flows, preserving logical source order and avoiding breakpoint-specific visual cleverness that makes recruiters relearn the page.
- **D-05:** Keep the primary email CTA visible and high-priority at every breakpoint, with secondary contact actions remaining close enough to feel connected without competing with the main action.
- **D-06:** Favor CSS-first reflow using grid, gap, and width recipes over client-side viewport logic, while keeping tap targets and interactive surfaces comfortable on tablet and mobile.

### Proof-First Composition
- **D-07:** Rework the composition so recruiter proof appears earlier and reads more clearly after the positioning statement, with the hero leading into the skills and experience evidence flow before lower-priority supporting sections.
- **D-08:** Preserve the current narrative order in the DOM: hero, skills, experience, education, languages, relocation, contact. Improve hierarchy through grouping, density, and visual emphasis rather than desktop-only DOM reordering.
- **D-09:** The interactive skills and experience region should remain the main proof block, with surrounding spacing and section relationships tuned to make that evidence easier to parse before recruiters reach supporting background details.

### Carry-Forward Guardrails
- **D-10:** Carry forward the Phase 8 and Phase 9 rules: reveals stay restrained, continuity remains truthful, and no fake loading or theatrical transitions are introduced as part of the layout rewrite.
- **D-11:** Preserve the existing server-first architecture and narrow client island boundary while changing layout and hierarchy, so responsive polish does not widen client ownership or hide already-available recruiter content.

### the agent's Discretion
- Exact breakpoint values, gap scales, and whether to introduce dedicated layout helpers such as `layout/page-rhythm.ts` or `layout/responsive-section-grid.tsx` can be finalized during planning.
- Planning can decide the precise regrouping of hero support cards, lower two-column pairings, and section-shell density variants as long as the result remains recruiter-first, source-order-safe, and easier to scan on mobile and desktop.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone and phase intent
- `.planning/PROJECT.md` - Milestone goal, recruiter-first constraints, and the explicit allowance for layout restructuring when it improves UX/UI quality.
- `.planning/REQUIREMENTS.md` - Phase 10 requirements `LAY-01`, `LAY-02`, and `LAY-03`, plus the quality constraints that layout changes must not weaken scan speed or contact discoverability.
- `.planning/ROADMAP.md` - Phase 10 goal, dependency ordering, and success criteria for the responsive hierarchy rewrite.
- `.planning/STATE.md` - Current milestone position and carry-forward decisions from Phases 8 and 9.
- `.planning/phases/08-motion-language-reveal-rhythm/08-CONTEXT.md` - Locked motion rules that the responsive rewrite must preserve rather than replace.
- `.planning/phases/09-interactive-continuity-real-loading-states/09-CONTEXT.md` - Locked continuity and truthful-loading rules that remain in force during the layout rewrite.

### Milestone research
- `.planning/research/SUMMARY.md` - Recommends responsive recomposition after continuity stabilizes, with proof-first hierarchy, CSS-first layout recipes, and no fake loading or DOM-order regressions.
- `.planning/research/ARCHITECTURE.md` - Documents the recommended additive architecture for responsive restructuring, including server-safe layout recipes and preserved source order.
- `.planning/research/FEATURES.md` - Defines the recruiter-facing feature goals and anti-features for responsive hierarchy, spacing rhythm, CTA visibility, and scan-friendly reflow.

### Existing page composition and layout primitives
- `app/page.tsx` - Current top-level section order and paired section grids that Phase 10 will recompose.
- `app/components/hero-section.tsx` - Current positioning, proof, and primary CTA composition that likely needs the most hierarchy tuning.
- `app/components/knowledge-experience-coordinator.tsx` - Existing proof-heavy skills and experience composition that should stay the main evidence block.
- `app/components/section-shell.tsx` - Shared section wrapper that currently owns outer spacing and can absorb density or rhythm variants.
- `app/components/section-card-styles.ts` - Shared surface, spacing, and motion class recipes that should anchor the rewrite before new abstractions are introduced.
- `app/components/contact-section.tsx` - Current primary and secondary contact action layout that must stay obvious across breakpoints.
- `app/components/education-section.tsx` - Supporting proof section currently rendered as a simple card list inside the lower grid.
- `app/components/languages-section.tsx` - Supporting section whose compact card layout may need responsive density tuning.
- `app/components/relocation-section.tsx` - Supporting section with pills and metadata cards that affects lower-page chunking.
- `app/components/loading/route-shell-skeleton.tsx` - Route shell mirror of the current page structure; useful when keeping loading continuity aligned with any new composition.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/components/section-shell.tsx`: Already centralizes outer section padding and panel styling, making it the cleanest place to add density or spacing variants.
- `app/components/section-card-styles.ts`: Already owns the shared surface recipes and transition tokens, so page-rhythm adjustments can stay consistent without duplicating class strings.
- `app/page.tsx`: Already preserves the recruiter reading order in one thin server composition root, which supports CSS-first recomposition without broad refactors.
- `app/components/hero-section.tsx`: Already contains the highest-priority positioning and contact surfaces, so hierarchy gains here will have the biggest recruiter impact.
- `app/components/knowledge-experience-coordinator.tsx`: Already groups the skills and experience proof flow, making it the natural anchor for a proof-first middle section.

### Established Patterns
- The app remains mostly server-rendered, with the knowledge-map area as the main client island; responsive hierarchy work should preserve that boundary.
- Layout is currently expressed through Tailwind grid and spacing classes inline inside server components, with no dedicated layout abstraction layer yet.
- The page already uses paired lower grids for education/languages and relocation/contact, so Phase 10 can improve those pairings without changing the core narrative order.
- Motion and continuity rules from earlier phases already exist, so hierarchy changes should build on them instead of re-litigating reveal or loading behavior.

### Integration Points
- Page-level spacing and grouping changes will connect through `app/page.tsx` and the section wrappers it composes.
- Hero hierarchy changes will likely involve `app/components/hero-section.tsx`, especially the placement and density of support cards, portrait, and CTA cluster.
- Shared rhythm adjustments can flow through `app/components/section-shell.tsx` and `app/components/section-card-styles.ts` before touching individual sections.
- Lower-page responsive pairings will likely land in the education, languages, relocation, and contact sections together so their relationship reads more intentionally.

</code_context>

<specifics>
## Specific Ideas

- Auto-selected focus areas: page rhythm and section chunking, responsive reflow and CTA visibility, proof-first composition.
- Make the page feel materially reworked through hierarchy and grouping, not through spectacle or new feature surface.
- Keep the strongest proof path obvious: positioning first, then evidence, then contact reassurance and supporting details.

</specifics>

<deferred>
## Deferred Ideas

- Explicit reduced-motion acceptance criteria and broader regression guardrails remain Phase 11 scope even though Phase 10 should keep honoring existing reduced-motion and performance constraints.
- New recruiter-facing capabilities, alternate navigation systems, sticky orientation aids, or major one-page IA expansion remain out of scope unless planning proves they are necessary for the existing Phase 10 success criteria.
- Any further loading-shell redesign beyond keeping it aligned with the new structure remains secondary to the hierarchy rewrite itself.

</deferred>

---

*Phase: 10-responsive-hierarchy-rewrite*
*Context gathered: 2026-04-21*
