# Pitfalls Research

**Domain:** Atomization refactor of an existing Next.js 16 + React 19 + OGL recruiter portfolio
**Researched:** 2026-04-13
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Client-boundary creep turns a server-first page into a client-heavy tree

**What goes wrong:**
While extracting atoms, developers move reusable UI into a file marked with `"use client"`, or import client-only code too high in the tree. That silently pulls more of `app/page.tsx` and its children into the client bundle, weakening the current server-first composition model.

**Why it happens:**
In Next.js App Router, `"use client"` defines a module boundary, and everything imported below that boundary becomes client code. Refactors often optimize for reuse first and boundary discipline second.

**How to avoid:**
- Keep `app/page.tsx` as a thin server composition root.
- Extract static atoms as server components by default.
- Keep the client island narrow: coordinator + map-only behavior, not generic section shells.
- Add explicit server/client ownership notes for every extracted component.
- Mark server-only loaders with `server-only` if they risk being imported from client code later.

**Warning signs:**
- New `"use client"` directives appear in shared layout, section, or content components.
- `getPortfolioContent()` or other server-only utilities get imported into client files.
- Static sections start requiring serialized props that used to stay server-side.
- Bundle size or hydration cost jumps after a “pure refactor.”

**Phase to address:**
Phase 1 — Baseline and boundaries, then enforce again in Phase 2 during static-surface atomization.

---

### Pitfall 2: Over-abstraction replaces one monolith with many meaningless wrappers

**What goes wrong:**
The refactor creates many tiny atoms, wrappers, hooks, or classes that add naming overhead but do not clarify ownership. The result is harder navigation, duplicated prop plumbing, and slower future edits despite “better structure.”

**Why it happens:**
Atomization efforts often optimize for decomposition count instead of stable responsibilities. This codebase already shows pressure points like duplicated `SectionHeading` logic; the risk is extracting everything mechanically instead of around clear boundaries.

**How to avoid:**
- Extract only components with stable responsibility: section shell, heading, metadata row, CTA group, card, map renderer adapter.
- Prefer composition over introducing abstract base components or class hierarchies.
- Use OOP only for the imperative OGL lifecycle if it reduces effect complexity.
- Require each extracted module to answer: “What invariant does this own?”
- Merge wrappers that only forward classes/children without adding behavior.

**Warning signs:**
- Components exist only to pass `className`, `children`, and one label through.
- The same data gets threaded through 4–5 layers with no transformation.
- A future editor cannot tell where styles, semantics, or interaction ownership live.
- New classes or hooks are added mainly to satisfy an architectural ideal.

**Phase to address:**
Phase 1 — Define extraction criteria before moving files; Phase 2 — enforce during page atomization.

---

### Pitfall 3: Styling drift from splitting inline markup into reusable atoms

**What goes wrong:**
The visible UI changes slightly even though the milestone forbids it: spacing shifts, border radius changes, heading rhythm changes, CTA sizing drifts, dark-mode tokens diverge, or section shells stop matching exactly.

**Why it happens:**
This page currently relies on inline Tailwind class composition plus shared style tokens. When markup is split apart, small class omissions or reordered wrappers can change layout and visual hierarchy.

**How to avoid:**
- Extract current class recipes before changing structure.
- Make section shell, inner card, section heading, chips, and CTA variants explicit shared primitives.
- Preserve semantic tags and wrapper depth unless there is a documented reason to change them.
- Use screenshot comparison and viewport parity checks on desktop + mobile before/after each extraction batch.
- Refactor one section family at a time instead of rewriting the whole page tree at once.

**Warning signs:**
- Repeated one-off class tweaks appear after extraction.
- The same atom needs per-call “temporary” spacing overrides everywhere.
- Recruiter scan rhythm changes: hero height, section spacing, CTA prominence, or card density feel off.
- Dark mode or hover/focus styles no longer match across identical surfaces.

**Phase to address:**
Phase 2 — Static surface atomization; verify again in Phase 4 parity hardening.

---

### Pitfall 4: Shared selection semantics drift between the map and the timeline

**What goes wrong:**
The knowledge-map still renders, and the experience list still renders, but they stop agreeing on what a selection means. Typical failures: wrong `activeIndex`, broken `core` reset semantics, category selection reorders the wrong roles, or sidebar state no longer matches timeline ranking.

**Why it happens:**
The selection contract is currently duplicated conceptually across coordinator, map behavior, and ranking logic. Refactors that split files without first centralizing this contract often introduce subtle divergence.

**How to avoid:**
- Define one canonical `KnowledgeMapSelection` type and keep it shared.
- Treat `core` overview behavior as an invariant with tests.
- Extract pure selection-normalization helpers before moving UI.
- Keep ranking logic pure and independent from presentation.
- Add regression tests for skill, category, unmatched, and reset-to-overview flows.

**Warning signs:**
- The same selection shape/type is declared in multiple modules.
- “Reset to overview” works visually but not in timeline ordering.
- Category buttons highlight one field while the sidebar or timeline behaves like another.
- Refactor PRs contain “temporary mapping” code between similar selection models.

**Phase to address:**
Phase 2 — lock the shared contract before deeper map splitting; Phase 3 — preserve it during renderer decomposition.

---

### Pitfall 5: OGL lifecycle churn causes leaks, duplicate canvases, or animation resets

**What goes wrong:**
After splitting `SkillsKnowledgeMap`, the scene is recreated too often or cleaned up incompletely. That leads to duplicate canvases, stacked event listeners, stale `ResizeObserver`s, multiple animation loops, memory leaks, or a graph that visibly resets on normal state changes.

**Why it happens:**
The current component mixes scene creation, render loop, resize handling, interaction, and highlight syncing in one effect-heavy file. Breaking it apart without a strict init/update/dispose model is the highest-risk technical regression in this milestone.

**How to avoid:**
- Separate responsibilities explicitly:
  - pure graph data builder
  - scene/renderer setup + disposal
  - interaction/picking controller
  - React UI shell
- Make scene creation happen once per graph dataset, not once per incidental UI state change.
- Keep imperative OGL objects behind refs or a dedicated controller object.
- Ensure every setup path has mirrored cleanup for RAF, pointer listeners, and `ResizeObserver`.
- Test in React Strict Mode to catch missing cleanup.

**Warning signs:**
- The canvas flashes or remounts when selection changes.
- CPU usage climbs after navigating or hot reloading.
- Pointer interactions degrade after repeated renders or viewport changes.
- Multiple canvases exist in the DOM, or the graph loses its previous rotation unexpectedly.

**Phase to address:**
Phase 3 — Knowledge-map decomposition. This is the earliest high-risk milestone-specific refactor hotspot.

---

### Pitfall 6: Pointer, resize, and picking regressions break the existing map interaction model

**What goes wrong:**
Users can still see the map, but selection feels wrong: taps miss nodes, dragging triggers accidental selection, hit areas drift after resize, or neighbor highlighting no longer matches the chosen point.

**Why it happens:**
Picking currently depends on projected node coordinates, drag thresholds, viewport bounds, and z-order heuristics. These are easy to break when extracting math and event handling into separate modules.

**How to avoid:**
- Preserve the current interaction contract before refactoring: tap selects, drag rotates, reset returns to overview.
- Extract projection/picking logic into pure helpers with targeted tests.
- Add manual QA scenarios for mobile tap, desktop drag, resize, reduced-motion mode, and repeated selection changes.
- Keep drag threshold and hit-radius behavior stable unless intentionally changed.

**Warning signs:**
- Mobile taps need multiple tries.
- A click after dragging selects an unexpected node.
- Resize makes nodes visually drift away from their clickable area.
- Sidebar metadata updates for a different node than the one the user intended.

**Phase to address:**
Phase 3 — alongside renderer decomposition; validate again in Phase 4.

---

### Pitfall 7: Effect dependency churn recreates graph state on every render

**What goes wrong:**
The map becomes subtly unstable because split hooks/effects depend on objects or callbacks recreated during render. Scene setup or expensive graph construction reruns more often than intended, causing jitter, lost rotation state, or unnecessary work.

**Why it happens:**
React effects rerun when dependencies change, and refactors often introduce new inline objects/functions. With an imperative renderer, unnecessary reruns are much more expensive than in plain DOM UI.

**How to avoid:**
- Keep expensive graph construction in pure memoized functions.
- Separate “initialize scene” effects from “update highlight” effects.
- Avoid dependency suppression; instead stabilize inputs or move non-reactive logic outside render.
- Store long-lived imperative instances in refs, not state.
- Treat selection updates as data updates, not renderer recreation triggers.

**Warning signs:**
- Small prop changes cause scene teardown/rebuild.
- Rotation snaps back after unrelated UI updates.
- Linters are silenced around `useEffect` dependencies.
- Debug logging shows repeated setup/cleanup during normal use.

**Phase to address:**
Phase 3 — during hook/controller extraction.

---

### Pitfall 8: Test coverage stays logic-only and misses composition regressions

**What goes wrong:**
Existing tests keep passing while the actual shipped page regresses: section order changes, duplicate heading semantics appear, CTA wiring changes, map/timeline wiring breaks, or visual parity slips.

**Why it happens:**
Current coverage focuses on contact validation, ranking logic, and a small amount of page wiring. That is not enough for an architecture refactor whose main risk is boundary and composition regression rather than new business logic.

**How to avoid:**
- Add baseline regression tests before major extraction.
- Cover section presence/order, coordinator wiring, overview fallback behavior, and key CTA/label semantics.
- Add screenshot or DOM-structure parity checks for the static page shell.
- Create a short manual QA checklist for the knowledge map because not all OGL behavior is easy to assert in unit tests.

**Warning signs:**
- A large refactor lands with only renamed-file test updates.
- No test fails when wrapper depth, section order, or heading semantics change.
- Review feedback relies on “looks the same locally” only.
- Bugs are found only after deployment or browser QA.

**Phase to address:**
Phase 1 — establish baseline tests first; Phase 4 — expand final regression verification.

---

### Pitfall 9: Accessibility and semantics regress during “pure” UI extraction

**What goes wrong:**
The page looks unchanged but becomes worse to use: focus outlines disappear, buttons become generic divs, links lose labels, section headings become inconsistent, or screen-reader cues drift.

**Why it happens:**
Atomic extraction often prioritizes visual reuse and class reuse over semantic reuse. This page already has meaningful links, buttons, and headings that are easy to accidentally flatten while creating generic primitives.

**How to avoid:**
- Preserve semantic element choice (`section`, `article`, `button`, `a`, headings) in extracted atoms.
- Keep existing `aria-label`, `title`, and focus-visible behavior as part of the component contract.
- Include keyboard and screen-reader smoke checks in the refactor QA pass.
- Prefer semantic primitives over one generic “Box” component.

**Warning signs:**
- Extracted atoms default to `div` wrappers.
- Focus styling becomes inconsistent after consolidation.
- Heading levels or landmark structure change without intent.
- Icon-only actions lose accessible names.

**Phase to address:**
Phase 2 — when extracting reusable atoms; Phase 4 — verify final parity.

---

### Pitfall 10: Layout-level integrations drift while moving shared UI pieces around

**What goes wrong:**
The visible product seems unchanged, but legal/footer/script behavior regresses: footer placement changes, consent widget fails, analytics scripts duplicate or disappear, or global shell classes move accidentally.

**Why it happens:**
Refactors often focus on page content and forget that `app/layout.tsx` owns non-visual but still user-impacting wiring. Shared component extraction can unintentionally move or duplicate that wiring.

**How to avoid:**
- Treat `app/layout.tsx` as a protected shell boundary unless there is a specific reason to change it.
- Verify footer presence, consent bootstrap, and script placement after any shared-layout extraction.
- Keep layout concerns separate from page atomization concerns.
- Add one regression checklist item for third-party/legal wiring, even though it is not the main refactor target.

**Warning signs:**
- Refactor PRs move footer or script code “for consistency.”
- Consent/legal behavior breaks without any page-level UI change.
- Duplicate script providers appear after component consolidation.
- Root body/html classes change as a side effect of unrelated extraction.

**Phase to address:**
Phase 4 — final hardening, with light guardrails already noted in Phase 1.

## Technical Debt Patterns

Shortcuts that feel efficient during refactor but create lasting fragility.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Marking a shared atom `"use client"` to make imports easier | Faster extraction | Boundary creep, larger bundles, lost server-first page model | Never for purely presentational atoms |
| Copy-pasting Tailwind classes into new atoms instead of centralizing the stable recipe | Low friction | Styling drift and inconsistent parity fixes | Only as a short-lived intermediate step within the same PR |
| Splitting the map into many hooks before defining its invariant contract | Feels modular | Hard-to-debug lifecycle bugs and duplicated state semantics | Never |
| Adding class-heavy OOP across generic UI atoms | Superficial “architecture” | More indirection with no user benefit | Rarely; mainly justified for imperative OGL controller code |
| Delaying regression tests until after the refactor | More coding time now | Slower reviews and brittle parity checking | Never for this milestone |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Next.js server/client boundary | Pulling shared sections into client land via one interactive import | Keep static atoms server-side and isolate client behavior to coordinator/map modules |
| OGL scene management | Letting React rerenders own scene lifecycle directly | Put scene lifecycle behind a stable ref/controller with explicit init/update/dispose |
| CV content loading | Moving `cv.json` reads into client effects for convenience | Keep content loading on the server and pass only needed props into client islands |
| Legal/analytics wiring | Duplicating or moving layout scripts during shared component extraction | Leave layout integrations at the root and verify them separately from page atomization |

## Performance Traps

Relevant for a portfolio-scale app: these break perceived quality before they break scale.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Recreating the OGL renderer on selection changes | Canvas flash, lost rotation, CPU spikes | Separate initialization from highlight updates | Immediately visible during normal interaction |
| Over-clientizing static sections | Slower hydration, more JS for a mostly static page | Keep static UI as server components | Immediately on first load |
| Recomputing graph data from unstable inputs | Stutter during interaction or resize | Pure graph builder + stable memoization | Visible as soon as rerenders become frequent |
| Too many wrapper components in the hot path | Harder memoization and noisier renders | Extract by responsibility, not by smallest size | Usually noticeable during maintenance before runtime |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Slight CTA/layout drift during atomization | Recruiter scan speed drops even if content is unchanged | Preserve existing visual hierarchy with parity checks |
| Map interaction changes under the label of “cleanup” | Existing recruiter exploration flow breaks | Preserve current drag/select/reset behavior exactly |
| Losing full-timeline visibility on filtered states | Experience narrative becomes narrower and less trustworthy | Keep current “reorder, don’t hide” model as a hard invariant |

## "Looks Done But Isn't" Checklist

- [ ] **Server/client boundaries:** `app/page.tsx` is still server-first and no static section was clientized accidentally.
- [ ] **Knowledge map parity:** drag, tap/click select, reset to overview, resize behavior, and reduced-motion behavior still work.
- [ ] **Timeline behavior:** selecting a skill/category still reorders entries without hiding the full timeline.
- [ ] **Styling parity:** hero, section spacing, card radii, CTA sizing, and dark-mode surfaces match before/after screenshots.
- [ ] **Accessibility:** focus states, link labels, heading order, and icon-only actions still expose the same semantics.
- [ ] **Layout wiring:** legal footer, consent widget, and analytics bootstrap still render once in the expected place.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Client-boundary creep | MEDIUM | Move `"use client"` downward, restore server-only imports, re-split static atoms from interactive shells |
| Styling drift | MEDIUM | Recompare against baseline screenshots/DOM, restore shared tokens, remove accidental wrapper changes |
| Map lifecycle leaks | HIGH | Roll back to a stable single mount path, add explicit controller cleanup, then re-split behind tested boundaries |
| Selection contract drift | MEDIUM | Centralize the shared selection model, restore invariant tests for `core`, category, skill, and unmatched states |
| Test gap regressions | LOW/MEDIUM | Add baseline tests immediately, then fix surfaced parity issues before continuing atomization |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Client-boundary creep | Phase 1: Baseline and boundaries | Server/client ownership documented; no unnecessary new client directives in static surfaces |
| Over-abstraction | Phase 1: Extraction rules | Each extracted module has a clear invariant and non-trivial responsibility |
| Styling drift | Phase 2: Static surface atomization | Before/after screenshots and DOM checks match within agreed tolerance |
| Selection contract drift | Phase 2: Shared state contract | Tests pass for core/category/skill/unmatched selection behavior |
| OGL lifecycle churn | Phase 3: Knowledge-map decomposition | Single canvas, stable cleanup, no duplicate listeners/RAF, no remount on simple selection |
| Pointer and picking regressions | Phase 3: Knowledge-map decomposition | Manual QA passes for drag/select/reset/resize/mobile interaction |
| Effect dependency churn | Phase 3: Hook/controller extraction | No unnecessary setup/cleanup cycles during normal map use |
| Test coverage gap | Phase 1 and Phase 4 | Baseline tests exist early; final regression suite covers page composition and interaction invariants |
| Accessibility regressions | Phase 2 and Phase 4 | Keyboard/focus/labels/headings checked before signoff |
| Layout integration drift | Phase 4: Final hardening | Footer, consent, and analytics remain present once and in the correct shell |

## Sources

- Current project baseline: `/workspaces/94lama/.planning/PROJECT.md` and `/workspaces/94lama/.planning/ARCHITECTURE.md` — HIGH confidence
- Current implementation evidence: `app/page.tsx`, `app/components/knowledge-experience-coordinator.tsx`, `app/components/skills-knowledge-map.tsx`, `app/layout.tsx`, `src/content/portfolio/get-portfolio-content.ts`, `src/content/portfolio/rank-experience-by-selection.ts` — HIGH confidence
- Current test coverage baseline: `tests/phase-04-knowledge-experience.test.ts` — HIGH confidence
- Next.js 16 docs, Server and Client Components (updated 2026-04-08): https://nextjs.org/docs/app/getting-started/server-and-client-components — HIGH confidence
- React docs, `useEffect`: https://react.dev/reference/react/useEffect — HIGH confidence

---
*Pitfalls research for: v1.1 implement atomization of components*
*Researched: 2026-04-13*
