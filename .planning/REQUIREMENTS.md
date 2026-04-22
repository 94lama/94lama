# Requirements: Riccardo La Malfa Portfolio

**Defined:** 2026-04-21
**Core Value:** A recruiter can understand Riccardo's positioning and know how to contact him within one minute.

## Milestone v1.2 Requirements

### Motion and Interaction

- [x] **MOTN-01**: Recruiter experiences one consistent motion language across section reveals, interaction feedback, and state changes. - Phase 8 (2026-04-21)
- [x] **MOTN-02**: Recruiter can enter and scan sections through polished reveal and loading transitions that add orientation without blocking reading. - Phase 8 (2026-04-21)
- [x] **MOTN-03**: Recruiter gets immediate micro-interaction feedback on primary CTAs, links, cards, and interactive controls. - Phase 8 (2026-04-21)
- [ ] **MOTN-04**: Recruiter can move between knowledge-map, detail-panel, and timeline states through smooth coordinated transitions that preserve context.

### Loading and Continuity

- [ ] **LOAD-01**: Recruiter sees skeleton screens or reserved placeholders only where real waiting exists, especially around delayed interactive surfaces.
- [ ] **LOAD-02**: Recruiter keeps context during map, panel, and timeline state changes through pending-state continuity instead of abrupt swaps.
- [ ] **LOAD-03**: Recruiter sees a route-level loading shell that preserves page structure and perceived continuity during real page-start or navigation waits.

### Layout and Hierarchy

- [ ] **LAY-01**: Recruiter can scan the page faster through improved spacing, padding rhythm, and section chunking.
- [ ] **LAY-02**: Recruiter can read and interact comfortably across mobile, tablet, and desktop through stronger responsive reflow and clearer CTA visibility.
- [ ] **LAY-03**: Recruiter can navigate a materially reworked page composition that improves proof-first hierarchy and section relationships over the current layout.

### Quality Guardrails

- [ ] **QUAL-05**: Recruiter can still understand Riccardo's positioning and find primary contact actions within one minute after the UX/UI changes.
- [ ] **QUAL-06**: Recruiter experiences the added polish without fake waiting, distracting instability, or noticeable performance regressions.

## Future Requirements

### UX Accessibility and Verification

- **MOTN-05**: Recruiters who prefer reduced motion can experience the same content and interactions with non-essential motion reduced or removed.
- **QUAL-07**: Maintainer can run explicit regression checks covering motion behavior, responsive layout, and key recruiter flows before signoff.

### Product Extensions

- **PROJ-01**: Recruiter can browse selected project or case-study highlights from the portfolio.
- **CV-01**: Recruiter can open or download a dedicated CV view.
- **VAR-01**: Recruiter can switch between alternative portfolio UI variants without changing the shared content pipeline.

### Architecture Tooling

- **TOOL-01**: Maintainer can review extracted atoms and sections in a dedicated component workbench if iteration frequency later justifies the overhead.
- **RULE-01**: Maintainer can enforce stricter import-boundary or typing rules if server/client drift becomes a recurring maintenance problem.
- **DATA-01**: Maintainer can adopt a richer portfolio content workflow if `public/assets/cv.json` becomes too limiting for future milestones.

## Out of Scope

| Feature | Reason |
|---------|--------|
| New product-surface expansion such as project showcase or dedicated CV access | This milestone is focused on improving the current recruiter experience before adding new surfaces. |
| Replacing OGL or changing the core knowledge-map interaction model | The milestone should polish the experience around the map without turning it into a different feature. |
| Rewriting the maintained content workflow away from `public/assets/cv.json` | Content-pipeline changes are unrelated to UX/UI polish and would dilute milestone focus. |
| Framework churn or adding heavy animation tooling without clear need | Existing stack already supports most milestone goals, and unnecessary tooling would add risk. |
| Decorative motion that delays reading or hides already-rendered content | Recruiter comprehension and contact discoverability matter more than spectacle. |
| Fake skeletons or generic loading states for immediately available server-rendered content | Artificial waiting would hurt trust and perceived speed in a mostly server-first one-page app. |
| Scroll-hijacking, cinematic storytelling, or parallax-heavy effects | These patterns are more likely to distract recruiters than improve scan speed. |
| Global clientification of the page tree | It would weaken rendering discipline, SEO safety, and milestone performance goals. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MOTN-01 | Phase 8 | Complete |
| MOTN-02 | Phase 8 | Complete |
| MOTN-03 | Phase 8 | Complete |
| MOTN-04 | Phase 9 | Complete |
| LOAD-01 | Phase 9 | Complete |
| LOAD-02 | Phase 9 | Complete |
| LOAD-03 | Phase 9 | Complete |
| LAY-01 | Phase 10 | Implemented, pending manual verification |
| LAY-02 | Phase 10 | Implemented, pending manual verification |
| LAY-03 | Phase 10 | Implemented, pending manual verification |
| QUAL-05 | Phase 11 | Pending |
| QUAL-06 | Phase 11 | Pending |

**Coverage:**
- Milestone requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-21*
*Last updated: 2026-04-21 after roadmap creation*
