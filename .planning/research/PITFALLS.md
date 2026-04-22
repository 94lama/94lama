# Pitfalls Research

**Domain:** UX/UI polish on an existing recruiter-focused Next.js 16 + React 19 + Tailwind 4 + OGL portfolio
**Researched:** 2026-04-21
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Decorative motion overwhelms recruiter comprehension

**What goes wrong:**
Animations make the page feel “active” but reduce scan speed. Headings, CTAs, cards, and the map all compete for attention, so the recruiter notices motion before they notice positioning, summary, experience, and contact actions.

**Why it happens:**
Polish work often optimizes for delight in isolation instead of the portfolio’s core job: let a recruiter understand Riccardo and reach contact paths in under a minute.

**How to avoid:**
- Define motion hierarchy before implementation: hero/section reveal is secondary, CTA and reading flow are primary.
- Reserve stronger motion for user-triggered actions only: map selection, panel updates, timeline emphasis.
- Keep ambient motion subtle or remove it entirely outside the OGL map.
- Require every new animation to answer: “What decision becomes easier because of this?”

**Warning signs:**
- Review feedback says “cool” more often than “clear”.
- Recruiter-critical content appears later or competes with moving chrome.
- Sections feel slower to scan even when performance metrics are fine.
- Primary CTA is visually quieter than decorative motion.

**Phase to address:**
Phase 1 — UX guardrails and motion principles.

---

### Pitfall 2: Motion ignores reduced-motion, keyboard, and focus behavior

**What goes wrong:**
Transitions look fine for mouse users on a fast machine, but keyboard users lose focus context, reduced-motion users still get panning/scaling effects, and interactive elements only communicate state on hover.

**Why it happens:**
Teams often add hover transforms and JS-driven animation first, then treat accessibility as cleanup. MDN explicitly recommends reducing or replacing non-essential motion for users who request reduced motion.

**How to avoid:**
- Make reduced-motion support part of the motion API, not an override added later.
- Prefer opacity/color changes over scale/pan/parallax in reduced-motion mode.
- Ensure every hover affordance has keyboard-visible/focus-visible and pressed-state equivalents.
- Test map, CTAs, chips, and timeline controls with keyboard only and with reduced motion enabled.

**Warning signs:**
- Motion checks rely only on `motion-safe:` hover utilities.
- Focus rings disappear during transitions or after layout changes.
- Reduced-motion mode still rotates, drifts, or scales large surfaces.
- Important states are only discoverable by pointer hover.

**Phase to address:**
Phase 2 — shared motion primitives and accessibility contracts.

---

### Pitfall 3: JS reveal patterns hide already-server-rendered content until hydration

**What goes wrong:**
Server-rendered sections initially mount hidden (`opacity: 0`, translated off-screen, collapsed) and only appear after client JavaScript runs. The page feels blank, late, or unstable even though the content was already delivered by the server.

**Why it happens:**
Developers import “scroll reveal” patterns from client-heavy sites into a server-first page. That fights the existing architecture, where `app/page.tsx` already delivers recruiter-visible content on the first response.

**How to avoid:**
- Keep initial content visible by default; only animate enhancement layers, not baseline readability.
- Use CSS that renders a valid resting state without JS.
- Treat “no JS / slow JS / delayed hydration” as a first-class QA mode.
- Do not gate hero, summary, contact, or section headings behind client reveal state.

**Warning signs:**
- Initial HTML contains the content but it is visually hidden until hydration.
- Lighthouse/real-device tests show blank or low-information first paint.
- Scroll reveal code gets added high in the tree and spreads `use client` boundaries.
- Recruiter-critical copy appears after a visible delay with no real data dependency.

**Phase to address:**
Phase 1 — rendering guardrails; verify again in Phase 5.

---

### Pitfall 4: Skeleton screens are added where no real loading boundary exists

**What goes wrong:**
Skeletons flash for content that is already available from server render, or they never appear at the right time because the loading work happens inside effects or local state transitions. The result is fake loading, flicker, and reduced trust.

**Why it happens:**
React Suspense only works for Suspense-enabled loading sources; it does not activate for data fetched inside effects. Next.js `loading.tsx` is route-segment based, while this portfolio is a single page already loading content on the server from `getPortfolioContent()`.

**How to avoid:**
- Only add skeletons where there is a genuine async boundary or a delayed client-only surface.
- Prefer inline stale-state treatment or subtle pending indicators for panel/timeline transitions.
- If a skeleton is used, match final dimensions closely and keep copy hierarchy recognizable.
- Avoid skeletons for hero and static recruiter content already present in the initial HTML.

**Warning signs:**
- Skeletons appear after content was already visible.
- Skeleton components are driven by arbitrary timers rather than real pending state.
- The page shows placeholder UI for `cv.json` content already delivered server-side.
- Reviewers describe the loading state as “busy” or “fake”.

**Phase to address:**
Phase 3 — loading-state design and real async boundary selection.

---

### Pitfall 5: Skeletons and transitions introduce layout shift instead of perceived speed

**What goes wrong:**
Placeholders, expanding panels, animated height changes, and responsive rearrangements push visible content around. Recruiters lose reading position or tap the wrong control. The page feels fragile even if it looks refined in static screenshots.

**Why it happens:**
web.dev’s CLS guidance is clear: unexpected movement hurts usability, and animating layout properties or inserting unsized content is a common cause.

**How to avoid:**
- Match placeholder height, spacing, and aspect ratio to final content.
- Prefer `transform` and `opacity` transitions over animating `top/left/width/height`.
- Reserve stable space for map, panel, and timeline surfaces before async or interactive changes.
- Measure CLS in lab and spot-check visually on mobile.

**Warning signs:**
- Section headings jump after load.
- The map or side panel changes height and pushes the timeline unexpectedly.
- Transitions depend on `height: auto` hacks or top/left animation.
- Mobile scroll position shifts during panel open/close or image load.

**Phase to address:**
Phase 3 — loading-state implementation; harden again in Phase 5.

---

### Pitfall 6: OGL map transitions are wired to React rerenders and recreate the scene

**What goes wrong:**
Map selection, reduced-motion toggles, or new transition state remount the canvas runtime, causing flashes, lost rotation state, listener churn, or CPU spikes.

**Why it happens:**
The current `KnowledgeMapViewport` initialization effect depends on `graphData`, `onPickNode`, `prefersReducedMotion`, and `selectedNodeId`. That means added polish work can easily turn highlight changes into full scene teardown/rebuild cycles.

**How to avoid:**
- Separate scene creation from scene updates: initialize once, then sync highlight and motion state incrementally.
- Stabilize callbacks passed into the viewport.
- Keep OGL objects behind refs/controller state instead of rerender-driven setup.
- Add explicit checks for duplicate canvases, RAF loops, and pointer listeners.

**Warning signs:**
- Canvas flashes on simple selection changes.
- Rotation resets after panel/timeline interaction.
- CPU or GPU usage climbs after repeated interactions.
- Debugging shows repeated setup/cleanup around normal state changes.

**Phase to address:**
Phase 2 — map/runtime hardening before broader motion polish.

---

### Pitfall 7: Motion tokens drift into per-component one-offs

**What goes wrong:**
Every section gets its own easing, duration, delay, hover lift, and reveal distance. The page feels inconsistent, and later tuning becomes expensive because “small” changes require editing many unrelated components.

**Why it happens:**
Existing styling is already centralized in `section-card-styles.ts` for visual tokens, but motion can still fragment if added ad hoc inside each component.

**How to avoid:**
- Define a small motion scale: e.g. instant, subtle, emphasis, map-only.
- Centralize durations/easings/distance tokens alongside existing section style tokens.
- Make “no motion” and “reduced motion” valid first-class variants.
- Forbid inline magic numbers unless there is a documented exception.

**Warning signs:**
- Multiple components use slightly different `duration-*` and transform amounts for the same intent.
- Designers or reviewers cannot describe the motion system consistently.
- Tweaking rhythm requires a repo-wide hunt.
- Hover, reveal, and pending states feel unrelated.

**Phase to address:**
Phase 2 — motion system foundation.

---

### Pitfall 8: Responsive restructuring preserves breakpoints but breaks narrative order

**What goes wrong:**
Desktop and mobile layouts technically “fit”, but the recruiter-first story degrades: contact moves too low, supporting content interrupts the main scan path, or the map dominates small screens and hides proof of experience.

**Why it happens:**
Responsive work often focuses on columns, spacing, and overflow instead of information priority. This milestone explicitly allows layout restructuring, so narrative regressions are a real risk.

**How to avoid:**
- Define required reading order per viewport before restructuring.
- Protect primary flow: hero → proof of role/value → skills/experience → contact.
- On mobile, optimize for short vertical scan and thumb-safe contact actions.
- Validate with real-content screenshots, not empty-wireframe spacing.

**Warning signs:**
- Desktop looks better but mobile requires excessive scrolling before contact or experience.
- Side-by-side sections collapse into an awkward alternating rhythm.
- The map becomes the dominant first-screen element on small viewports.
- Reviewers say the page feels “designed” but harder to understand quickly.

**Phase to address:**
Phase 4 — responsive restructure and narrative validation.

---

### Pitfall 9: Responsive polish breaks interaction ergonomics on touch devices

**What goes wrong:**
Tap targets get too small, sticky/fixed effects cover content, the map steals gestures, horizontal overflow appears, or buttons become hard to reach near the thumb zone.

**Why it happens:**
The portfolio includes an interactive map plus dense content sections. Motion and spacing changes that feel elegant on desktop often reduce usability on mobile.

**How to avoid:**
- Test touch behavior on real mobile widths, not only responsive devtools.
- Verify map drag vs tap thresholds after layout changes.
- Maintain comfortable tap target sizes and spacing between actions.
- Audit for horizontal overflow and sticky overlap at every breakpoint.

**Warning signs:**
- Mobile taps on map nodes require multiple tries.
- Contact buttons or chips are visually polished but cramped.
- Panels overlap the canvas or push content off-screen.
- Scrolling near the map triggers accidental interactions.

**Phase to address:**
Phase 4 — mobile interaction hardening.

---

### Pitfall 10: Polished transitions break state synchronization between map, panel, and timeline

**What goes wrong:**
The animation looks smooth, but content briefly disagrees: the panel highlights one skill while the timeline still reflects another, reset-to-overview lags, or exit/enter transitions reveal stale helper copy.

**Why it happens:**
Animation often adds intermediate visual states, but the underlying selection model still needs a single source of truth. This app already coordinates shared state through `KnowledgeExperienceCoordinator`, so transition wrappers can accidentally desynchronize derived UI.

**How to avoid:**
- Keep one canonical selection state and derive all visual states from it.
- Animate presentation around stable data, not with temporary duplicated selection state.
- Treat reset/core/category/skill transitions as explicit regression cases.
- If stale content is intentionally shown during transition, label and dim it rather than pretending it is current.

**Warning signs:**
- Helper copy updates before the highlighted card list, or vice versa.
- Reset to overview appears animated but leaves old emphasis visible.
- Animation code introduces duplicate “current” and “next” selection objects.
- Bug reports mention “momentarily wrong” content instead of outright failure.

**Phase to address:**
Phase 3 — transition integration on shared interactive state.

---

### Pitfall 11: Bundle growth and client-boundary creep erase the gains of polish

**What goes wrong:**
Adding animation helpers, observers, and client-only wrappers increases JS cost, hydration work, and complexity across a page whose value depends on fast initial comprehension.

**Why it happens:**
It is tempting to solve every transition with a new client library or move shared sections into client components for convenience. But this app is intentionally server-first with a narrow client island.

**How to avoid:**
- Default to CSS/Tailwind transitions and existing React primitives first.
- Keep static sections server-rendered.
- Evaluate any animation library against actual missing capability, not perceived convenience.
- Track bundle size and hydration-sensitive surfaces during implementation.

**Warning signs:**
- New `use client` directives appear in static section components.
- A motion library is introduced for patterns CSS already handles.
- JS increases while actual UX clarity barely improves.
- First interaction feels slower after a “polish” milestone.

**Phase to address:**
Phase 1 — architectural constraints; enforce again in Phase 5.

---

### Pitfall 12: Visual polish is approved without recruiter-task verification

**What goes wrong:**
The milestone ships because the page looks smoother, but real recruiter tasks are not measurably easier: finding positioning, scanning experience, and reaching contact still take the same time or get worse.

**Why it happens:**
Polish work is easy to judge aesthetically and easy to under-test functionally. Existing tests already protect structural behavior; this milestone needs UX-specific verification, not just snapshot approval.

**How to avoid:**
- Define milestone success in recruiter tasks, not only visuals.
- Add checks for time-to-first-meaningful-scan, contact discoverability, reduced-motion parity, and mobile ease.
- Use before/after manual QA scripts with real tasks.
- Keep “less distracting” as a valid success outcome, even if that means fewer animations.

**Warning signs:**
- Acceptance criteria say “feels smoother” but not “improves scan and contact clarity”.
- Reviews focus on motion aesthetics without task-based walkthroughs.
- No mobile, reduced-motion, or low-power verification occurs.
- A lot changed visually, but no one can explain the recruiter benefit.

**Phase to address:**
Phase 5 — verification, regression, and recruiter-task signoff.

## Technical Debt Patterns

Shortcuts that seem efficient during polish work but make the portfolio fragile.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Add hidden-on-mount reveal wrappers around server-rendered sections | Fast “wow” factor | Blank first paint, hydration-dependent readability, weaker server-first UX | Never for recruiter-critical content |
| Use timer-driven skeletons instead of real pending state | Easy demo | Fake loading, flicker, mistrust, harder testing | Never |
| Animate layout properties (`height`, `top`, `left`) for convenience | Easy accordion/transition implementation | Jank, CLS, inconsistent mobile behavior | Rarely; only for tiny isolated regions with stable reserved space |
| Introduce a heavy animation library for simple fades/lifts | Faster authoring at first | Bundle growth, more client code, harder reduced-motion parity | Only if a clearly missing capability justifies it |
| Store duplicate “visual transition” state separate from canonical selection state | Easy enter/exit choreography | Desync between map, panel, and timeline | Never without strict derived-state rules |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Next.js server-first page | Converting static sections to client components just to animate them | Keep initial content server-rendered and layer CSS or narrowly scoped client enhancement on top |
| React Suspense / loading UI | Assuming Suspense catches effect-based loading or arbitrary local transitions | Use real Suspense-enabled boundaries only; otherwise use explicit pending UI |
| OGL map runtime | Coupling motion state to scene initialization effect dependencies | Initialize scene once, then push highlight/motion updates incrementally |
| Shared selection coordinator | Adding animated intermediate states outside the canonical selection model | Derive all panel/timeline/map states from one selection contract |
| Root layout integrations | Moving scripts/footer/layout shell during visual restructure | Treat `app/layout.tsx` as protected shell wiring and verify separately |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Hydration-dependent reveals | Blank or low-information first paint | Keep baseline content visible without JS | Immediately on slow devices or blocked JS |
| Scene recreation during map interaction | Canvas flash, listener churn, CPU spikes | Split init from update and stabilize dependencies | Immediately during normal interaction |
| Skeleton dimension mismatch | Content jumps when real UI arrives | Match final geometry and reserve space | Immediately on load or state changes |
| Per-component motion one-offs | Inconsistent feel and repeated repaints | Use shared motion tokens and limited variants | Becomes obvious by mid-implementation |
| Over-clientizing static sections | More JS, slower hydration, harder QA | Preserve narrow client islands | Immediately on first load |

## Security / Privacy Mistakes

This milestone has no new major domain-specific security surface, but two privacy-related mistakes are still relevant.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Breaking consent or analytics wiring during layout polish | Incorrect script behavior, compliance drift, inconsistent analytics | Keep layout scripts in the root shell and regression-test presence/placement |
| Logging interaction-heavy polish instrumentation too broadly | Collecting noisy or unnecessary behavioral data | Instrument only what is needed to validate UX changes |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| “Smoother” means slower | Recruiter waits for content to settle before scanning | Favor immediate readability and subtle enhancement |
| Skeletons on already-known content | Portfolio feels fake or unstable | Use real content immediately when available |
| Mobile layout prioritizes visuals over narrative | Recruiter sees decoration before proof and contact paths | Protect reading order and CTA visibility |
| Micro-interactions only visible on hover | Touch and keyboard users miss affordances | Mirror states across hover, focus, pressed, and selected |
| Transition hides state changes instead of clarifying them | User is unsure what changed after a map interaction | Use motion to explain cause/effect, not to decorate it |

## "Looks Done But Isn't" Checklist

- [ ] **Motion system:** Reduced-motion mode meaningfully reduces or replaces non-essential movement, not just hover lift.
- [ ] **Initial render:** Hero, summary, key headings, and primary contact action are visible before client JS enhancement.
- [ ] **Skeletons:** Every skeleton corresponds to a real pending boundary; none are timer-driven or purely decorative.
- [ ] **Visual stability:** Map, panel, timeline, and section shells keep stable space and do not produce noticeable CLS.
- [ ] **Map runtime:** Selection changes do not recreate the OGL scene, duplicate canvases, or reset rotation unexpectedly.
- [ ] **Responsive narrative:** On mobile and desktop, the recruiter can still understand positioning and find contact paths quickly.
- [ ] **Interaction parity:** Hover, focus, touch, pressed, and selected states all communicate clearly.
- [ ] **Shell integrity:** Legal footer, consent widget, and analytics wiring still render once in the correct root shell.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Decorative motion harming comprehension | MEDIUM | Remove or downgrade non-essential motion, re-check CTA prominence, re-run recruiter-task walkthroughs |
| Hidden-on-mount reveals | MEDIUM | Restore visible default state, keep only progressive enhancement animations, re-test no-JS/slow-JS behavior |
| Fake or flickering skeletons | LOW/MEDIUM | Delete timer-based placeholders, bind pending UI to real async state, reserve stable geometry |
| OGL scene recreation | HIGH | Re-split viewport init/update responsibilities, stabilize callbacks, verify single canvas/single RAF lifecycle |
| Narrative regression after responsive restructure | MEDIUM/HIGH | Restore priority order first, then reintroduce layout changes incrementally by viewport |
| State desync during transitions | MEDIUM | Remove duplicate transition state, derive all views from canonical selection, add regression tests for reset/category/skill flows |

## Pitfall-to-Phase Mapping

Suggested milestone phase structure:
- **Phase 1:** UX guardrails, architecture constraints, and baseline checks
- **Phase 2:** Shared motion system + OGL/runtime hardening
- **Phase 3:** Loading states and transition integration
- **Phase 4:** Responsive restructuring and mobile interaction hardening
- **Phase 5:** Performance, accessibility, and recruiter-task verification

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Decorative motion overwhelms comprehension | Phase 1 | Reviewer can explain why each motion element improves scan or interaction clarity |
| Reduced-motion / keyboard parity missing | Phase 2 | Reduced-motion, keyboard-only, and focus-visible QA passes |
| Hidden-on-mount reveal of SSR content | Phase 1 | Initial content is readable before hydration-dependent enhancement |
| Skeletons without real async boundaries | Phase 3 | Every skeleton maps to an actual pending state or Suspense boundary |
| CLS from skeletons and layout transitions | Phase 3 and Phase 5 | Mobile visual pass and CLS-oriented checks show stable layout |
| OGL scene recreation from transition state | Phase 2 | Single canvas, stable rotation, no duplicate listeners/RAF after repeated interaction |
| Motion token drift | Phase 2 | Shared durations/easings/distances are centralized and reused |
| Responsive narrative regression | Phase 4 | Desktop and mobile preserve recruiter-first reading order and contact discoverability |
| Touch ergonomics regressions | Phase 4 | Real-device mobile QA passes for tap targets, overflow, map gestures, and scrolling |
| Map/panel/timeline transition desync | Phase 3 | Reset/category/skill flows stay visually and semantically synchronized |
| Client-boundary creep and bundle growth | Phase 1 and Phase 5 | Static sections remain server-first; added JS is justified and measured |
| Visual approval without task validation | Phase 5 | Before/after recruiter-task checklist shows equal or better clarity and contact access |

## Sources

- Current milestone and constraints: `/home/riccardolm/github/94lama/.planning/PROJECT.md` — HIGH confidence
- Current architecture baseline: `/home/riccardolm/github/94lama/.planning/ARCHITECTURE.md` — HIGH confidence
- Current server/client composition: `/home/riccardolm/github/94lama/app/page.tsx`, `/home/riccardolm/github/94lama/app/components/knowledge-experience-coordinator.tsx`, `/home/riccardolm/github/94lama/app/components/skills-knowledge-map.tsx` — HIGH confidence
- Current OGL lifecycle hotspot: `/home/riccardolm/github/94lama/app/components/knowledge-map/viewport.tsx`, `/home/riccardolm/github/94lama/app/components/knowledge-map/runtime.ts` — HIGH confidence
- Current style token baseline: `/home/riccardolm/github/94lama/app/components/section-card-styles.ts`, `/home/riccardolm/github/94lama/app/globals.css` — HIGH confidence
- Current verification baseline: `/home/riccardolm/github/94lama/tests/e2e/portfolio-parity.spec.ts`, `/home/riccardolm/github/94lama/tests/phase-04-knowledge-experience.test.ts` — HIGH confidence
- Next.js 16 `loading.js` / streaming docs (last updated 2026-04-15): https://nextjs.org/docs/app/api-reference/file-conventions/loading — HIGH confidence
- React docs, `<Suspense>`: https://react.dev/reference/react/Suspense — HIGH confidence
- React docs, `useEffect`: https://react.dev/reference/react/useEffect — HIGH confidence
- MDN, `prefers-reduced-motion` (last modified 2026-04-20): https://developer.mozilla.org/en-US/docs/Web/CSS/%40media/prefers-reduced-motion — HIGH confidence
- web.dev, CLS guidance (updated 2023-04-12): https://web.dev/articles/cls — MEDIUM confidence for metric guidance, still current enough for these principles

---
*Pitfalls research for: v1.2 improve ux and ui*
*Researched: 2026-04-21*
