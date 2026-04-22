# Phase 8: Motion Language & Reveal Rhythm - Research

**Completed:** 2026-04-21
**Status:** Research complete

## Research Question

What does this portfolio already do for motion, and what is the smallest credible implementation path to create one recruiter-first motion language across reveals and interactive surfaces without harming scan speed or adding tooling churn?

## Findings

### 1. The current motion baseline already exists in two places

- `app/globals.css` defines `fade-in-up` with `translateY(12px)` and opacity from 0 to 1.
- `app/components/knowledge-map/runtime.ts#getEntranceStyle()` exposes that pattern through a small helper and already short-circuits for reduced motion.

Implication: Phase 8 should standardize around this existing direction rather than create a new animation vocabulary.

### 2. Reusable interaction behavior is already partly centralized

- `app/components/section-card-styles.ts` already owns panel, card, chip, and pill transition strings.
- Current interaction language is restrained: small hover lift (`-translate-y-0.5`) and 200-300ms transitions.

Implication: centralizing additional motion tokens in `section-card-styles.ts` plus a small reveal helper is lower risk than scattering new classes through each section.

### 3. Static sections share one wrapper but not one reveal system yet

- `SectionShell` wraps `Education`, `Languages`, `Relocation`, and `Contact`.
- `KnowledgeExperienceCoordinator` uses plain `<section>` blocks for the Skills and Experience pair.
- `HeroSection` is its own surface.

Implication: the phase likely needs two integration paths:
- shared reveal support in `SectionShell` for static numbered sections
- explicit reveal application for hero plus skills/experience wrappers

### 4. The recruiter-first risk is delayed reading, not lack of animation power

The roadmap, requirements, and context all repeat the same constraint: motion must orient reading, not gate it. The app is mostly server-rendered, and fake waiting or cinematic sequencing would directly conflict with milestone goals.

Implication: reveals should be short, with light optional stagger for siblings only. Hero heading, role, summary, and email CTA should remain effectively immediate.

### 5. Knowledge-map controls should align, not flatten

- The knowledge-map panel already uses staggered entrance calls.
- Buttons, chips, and category cards use transitions but not one named shared contract.
- The map runtime has continuous motion and highlight emphasis that should remain slightly more energetic than static sections.

Implication: Phase 8 should normalize timing and feedback families across map-adjacent UI without redesigning the actual choreography between map, panel, and timeline. Cross-surface continuity belongs to Phase 9.

### 6. Verification can stay cheap and concrete

This phase is mainly stylistic infrastructure plus class updates, so useful automated checks are:

- `npm run build`
- greps for new shared motion helpers/tokens in shared styling files
- greps that confirm target sections consume those shared helpers/classes

Manual visual verification remains valuable, but the plan can still demand objective file-level evidence.

## Recommended Implementation Shape

1. Add shared motion tokens/helpers in the styling layer.
2. Apply shared reveal rhythm to hero, static section shells, and the skills/experience wrappers.
3. Align CTA/card/chip/control interactions to one micro-interaction family using the same token source.
4. Tighten knowledge-map panel and experience-card surfaces to the same timing/easing family without entering Phase 9 continuity work.

## Risks To Avoid

- Adding a dedicated animation dependency for a problem the current stack already solves.
- Hiding server-rendered content behind long reveal delays.
- Creating one motion system for static sections and another for the knowledge-map area.
- Accidentally folding loading states or map/timeline choreography into this phase.

## Validation Architecture

### Test infrastructure

| Property | Value |
|----------|-------|
| Framework | Next.js build plus existing Node test suite |
| Config file | `package.json` |
| Quick run command | `npm run build` |
| Full suite command | `npm run build && npm test` |
| Estimated runtime | ~30-90 seconds |

### Feedback sampling

- After each plan wave: run `npm run build`.
- Before phase signoff: run `npm run build && npm test`.
- Use file-level acceptance criteria for shared helper adoption so the phase is not judged only by subjective style language.

## Output For Planning

Phase 8 should likely split into two execution plans:

1. shared motion primitives plus section/hero reveal adoption
2. interaction feedback alignment across CTA, contact, map panel, and experience surfaces

That split keeps shared foundations independent from the more UI-specific surface retuning while still preserving a simple two-wave phase.

---

*Phase: 08-motion-language-reveal-rhythm*
*Research completed: 2026-04-21*
