# Phase 9: Interactive Continuity & Real Loading States - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 9 defines how the existing one-page recruiter portfolio preserves orientation during real loading and interactive state changes, with the main focus on the shared knowledge-map, details panel, and experience timeline flow. This phase adds continuity and only-real loading treatment around true pending boundaries without expanding product scope, inventing fake waits, or broadening the client surface beyond the existing interactive island and route shell.

</domain>

<decisions>
## Implementation Decisions

### Real Loading Boundaries
- **D-01:** Add loading polish only where the app has a real wait or readiness gap, with the map island and route-level shell as the primary candidates. Do not add skeletons or generic loading states to already-available server-rendered recruiter content.
- **D-02:** Prefer reserved geometry and content-shaped placeholders over spinners so surrounding layout stays stable while the delayed surface becomes ready.
- **D-03:** Treat the OGL map viewport and any genuine route-start wait as the main justified loading boundaries; other sections should remain immediately readable unless planning proves a real async dependency exists.

### Map, Panel, and Timeline Continuity
- **D-04:** Keep `KnowledgeExperienceCoordinator` as the single source of truth for active selection and pending continuity so the map, details panel, and experience timeline move as one coordinated system instead of updating independently.
- **D-05:** Preserve the currently visible structure during selection changes: the panel shell, canvas shell, and full timeline stay mounted while active content, emphasis, and helper copy transition inside those stable containers.
- **D-06:** Favor continuity choreography that reinforces the active item across all three surfaces at once, rather than hard swaps, resets, or scene remounts.

### Pending-State Presentation
- **D-07:** During local pending or handoff moments, keep the previous state visible long enough to preserve orientation, then layer the incoming emphasis or details into the same spatial slot instead of replacing the whole surface abruptly.
- **D-08:** Use lightweight overlays, dimming, emphasis easing, or reserved placeholders before introducing heavier animation tooling or fully separate loading screens.
- **D-09:** Timeline behavior should keep the full chronology visible, with related entries moving higher and gaining emphasis from the same selection state rather than collapsing the list into filtered-only results.

### Motion Carry-Forward
- **D-10:** Carry forward the calmer shared reveal baseline from Phase 8 at roughly 2 seconds for reveal-style entrances so continuity work does not revert to faster, toy-like timing.

### Route-Level Loading Shell
- **D-11:** Add a route-level loading shell that mirrors the real page structure closely enough to preserve perceived continuity during true page-start or navigation waits.
- **D-12:** The route shell should prioritize structural continuity over decorative shimmer: keep hero, map/timeline, and lower grid regions recognizable with stable sizing and restrained motion.
- **D-13:** Route-level loading should remain a fallback for real waits, not a permanent theatrical intro for a mostly fast one-page app.

### the agent's Discretion
- Exact transition timings, whether to use React transition primitives or CSS-only sequencing, and whether an optional helper such as `motion` is warranted can be finalized during planning.
- The implementation can choose the exact placeholder shapes and continuity helpers as long as they stay truthful to real async boundaries, preserve layout stability, and do not remount the OGL scene on normal selection changes.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone and phase intent
- `.planning/PROJECT.md` - Milestone goal, current architecture, and recruiter-first UX constraints for v1.2.
- `.planning/REQUIREMENTS.md` - Phase 9 requirements `MOTN-04`, `LOAD-01`, `LOAD-02`, and `LOAD-03`, plus the explicit ban on fake loading for immediate SSR content.
- `.planning/ROADMAP.md` - Phase 9 goal, dependency ordering, and success criteria.
- `.planning/STATE.md` - Current milestone position and carry-forward decisions from Phase 8.
- `.planning/phases/08-motion-language-reveal-rhythm/08-CONTEXT.md` - Locked Phase 8 motion decisions that Phase 9 continuity work must extend rather than replace.

### Milestone research
- `.planning/research/SUMMARY.md` - Recommends keeping continuity work additive, using skeletons only at real boundaries, keeping the coordinator as the state owner, and treating optional `app/loading.tsx` as a narrow fallback.

### Existing interactive continuity code
- `app/components/knowledge-experience-coordinator.tsx` - Owns the shared selection state that already synchronizes knowledge-map and timeline behavior.
- `app/components/skills-knowledge-map.tsx` - Main map entrypoint and selection application flow across panel and viewport surfaces.
- `app/components/knowledge-map/knowledge-map-panels.tsx` - Current detail panel and canvas shell structure where stable shells and local pending treatment would land.
- `app/components/knowledge-map/runtime.ts` - OGL runtime lifecycle and highlight synchronization that should stay mounted and isolated during continuity polish.
- `app/components/experience-timeline-section.tsx` - Current helper surface and persistent full-timeline rendering behavior.
- `app/components/section-card-styles.ts` - Shared motion and surface classes that should anchor continuity styling before any new tooling is introduced.
- `app/page.tsx` - Real page structure that any route-level loading shell should mirror.
- `app/layout.tsx` - Root shell ownership for route-level continuity context.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/components/knowledge-experience-coordinator.tsx`: Already centralizes selection state and ranked timeline output, making it the natural place to add pending-state coordination.
- `app/components/knowledge-map/knowledge-map-panels.tsx`: Already has stable panel and canvas shells that can host reserved placeholders, continuity overlays, or in-place detail transitions.
- `app/components/experience-timeline-section.tsx`: Already preserves the full timeline and exposes helper copy plus highlight counts, which matches the requirement to preserve orientation.
- `app/components/section-card-styles.ts`: Already provides the shared motion family and can extend into continuity-specific surface treatment without introducing a separate styling system.

### Established Patterns
- The app remains mostly server-first, with `KnowledgeExperienceCoordinator` and `SkillsKnowledgeMap` as the main interactive client island.
- The knowledge map runtime already separates scene creation from highlight updates, which supports continuity work that avoids remounting the OGL canvas on normal selection changes.
- There is currently no `app/loading.tsx`, so route-level loading continuity is still an open phase-9 decision and implementation target.
- The timeline already keeps all experience entries visible and reorders emphasis instead of filtering the list away, which should remain the baseline interaction model.

### Integration Points
- Local continuity logic should plug into the map selection flow between `SkillsKnowledgeMap`, the panel shells, and `ExperienceTimelineSection`.
- Route-level continuity should integrate at the App Router shell through `app/loading.tsx` or an equivalent route-level loading boundary.
- Any real loading placeholder should reserve the geometry of the map/panel/timeline region and page sections to avoid abrupt layout movement.

</code_context>

<specifics>
## Specific Ideas

- Keep the currently active selection understandable while the next state becomes ready; avoid any transition that makes recruiters wonder what they just clicked.
- Preserve the panel and timeline as stable landmarks around the map so the interactive section feels choreographed, not rebuilt on every selection.
- If route-level loading is implemented, it should feel like the same portfolio page arriving, not a generic template or splash screen.

</specifics>

<deferred>
## Deferred Ideas

- Wider spacing, composition, and responsive hierarchy changes belong to Phase 10.
- Final reduced-motion validation depth and broader regression guardrails remain Phase 11 scope even though Phase 9 implementations should keep respecting existing reduced-motion handling.
- New product surfaces, filtered timeline modes, or redesigned knowledge-map interaction models remain out of scope for this phase.

</deferred>

---

*Phase: 09-interactive-continuity-real-loading-states*
*Context gathered: 2026-04-21*
