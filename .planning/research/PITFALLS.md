# Milestone Pitfalls: v1.1 TODO Refresh

**Domain:** Recruiter-first one-page portfolio refresh on existing Next.js 16 app  
**Researched:** 2026-04-12  
**Confidence:** HIGH for codebase-specific risks, MEDIUM for consent-banner implementation details

## Critical Pitfalls

### 1) Map ↔ experience drift from brittle matching
**What goes wrong:** The knowledge map highlights one thing, while `02 - Experience` shows weak, missing, or misleading matches.  
**Why it happens:** The current experience matching is text-based (`role + company + highlights`) and falls back when labels are not mentioned verbatim. That is fragile for renamed skills, grouped nodes, and reordered content.  
**Consequences:** The new section `01` feels decorative instead of trustworthy; recruiter confidence drops fast.  
**Warning signs:**
- Selecting a skill shows no related experience even when it obviously exists
- Category selections feel random or over-broad
- Reordering changes often after copy edits in `cv.md`
**Prevention:**
- Do not rely on substring matching as the long-term source of truth
- Add explicit experience-to-skill mapping data or a stable normalization layer
- Treat “highlight + reorder” as the default, not “filter away unrelated entries”
**Roadmap phase:** Phase 1 — shared data model and interaction contract

### 2) Forked selection state between section `01` and section `02`
**What goes wrong:** The map, detail panel, and experience list stop agreeing on the active selection.  
**Why it happens:** Moving the map earlier in the page invites local state in multiple components during the refactor. The app already has a controller, but the current structure still lives in a separate interactive block.  
**Consequences:** Double bugs, visual desync, confusing highlights, harder testing.  
**Warning signs:**
- Clicking a node updates chips but not experience order
- Mobile and desktop render different selected defaults
- “Reset” behavior depends on which component was used last
**Prevention:**
- Keep one parent-owned selection model
- Define one canonical “no selection” state before removing the center sphere
- Make section `01` map and section `02` experience consumers of the same state, not peers with mirrored state
**Roadmap phase:** Phase 1 — shared state wiring before visual polish

### 3) Removing the center sphere without replacing its semantic fallback
**What goes wrong:** The graph loses its neutral/default state, or hidden code still assumes `core` is visible/selectable.  
**Why it happens:** The current graph model, sizing, highlighting, and fallback selection all depend on a `core` node.  
**Consequences:** Broken initial selection, dead clicks, odd highlight rules, or accidental first-category bias.  
**Warning signs:**
- First render auto-selects an arbitrary category
- Reset behavior becomes impossible or inconsistent
- Highlight logic throws everything into dimmed state
**Prevention:**
- Keep a non-visual root selection in the state model even if the sphere is removed from the scene
- Separate “graph data root” from “rendered node”
- Test initial load, reset, and no-selection copy explicitly
**Roadmap phase:** Phase 1 — interaction model and graph refactor

### 4) Global client-ification during the refactor
**What goes wrong:** Too much of the page becomes a Client Component just to support the map, consent prompt, or animation helpers.  
**Why it happens:** It is tempting to move state upward into `app/page.tsx` or a large layout wrapper. In Next App Router, interactive boundaries should stay narrow.  
**Consequences:** Larger JS payload, worse first load, harder SSR/SEO behavior, more fragile composition.  
**Warning signs:**
- `"use client"` spreads into page/layout-level files
- Server-rendered content starts depending on browser-only APIs
- Simple presentational sections gain hooks “for convenience”
**Prevention:**
- Keep server-rendered content static where possible
- Use a small client coordinator around map/experience/consent behavior only
- Respect Next client boundary rules and serializable props
**Roadmap phase:** Phase 1 — composition and boundaries

### 5) Consent prompt integration that duplicates or fights existing legal embed logic
**What goes wrong:** The footer legal links work, but bootstrap consent causes duplicate script loads, race conditions, banner flashes, or broken policy links.  
**Why it happens:** The current footer already strips embedded snippet scripts and reinjects `iubenda.js` with `next/script`. Adding banner bootstrapping naively can reintroduce duplicate loaders or conflicting configuration order.  
**Consequences:** Unreliable consent UI, console noise, inconsistent widget behavior, hard-to-debug third-party state.  
**Warning signs:**
- Multiple `iubenda.js` requests
- Banner appears twice or not at all
- Policy links work in footer but preference prompt does not
**Prevention:**
- Establish one source of truth for iubenda bootstrapping
- Load the vendor script once
- Keep policy-link rendering separate from consent configuration state
- Verify actual load order in the browser, not just build success
**Roadmap phase:** Phase 3 — legal/bootstrap integration after structure is stable

## Moderate Pitfalls

### 6) Blue refresh that breaks contrast or brand hierarchy
**What goes wrong:** Blue polish looks newer but reduces CTA clarity, section hierarchy, or readability on dark/light surfaces.  
**Prevention:** Swap theme tokens, not one-off hex values. Recheck contrast on hero CTA, chips, borders, and map edges. Keep one accent hierarchy.
**Roadmap phase:** Phase 2 — theming pass

### 7) “Subtle animation” becoming performance noise
**What goes wrong:** Motion competes with recruiter scan speed, especially with OGL already animating the map.  
**Prevention:** Animate emphasis, not everything. Respect `prefers-reduced-motion`. Avoid page-wide entrance choreography and heavy blur/shadow animation.
**Roadmap phase:** Phase 2 — motion pass after layout/content decisions

### 8) Map-first layout that hurts mobile comprehension
**What goes wrong:** Moving the map into section `01` makes the page feel like a demo before it feels like a portfolio.  
**Prevention:** Keep a compact explanatory frame, preserve scannable text nearby, cap map height on smaller screens, and avoid pushing experience too far down.
**Roadmap phase:** Phase 2 — responsive layout validation

### 9) Reordering experience in ways that feel like filtering
**What goes wrong:** Requirement says all experience stays visible, but the UI effectively hides context by moving unrelated items too far down or reducing them too aggressively.  
**Prevention:** Reorder gently, preserve all cards, and keep non-matching cards readable. Avoid zero-height collapse or opacity so low that content feels disabled.
**Roadmap phase:** Phase 2 — interaction polish

### 10) Icon-only contact treatment that removes clarity
**What goes wrong:** Contact links look cleaner but become ambiguous, less accessible, and easier to miss.  
**Prevention:** Keep explicit labels or tooltips/aria-labels, preserve primary email prominence, and do not make recruiters infer icon meaning.  
**Roadmap phase:** Phase 2 — contact redesign

### 11) Relocation copy duplication across hero, relocation, and contact
**What goes wrong:** Timing/preferences appear in multiple places with slightly different wording.  
**Prevention:** Decide ownership: hero = short status, relocation section = detail, contact = contact only. Keep relocation authored from one content source.
**Roadmap phase:** Phase 2 — content consolidation

### 12) Atomization turning into fragmentation
**What goes wrong:** The refactor produces many tiny components with unclear responsibility, or accidentally recreates the rejected OOP orchestration in another form.  
**Prevention:** Split by domain boundary (hero, map coordinator, experience list, relocation, contact, legal), not by every visual wrapper. Keep stateful logic close to the coordinator.
**Roadmap phase:** Phase 1 — refactor plan before UI slicing

## Minor Pitfalls

### 13) Z-index and focus conflicts with consent/banner/footer overlays
**What goes wrong:** Sticky or floating legal UI covers focused controls or the footer overlaps navigation targets.  
**Prevention:** Test keyboard navigation with the banner open. Use scroll padding or modal behavior so focus is not obscured.
**Roadmap phase:** Phase 3 — legal QA

### 14) 3D spread reduces hit-target quality
**What goes wrong:** More spatially distributed nodes look better but become harder to click/tap, especially on touch devices.  
**Prevention:** Keep alternate controls (chips/buttons), maintain generous projected hit radii, and test dense clusters on mobile.
**Roadmap phase:** Phase 2 — map usability tuning

### 15) Hardcoded display content creeping back in
**What goes wrong:** Contact, relocation, or map labels get hardcoded during redesign instead of staying tied to the maintained content source.  
**Prevention:** Keep authored content flowing from `public/assets/cv.md`; isolate presentational transforms from source data.
**Roadmap phase:** Phase 1 — data contract review

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Phase 1 — state + composition | Duplicated local state, hidden `core` assumptions, oversized client boundary | Lock the shared selection contract first; keep a non-visual default state; use one client coordinator |
| Phase 1 — data model | Skill-to-experience matching drifts after copy edits | Add explicit mapping or stable normalization before UI polish |
| Phase 2 — theme + motion | Blue refresh and animation reduce scan speed | Tokenize colors, recheck contrast, respect reduced motion, animate only emphasis |
| Phase 2 — map + experience UX | Reordering behaves like filtering; map dominates mobile layout | Preserve all entries, reorder mildly, cap map footprint, test touch targets |
| Phase 2 — relocation + contact | Cleaner UI removes clarity or duplicates info | Make relocation own detail, keep email obvious, add accessible labels to icon links |
| Phase 3 — consent/bootstrap | Duplicate iubenda setup, focus-obscuring banner, broken preference flow | Single boot path, keyboard QA, verify real browser load order and banner behavior |

## Most Important Integration Rule

Do **not** treat this as six separate UI chores. The risky part is the **joinery**: shared selection state, content ownership, client boundaries, and third-party consent bootstrapping. If those contracts are set first, the visual refresh is low risk. If they are not, the milestone will look finished while behaving inconsistently.

## Sources

- Local codebase: `app/page.tsx`, `app/components/skills-knowledge-map.tsx`, `app/components/experience-map-controller.tsx`, `app/components/experience-map-section.tsx`, `app/layout.tsx`, `app/components/legal-embed-footer.tsx`, `app/globals.css`
- Project context: `.planning/PROJECT.md`, `TODO.md`
- Next.js App Router docs (local package docs): `node_modules/next/dist/docs/01-app/02-guides/scripts.md`, `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`
- W3C WCAG 2.2 Understanding SC 2.4.11 Focus Not Obscured (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- iubenda advanced guide: https://www.iubenda.com/en/help/1205-how-to-configure-your-cookie-solution-advanced-guide
