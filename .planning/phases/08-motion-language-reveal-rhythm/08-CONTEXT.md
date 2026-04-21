# Phase 8: Motion Language & Reveal Rhythm - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 8 defines one restrained motion language for the existing one-page recruiter portfolio so section reveals, state transitions, and interaction feedback feel consistent and readable. This phase clarifies how already-rendered content should enter and respond without adding fake loading, new product surface, or choreography that belongs to the continuity/loading work in Phase 9.

</domain>

<decisions>
## Implementation Decisions

### Reveal Rhythm
- **D-01:** Use a single recruiter-first entrance pattern based on vertical fade-in reveals for major section content, matching the existing `fade-in-up` direction already used by the knowledge-map panel runtime.
- **D-02:** Keep the shared reveal duration around 2 seconds so the motion feels calmer and less toy-like, while still using only light stagger for nearby child elements rather than long cinematic sequencing.
- **D-03:** The hero stays effectively immediate and readable above the fold; motion can polish supporting surfaces inside the hero, but must not delay the primary positioning, summary, or email CTA.

### Interaction Feedback
- **D-04:** Primary CTAs, links, pills, cards, and selectable controls should share one micro-interaction family: subtle lift, border/accent reinforcement, and fast response using the transition primitives already present in `section-card-styles.ts` and the hero/contact actions.
- **D-05:** Interactive feedback should feel immediate and compact, with hover/focus/press states signaling affordance without exaggerated travel distance, bounce, or spring-heavy personality.
- **D-06:** Focus-visible treatment remains clear and functional; motion complements the existing outline/focus behavior instead of replacing it.

### Knowledge Map Motion Baseline
- **D-07:** Treat the current knowledge-map entrance helper and reduced-motion branching as the baseline for the broader motion system rather than introducing a separate animation vocabulary for the rest of the page.
- **D-08:** The map, detail panel, and related chips/buttons should keep their stronger interactive energy than static sections, but still align to the same timing/easing family so the portfolio reads as one system.

### the agent's Discretion
- Exact duration values, delay increments, and token names can be finalized during planning as long as they stay short, consistent, and recruiter-first.
- The implementation can decide whether to express the motion language through shared constants, utility classes, or small helpers, provided it avoids unnecessary animation tooling and preserves the current stack.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone and phase intent
- `.planning/PROJECT.md` - Milestone goal, current app structure, and non-negotiable recruiter-first constraints.
- `.planning/REQUIREMENTS.md` - Phase 8 requirements `MOTN-01`, `MOTN-02`, and `MOTN-03`, plus explicit out-of-scope motion/loading constraints.
- `.planning/ROADMAP.md` - Phase 8 goal, dependency ordering, and success criteria.
- `.planning/STATE.md` - Current milestone focus and recent decisions that defer loading-specific and reduced-motion-specific follow-up work.

### Existing motion-related code
- `app/globals.css` - Defines the existing `fade-in-up` keyframes used as the current entrance pattern.
- `app/components/knowledge-map/runtime.ts` - Defines `getEntranceStyle()` and the knowledge-map motion/reduced-motion baseline.
- `app/components/knowledge-map/knowledge-map-panels.tsx` - Shows current staggered entrance usage and interactive transition patterns around the map UI.
- `app/components/section-card-styles.ts` - Centralizes current card/chip/pill transition behavior shared across static sections.
- `app/components/hero-section.tsx` - Contains the primary CTA and hero media/link interaction patterns that must stay immediate and readable.
- `app/components/contact-actions.tsx` - Shows current reusable recruiter-contact affordance styling.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/components/section-card-styles.ts`: Already centralizes transition-heavy class strings for panels, cards, chips, and pills; likely the cleanest place to anchor shared motion tokens or class composition.
- `app/components/knowledge-map/runtime.ts#getEntranceStyle`: Existing lightweight entrance helper can be reused or generalized for section reveal rhythm.
- `app/components/contact-actions.tsx`: Reuses shared chip styling for recruiter contact actions and can inherit any common interaction feedback changes.
- `app/components/section-shell.tsx`: Shared wrapper for section cards provides a natural insertion point if reveal behavior needs to be applied consistently.

### Established Patterns
- Motion is currently implemented with Tailwind transitions plus one CSS keyframe in `app/globals.css`; there is no dedicated animation library, which aligns with the milestone constraint against heavy tooling.
- Reduced-motion handling already exists in the knowledge-map flow via `matchMedia("(prefers-reduced-motion: reduce)")` and `getEntranceStyle(prefersReducedMotion)`.
- Interactive surfaces already prefer subtle `hover:-translate-y-0.5` movement and 200-300ms transitions instead of large transformations.

### Integration Points
- Static recruiter-facing sections can adopt shared reveal rules through their section shell/card wrappers.
- The hero and contact areas need special handling because they carry the highest-priority scan and conversion content.
- The knowledge-map panel/canvas surfaces are the strongest existing source of motion behavior and should be aligned with, not redesigned away from, the future shared system.

</code_context>

<specifics>
## Specific Ideas

- Keep the page feeling polished but restrained: motion should guide scan order and state clarity, not create spectacle.
- Use the existing knowledge-map entrance direction as the visual anchor so motion across the rest of the portfolio feels native to the shipped UI rather than newly imposed.
- Maintain immediate feedback on recruiter-facing actions such as email, GitHub, LinkedIn, cards, and selectable skill/map controls.

</specifics>

<deferred>
## Deferred Ideas

- Reduced-motion hardening and explicit reduced-motion acceptance criteria remain future-scope work (`MOTN-05`) even though current implementations should continue respecting the existing preference checks.
- Coordinated map/panel/timeline continuity and real loading choreography belong to Phase 9, not this motion-language phase.

</deferred>

---

*Phase: 08-motion-language-reveal-rhythm*
*Context gathered: 2026-04-21*
