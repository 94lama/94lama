# Project Research Summary

**Project:** Riccardo La Malfa Portfolio
**Domain:** recruiter-facing one-page portfolio refresh
**Researched:** 2026-04-12
**Confidence:** HIGH

## Executive Summary

This milestone is a focused portfolio clarity upgrade, not a product expansion. The research consistently points to a recruiter-first single-page experience built with the existing stack: keep Next.js, React, Tailwind, and OGL; move the knowledge map into the primary skills slot; sync it with the experience timeline; and improve visual polish through blue-led theme tokens, restrained motion, clearer relocation details, and compact contact actions.

The recommended approach is incremental and architecture-led. Keep `app/page.tsx` server-first, introduce one small client coordinator for shared map/experience state, and centralize consent bootstrapping in layout rather than footer logic. The strongest v1.1 outcome is a map-first navigation model that reveals relevant evidence without hiding the full experience timeline.

The main risks are joinery risks, not styling risks: brittle skill-to-experience matching, duplicated selection state, hidden assumptions around the removed center node, and duplicated iubenda bootstrapping. Mitigate them by locking the shared interaction/data contract first, keeping one parent-owned selection model, preserving a non-visual default state, and using one consent bootstrap path.

## Key Findings

### Recommended Stack

Research strongly recommends staying on the current stack and solving this milestone through refactoring, theming, and state cleanup rather than new dependencies. The scope is small enough that Tailwind tokens/utilities, React lifted state, and the existing OGL graph cover the needed work.

**Core technologies:**
- **Next.js 16.2.3**: app composition and SSR shell — keep server-first boundaries narrow.
- **React 19.2.4**: shared selection state and small client islands — lifted state is sufficient; no global store needed.
- **Tailwind 4**: blue theme refresh and subtle motion — token-first theming and `motion-safe` utilities fit the milestone.
- **OGL 1.0.11**: knowledge map rendering — reuse the existing graph and adjust layout/highlighting instead of swapping engines.
- **iubenda (existing integration)**: consent and legal UX — extend the current setup rather than adding another CMP.

**Critical version requirements:** keep the current Next.js/App Router patterns intact, use Tailwind 4 motion/state utilities, and preserve the existing OGL and iubenda integration paths.

### Expected Features

The must-have behavior is a polished recruiter flow that improves relevance without increasing interpretation cost. The knowledge map should become the primary skills surface, but the experience timeline must remain fully visible and only highlight/reorder relevant entries.

**Must have (table stakes):**
- Blue-led visual refresh through design tokens.
- Subtle motion with `prefers-reduced-motion` support.
- Knowledge map replacing the standalone skills section.
- Shared map-to-experience sync with full experience visibility.
- Richer relocation details.
- Compact, accessible contact icon links with email as primary CTA.
- Real cookie consent prompt at bootstrap if consent is required.

**Should have (competitive):**
- Knowledge map as the first skills surface.
- Selection-driven experience reordering in addition to highlighting.
- More spatial, de-centered map layout with the center sphere removed from UX.
- Cleaner contact utility bar.
- Relocation framed as recruiter decision support.

**Defer (v2+):**
- Advanced navigation beyond the single-page recruiter flow.
- Hard-filter logic that hides nonmatching experience.
- Major architecture rewrites or OOP orchestration.
- Decorative/heavy animation experiments.

### Architecture Approach

The architecture recommendation is clear: keep `app/page.tsx` as the server-rendered composition root, add one `KnowledgeExperienceCoordinator` client island for sections `01` and `02`, and keep other sections server-rendered unless browser APIs require otherwise. The map writes a single selection state; the experience timeline derives ranking/highlighting from that same state; consent bootstrap belongs in `app/layout.tsx`, not footer components.

**Major components:**
1. **KnowledgeExperienceCoordinator** — owns the single selection state shared by sections `01` and `02`.
2. **KnowledgeMapSection / Canvas / Inspector** — renders the OGL map, legend, and selection details.
3. **ExperienceTimelineSection** — keeps all entries visible while highlighting and gently reordering matches.
4. **RelocationSection** — presents richer recruiter-relevant relocation details from authored content.
5. **ContactIconLinks** — compact, accessible email/GitHub/LinkedIn actions.
6. **ConsentBootstrapScript** — centralizes iubenda config and early script loading in layout.

### Critical Pitfalls

1. **Map–experience drift from brittle matching** — avoid substring-only matching; add explicit mapping or stable normalization and derive ranking from a clear helper.
2. **Forked selection state** — use one parent-owned selection model and make map/timeline consumers of the same state.
3. **Removing the center sphere without a semantic fallback** — preserve a non-visual default/root selection even if the node is no longer rendered.
4. **Global client-ification during refactor** — keep server sections server-rendered and isolate client code to the shared interaction cluster.
5. **Duplicated consent bootstrapping** — load iubenda once, separate footer legal links from bootstrap behavior, and verify real browser load order.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Interaction Contract and Shared State
**Rationale:** This phase removes the highest-risk joinery issues before any visual polish. Matching quality, selection ownership, and default-state behavior are prerequisites for a trustworthy map-first UX.
**Delivers:** shared selection model, explicit no-selection/root behavior, experience ranking helper, and `KnowledgeExperienceCoordinator` wiring.
**Addresses:** map/experience sync, experience remains fully visible, knowledge map replacing the old skills section.
**Avoids:** brittle matching drift, forked selection state, hidden `core` assumptions, oversized client boundaries.

### Phase 2: Section Restructure and UX Polish
**Rationale:** Once interaction contracts are stable, the UI can be safely rearranged and polished without chasing moving logic.
**Delivers:** map in section `01`, synced experience timeline in section `02`, blue token refresh, subtle motion, de-centered map layout, relocation expansion, and accessible contact utility bar.
**Uses:** Tailwind 4 theme tokens/motion utilities, OGL layout adjustments, server-presentational sections.
**Implements:** knowledge map section split, experience cards, relocation/contact presentation updates.
**Avoids:** reordering that feels like filtering, mobile map dominance, contrast regressions, unclear icon-only contact actions, duplicated relocation content.

### Phase 3: Consent and Legal Bootstrap Integration
**Rationale:** Consent should land after structural changes are stable because it depends on final bootstrap ownership and browser validation rather than core recruiter UX.
**Delivers:** single iubenda bootstrap path in `app/layout.tsx`, deduped script loading, verified banner behavior, and legal footer limited to policy links/markup.
**Addresses:** bootstrap consent prompt.
**Avoids:** duplicated script loads, banner race conditions, focus/overlay issues, broken policy/preference flows.

### Phase Ordering Rationale

- Phase 1 comes first because the riskiest failures are data/state contract failures, not CSS or layout issues.
- Phase 2 groups features that share the same architectural boundary: map, experience, theming, motion, relocation, and contact all depend on the stable coordinator and section structure.
- Phase 3 is isolated because consent integration has distinct third-party and QA risks and should not complicate earlier UX refactors.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** decide whether explicit experience-to-skill mapping should be added now or via a normalization layer.
- **Phase 2:** validate mobile usability/hit targets for the de-centered OGL map and confirm final authored relocation content.
- **Phase 3:** confirm real iubenda account/config requirements and browser load-order behavior for the consent banner.

Phases with standard patterns (skip research-phase):
- **Phase 2 visual refresh:** Tailwind token swap, restrained motion, and accessible contact simplification follow well-documented patterns.
- **Phase 1 shared-state wiring:** lifted state in a single local client coordinator is a standard React pattern.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Strong codebase evidence and official React/Tailwind/iubenda/Next guidance all align on “refactor, don’t add libraries.” |
| Features | MEDIUM-HIGH | Well grounded in recruiter-first UX reasoning and current project scope, but some content details depend on authored portfolio data. |
| Architecture | HIGH | Repo structure and official Next/React patterns support the recommended server-first composition with one client coordinator. |
| Pitfalls | HIGH | Risks are codebase-specific and consistently identified across architecture, feature, and stack research. |

**Overall confidence:** HIGH

### Gaps to Address

- **Skill-to-experience mapping fidelity:** validate whether current text-derived matching is good enough or if explicit authored mappings are needed in this milestone.
- **iubenda configuration details:** confirm the actual project account/config values and whether current footer logic must be simplified when bootstrap moves to layout.
- **Mobile map usability:** test node hit targets, map height, and section ordering on smaller screens before locking the de-centered layout.
- **Relocation content depth:** ensure the authored source includes practical timing/preferences so the section can be enriched without ad hoc hardcoding.

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md` — stack direction, dependency constraints, iubenda reuse.
- `.planning/research/FEATURES.md` — table stakes, differentiators, dependency ordering.
- `.planning/research/ARCHITECTURE.md` — component boundaries, data flow, build order.
- `.planning/research/PITFALLS.md` — phase risks, integration warnings, mitigation strategy.
- React docs: https://react.dev/learn/sharing-state-between-components — shared state pattern.
- Next.js local docs: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — server/client boundaries.
- Next.js local docs: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/script.md` — `beforeInteractive` consent script placement.
- Tailwind docs: https://tailwindcss.com/docs/transition-property and https://tailwindcss.com/docs/hover-focus-and-other-states#prefers-reduced-motion — motion guidance.

### Secondary (MEDIUM confidence)
- iubenda docs: https://www.iubenda.com/en/help/1177-iubenda-cookie-solution-introduction-and-getting-started — CMP setup basics.
- iubenda docs: https://www.iubenda.com/en/help/3081-prior-consent-cookie-solution — prior consent behavior.
- iubenda docs: https://www.iubenda.com/en/help/1205-how-to-configure-your-cookie-solution-advanced-guide — advanced configuration and global loading model.
- MDN/W3C references cited in FEATURES.md and PITFALLS.md — motion accessibility and accessible naming guidance.

---
*Research completed: 2026-04-12*
*Ready for roadmap: yes*
