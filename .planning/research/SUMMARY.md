# Project Research Summary

**Project:** Riccardo La Malfa Portfolio
**Domain:** Recruiter-facing one-page portfolio UX/UI polish
**Researched:** 2026-04-21
**Confidence:** HIGH

## Executive Summary

This milestone is not a rebuild. It is a polish pass on a server-first recruiter portfolio where the primary success metric is faster comprehension, clearer interaction feedback, and smoother transitions around the existing interactive map/timeline area. The research is aligned: keep the current Next.js 16 + React 19 + Tailwind 4 + OGL architecture, preserve server-rendered recruiter content, and add polish through narrow enhancements rather than broader client-side rewrites.

The recommended approach is to establish shared spacing and motion tokens first, then layer restrained motion and transition continuity onto the current structure without widening client boundaries. The only optional runtime addition is `motion` if CSS/Tailwind transitions prove too hard to coordinate across map/panel/timeline and section reveals; otherwise the existing stack is enough. Skeleton screens should be used very selectively: this app is mostly fast, server-rendered, one-page content, so fake loading would hurt trust more than help perceived performance.

The main risks are self-inflicted: decorative motion that slows recruiter scanning, hidden-on-mount reveal patterns that delay already-available SSR content, fake skeletons on content that loads immediately, and map/timeline polish that accidentally recreates the OGL scene or desynchronizes shared state. Mitigation is straightforward: keep baseline content visible without JS, bind pending UI only to real async boundaries, centralize motion rules, and let the coordinator own state while the OGL runtime stays isolated.

## Key Findings

### Recommended Stack

The stack research is unusually clear for this milestone: do not churn frameworks. The current stack already supports the requested UX/UI work. Tailwind 4 is sufficient for spacing rhythm, responsive restructuring, reduced-motion variants, and lightweight skeleton styling. Next.js 16 already provides the correct server-first rendering model and optional loading boundaries. React 19 already supplies the transition primitives needed inside the existing client island.

The only addition worth considering is `motion`, and even that is optional. Add it only if coordinating section reveals, panel enter/exit, and timeline emphasis with CSS alone becomes awkward. Do not add skeleton libraries, scroll-hijacking libraries, GSAP, or root-level animation providers for this milestone.

**Core technologies:**
- **Next.js 16.2.x**: server-first App Router and SEO-safe rendering — keep recruiter-visible content server-rendered and use loading boundaries sparingly.
- **React 19.2.x**: UI composition and transition primitives — enough for pending-state coordination inside the map/timeline island.
- **Tailwind CSS 4.x**: spacing rhythm, responsive layout, reduced-motion variants, skeleton styling, container queries — primary tool for most of v1.2.
- **OGL 1.0.11**: existing knowledge-map renderer — keep isolated and polish the surrounding UX instead of replacing it.
- **`motion` 12.37.0 (optional)**: coordinated enter/exit/layout transitions — only if Tailwind/CSS cannot keep choreography consistent.

### Expected Features

The feature research frames v1.2 as a recruiter-comprehension milestone, not a visual-effects milestone. The must-haves are consistent low-distraction motion, immediate interaction feedback, reduced-motion-safe behavior, stable loading states with reserved space, stronger spacing rhythm, responsive scan-friendly reflow, and smoother map/panel/timeline transitions. These are table stakes for a premium-feeling portfolio that still optimizes for fast reading.

The differentiators are cross-component choreography in the interactive section, responsive recomposition that improves hierarchy instead of just shrinking layouts, and selective content-shaped skeletons where real waiting exists. The research is equally clear on what not to build: no cinematic reveal sequences, no parallax-heavy motion, no generic spinner-first loading everywhere, no fake loading for already-fast SSR content, and no aggressive visual reordering that breaks narrative flow.

**Must have (table stakes):**
- Shared restrained motion language across reveals, hover/focus, panel swaps, and timeline/map transitions.
- Immediate feedback for taps, clicks, selections, and CTA interactions.
- Reduced-motion-safe behavior with parity for keyboard and touch users.
- Stable loading treatment only where real waiting exists, with reserved geometry.
- Spacing/padding rhythm and responsive reflow that preserve recruiter scan order.
- Orientation-preserving transitions between map, panel, and timeline states.

**Should have (competitive):**
- Cross-component choreography for knowledge map, detail panel, and timeline.
- Responsive layout recomposition that sharpens proof-first hierarchy.
- Content-shaped skeletons or progressive reveals only for real delayed client surfaces.
- Adaptive motion intensity if desktop and mobile need different levels of restraint.

**Defer (v2+):**
- Scroll-driven storytelling or cinematic reveal sequences.
- Art-direction layers that add spectacle more than information value.
- Major one-page IA redesign without validation.

### Architecture Approach

Architecture research strongly supports an additive path. Keep `app/page.tsx` as the thin server composition root, keep recruiter content sections server-rendered, add tiny client wrappers for reveal/polish only where browser APIs are needed, and keep the map/timeline as the single meaningful client island. New work should cluster into three concerns beside existing components: `motion/`, `loading/`, and `layout/`. Responsive restructuring should stay CSS-first, preserving DOM order. Shared interactive state should remain in `KnowledgeExperienceCoordinator`, while `runtime.ts` continues to own the OGL scene lifecycle.

**Major components:**
1. **Server shell + page composition (`app/layout.tsx`, `app/page.tsx`)** — load content once and preserve recruiter-first DOM order.
2. **Shared section primitives (`SectionShell`, `section-card-styles.ts`, `layout/*`, `motion/*`)** — own spacing rhythm, motion tokens, and reveal wrappers without broad clientification.
3. **KnowledgeExperienceCoordinator** — single source of truth for selection and pending state across map, panels, and timeline.
4. **Knowledge map runtime boundary (`skills-knowledge-map.tsx`, `viewport.tsx`, `runtime.ts`)** — canvas readiness, scene lifecycle, and highlight sync isolated from layout logic.
5. **Loading helpers (`loading/*`, optional `app/loading.tsx`)** — surgical placeholders for true pending boundaries only.

### Critical Pitfalls

1. **Decorative motion overwhelms comprehension** — keep motion subordinate to reading flow and reserve stronger transitions for user-triggered state changes.
2. **SSR content hidden until hydration** — baseline hero, summary, headings, and contact content must be visible before client JS enhancement.
3. **Skeletons without real async boundaries** — do not add fake loading to already-fast server-rendered content; use subtle pending overlays for local transitions instead.
4. **OGL scene recreation during polish work** — split scene initialization from updates so selection/motion changes do not remount the canvas.
5. **Responsive polish breaks narrative order or mobile ergonomics** — preserve DOM order, CTA visibility, thumb-safe actions, and clean single-column scanning.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Guardrails, tokens, and success criteria
**Rationale:** Everything else depends on a shared definition of “smooth but recruiter-first.” This phase prevents the milestone from becoming ornamental.
**Delivers:** Motion hierarchy rules, reduced-motion contract, spacing/padding token pass, baseline CTA prominence rules, and QA criteria for “faster scan, not just more animation.”
**Addresses:** Consistent motion language, spacing rhythm, immediate feedback foundations, recruiter-task validation.
**Avoids:** Decorative motion, client-boundary creep, hidden-on-mount SSR reveals.

### Phase 2: Shared motion primitives and map runtime hardening
**Rationale:** Before adding choreography, the system needs reusable motion primitives and a stable OGL lifecycle. Hardening the map early reduces regression risk later.
**Delivers:** `motion/` primitives, section-level reveal wrappers, hover/focus/press state consistency, reduced-motion-safe variants, stabilized viewport/runtime separation, and no scene recreation on normal selection updates.
**Uses:** Existing Next.js/React/Tailwind stack; optional `motion` only if CSS coordination is too brittle.
**Implements:** `motion/*`, `section-card-styles.ts`, `section-shell.tsx`, `viewport.tsx`, `runtime.ts`.
**Avoids:** Motion token drift, reduced-motion regressions, OGL remount/CPU spikes.

### Phase 3: Real loading boundaries and interactive transition continuity
**Rationale:** Once motion primitives are stable, apply them where they matter most: the knowledge map, panel, and timeline. This is also the only place skeletons are clearly justified.
**Delivers:** Map-ready skeleton handoff, persistent timeline with pending overlay, smoother panel/timeline emphasis changes, synchronized map/panel/timeline transitions, and reserved space for delayed client surfaces.
**Addresses:** Stable loading states, orientation-preserving transitions, cross-component choreography, immediate interaction feedback.
**Avoids:** Fake skeletons, CLS from placeholders, map/panel/timeline desync.

### Phase 4: Responsive restructure and hierarchy tuning
**Rationale:** Layout restructuring is visually disruptive, so it should happen after motion and interaction behavior are stable. This keeps regressions attributable.
**Delivers:** `layout/page-rhythm.ts`, `layout/responsive-section-grid.tsx`, cleaner mobile/narrow/zoomed reflow, improved section grouping, stronger proof-first hierarchy, and preserved DOM order.
**Addresses:** Responsive single-column-first scanning, clear section chunking, mobile-safe ergonomics, evidence-first hierarchy tuning.
**Avoids:** Aggressive visual reordering, mobile interaction regressions, narrative-order drift.

### Phase 5: Verification, restraint pass, and optional extras
**Rationale:** Polish work often “looks done” before it is actually safer, clearer, or faster. End with verification, not ornament.
**Delivers:** Recruiter-task walkthroughs, reduced-motion and keyboard QA, mobile device checks, CLS/perceived-stability review, bundle/client-boundary audit, and decision on whether optional `app/loading.tsx` or adaptive motion tuning are actually warranted.
**Addresses:** Accessibility parity, performance integrity, task-based validation, optional route-shell fallback.
**Avoids:** Approving smoother visuals that degrade comprehension or responsiveness.

### Phase Ordering Rationale

- Shared tokens and guardrails come first because motion, spacing, and loading rules must be consistent before component-level polish starts.
- Map runtime hardening precedes choreography so UI smoothness does not sit on top of a fragile scene lifecycle.
- Skeleton work is intentionally delayed until real pending boundaries are identified; this is critical in a mostly server-rendered one-page app.
- Responsive restructuring comes after interaction continuity because it is the most visually disruptive change and should build on already-stable primitives.
- Verification is its own final phase because this milestone can easily ship “prettier but worse” without task-based checks.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3:** If current `viewport.tsx` update semantics are still coupled to selection changes, do a targeted `/gsd-research-phase` pass on OGL lifecycle hardening before implementing choreography.
- **Phase 4:** Only trigger deeper research if proposed hierarchy changes materially alter section grouping or CTA placement beyond the documented recruiter-first order.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Well-documented Tailwind tokenization, reduced-motion contracts, and success-criteria definition.
- **Phase 2:** Standard narrow-client-wrapper and CSS-first motion patterns are already well covered by the current research.
- **Phase 5:** Verification criteria are clear from existing pitfalls and testing guidance.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Based mostly on official Next.js, React, Tailwind, and Motion docs plus current repo versions; recommendation is conservative and low-risk. |
| Features | MEDIUM | Strong UX heuristics and accessibility guidance, but some hierarchy and polish choices still need human review against recruiter goals. |
| Architecture | HIGH | Grounded in current repo structure and explicit App Router/server-client boundary guidance. |
| Pitfalls | HIGH | Risks are concrete, repo-specific, and backed by official guidance plus existing hotspot analysis. |

**Overall confidence:** HIGH

### Gaps to Address

- **Whether CSS-only motion is sufficient:** Decide during Phase 2 after implementing tokens and a few real transitions; add `motion` only if coordination remains awkward.
- **Where skeletons are genuinely justified:** Validate with the actual map boot path and any real async/pending surfaces; default assumption should be “few to none” outside the map island.
- **How far to push responsive restructuring in v1.2:** Keep changes incremental unless reviewer feedback shows current hierarchy still slows recruiter comprehension.
- **Exact recruiter-task acceptance criteria:** Convert “smoother” into concrete review checks for scan speed, contact discoverability, reduced-motion parity, and mobile ease before implementation closes.

## Sources

### Primary (HIGH confidence)
- Next.js Server and Client Components docs — server/client boundaries, interleaving, and narrow client islands.
- Next.js `loading.js` docs — route-level loading behavior and when `loading.tsx` is appropriate.
- React Suspense docs — real loading-boundary behavior and pending-state tradeoffs.
- Tailwind docs — animation utilities, reduced-motion variants, responsive design, and container queries.
- MDN `prefers-reduced-motion` — accessibility expectations for non-essential motion.
- W3C WCAG Understanding docs for Reflow and Animation from Interactions — responsive and motion-accessibility guardrails.
- Repo source (`package.json`, `app/page.tsx`, `app/layout.tsx`, section components, map runtime files) — current stack and architecture baseline.

### Secondary (MEDIUM confidence)
- Motion docs — optional React motion orchestration and bundle-size guidance if CSS-only transitions are insufficient.
- NN/g guidance on response times, progress indicators, and scanning behavior — useful for recruiter-task framing and loading restraint.
- web.dev CLS guidance — stability principles for skeletons and interactive transitions.
- OGL README — confirms library role and supports keeping the renderer isolated rather than replacing it.

### Tertiary (LOW confidence)
- None identified for milestone-defining decisions.

---
*Research completed: 2026-04-21*
*Ready for roadmap: yes*
