# Phase 8: Motion Language & Reveal Rhythm - UI Design Contract

**Generated:** 2026-04-21
**Status:** Ready for planning

## Visual Intent

The portfolio should feel calmer, more intentional, and more unified through one restrained motion language. Motion should help recruiters orient their eye and confirm interactivity without delaying reading, adding spectacle, or making the page feel product-demo-heavy.

## Experience Principles

1. Hero-first readability: above-the-fold positioning, summary, and email CTA remain effectively immediate.
2. One family of movement: section reveals, cards, chips, links, and map-adjacent controls share the same vertical fade and compact interaction response.
3. Polished but compact: travel distance stays small, durations stay short, and stagger is only used for nearby sibling content.
4. Existing map vocabulary leads: the `fade-in-up` direction and knowledge-map entrance helper define the baseline instead of introducing a separate animation style.
5. Accessible feedback: motion reinforces existing focus and state cues instead of replacing them.

## Motion Contract

### Reveal rhythm

- Shared entrance direction: short fade-up.
- Shared reveal timing family: fast (around 160-220ms) for interaction response, short (around 240-360ms) for section/content reveals, with the knowledge-map helper allowed to remain slightly longer when needed.
- Shared reveal distance: subtle, roughly the current `translateY(12px)` scale or smaller.
- Stagger: only for grouped child items inside one surface; avoid page-wide sequencing.
- Hero exception: hero shell can receive polish, but primary text and CTA must not wait behind delayed choreography.

### Interaction feedback

- Primary CTA, contact chips, icon actions, cards, pills, and selectable map controls should use the same compact interaction family:
  - subtle lift
  - border or accent reinforcement
  - opacity/color confirmation
- Pressed states should feel immediate and tighter than hover states.
- Focus-visible outlines remain explicit and readable.

### Surface priorities

- Highest priority: hero CTA, hero supporting cards, contact CTA, contact icon actions.
- Medium priority: section shells, section inner cards, section headings, relocation/language/education cards.
- Stronger energy but same family: knowledge-map details panel, map chips, neighbor buttons, category buttons, timeline highlight states.

## Targeted Surfaces

- `app/components/section-shell.tsx`: shared section reveal entry point for static numbered sections.
- `app/components/section-heading.tsx`: consistent heading badge/eyebrow polish without blocking reading.
- `app/components/section-card-styles.ts`: central motion tokens and reusable interaction classes.
- `app/components/hero-section.tsx`: hero CTA and supporting card polish while keeping content immediate.
- `app/components/contact-actions.tsx` and `app/components/contact-section.tsx`: recruiter-contact affordance feedback.
- `app/components/knowledge-map/knowledge-map-panels.tsx`: align panel and control timing with the shared system.
- `app/components/experience-card.tsx` and `app/components/experience-timeline-section.tsx`: timeline highlight and card response alignment.

## Constraints

- Do not add a new animation library.
- Do not add fake loading or placeholder choreography in this phase.
- Do not hide already-rendered section content for long reveal sequences.
- Do not remove the current reduced-motion branching that already exists in the knowledge-map flow.
- Do not redesign the knowledge-map interaction model in this phase.

## Acceptance Signals

- Shared motion primitives exist in reusable code rather than ad-hoc per component.
- Static sections reveal with the same rhythm instead of mixed timings or no rhythm.
- Primary recruiter actions show immediate feedback on hover, focus, and press.
- Knowledge-map panel controls still feel slightly more energetic than static sections, but visibly belong to the same motion family.

---

*Phase: 08-motion-language-reveal-rhythm*
*UI contract generated: 2026-04-21*
