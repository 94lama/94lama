# Requirements: Riccardo La Malfa Portfolio

**Defined:** 2026-04-12
**Core Value:** A recruiter can understand Riccardo's positioning and know how to contact him within one minute.

## v1 Requirements

### Visual Polish

- [ ] **UI-01**: Recruiter can scan the portfolio with blue-led accents and strong contrast without losing readability in either light mode or dark mode.
- [ ] **UI-02**: Recruiter gets subtle motion cues on interactive elements and state changes without distracting page-wide animation.
- [ ] **UI-03**: Users who prefer reduced motion can use the portfolio without non-essential animation.

### Skill Navigation

- [ ] **MAP-01**: Recruiter can use section `01` knowledge map as the primary skills surface instead of a separate skills grid.
- [ ] **MAP-02**: Recruiter can inspect a cleaner knowledge map with no center sphere and better spatial separation between items.

### Experience Sync

- [ ] **EXP-01**: Recruiter can select a map node or category and immediately see related experience entries highlighted.
- [ ] **EXP-02**: Recruiter can still view the full experience timeline while related entries reorder to the top.

### Relocation

- [ ] **RELO-01**: Recruiter can view clearer relocation timing and preference details in the dedicated relocation section.

### Contact

- [ ] **CONT-01**: Recruiter can use compact icon-based GitHub and LinkedIn actions while email remains the primary CTA.
- [ ] **CONT-02**: Recruiter does not see duplicated relocation information in the contact section.

### Consent and Legal

- [ ] **CONS-01**: Visitor is prompted for cookie/privacy consent at app bootstrap when consent is required.

## v2 Requirements

### Portfolio Extensions

- **PROJ-01**: Recruiter can browse selected project or case-study highlights from the portfolio.
- **CV-01**: Recruiter can open or download a dedicated CV view.
- **VAR-01**: Recruiter can switch between alternative portfolio UI variants without changing the shared content pipeline.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full OOP management-layer rewrite | v1.1 should stay incremental and favor atomized composition within the current React architecture. |
| Hard-filtering experience to hide nonmatching entries | Recruiters should keep the full timeline visible while related entries highlight and reorder. |
| Heavy cinematic animation | It would hurt recruiter scan speed and visual restraint. |
| Keeping both the standalone skills list and the knowledge map | The map should replace the duplicate skills surface rather than sit beside it. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 | Phase 5 | Pending |
| UI-02 | Phase 5 | Pending |
| UI-03 | Phase 5 | Pending |
| MAP-01 | Phase 4 | Pending |
| MAP-02 | Phase 4 | Pending |
| EXP-01 | Phase 4 | Pending |
| EXP-02 | Phase 4 | Pending |
| RELO-01 | Phase 5 | Pending |
| CONT-01 | Phase 5 | Pending |
| CONT-02 | Phase 5 | Pending |
| CONS-01 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-12*
*Last updated: 2026-04-12 after milestone v1.1 definition*
