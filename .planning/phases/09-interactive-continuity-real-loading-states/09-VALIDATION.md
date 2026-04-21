---
phase: 9
slug: interactive-continuity-real-loading-states
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-21
---

# Phase 9 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build plus Node test runner |
| **Config file** | `package.json` |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm test` |
| **Estimated runtime** | ~90 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 9-01-01 | 01 | 1 | MOTN-04, LOAD-02 | T-9-01, T-9-02 | Shared selection and pending continuity stay in one coordinator instead of divergent per-surface state | build | `npm run build` | ✅ | pending |
| 9-01-02 | 01 | 1 | LOAD-01 | T-9-01, T-9-03 | Map readiness treatment is tied to a real viewport-ready boundary and preserves stable geometry | build | `npm run build` | ✅ | pending |
| 9-02-01 | 02 | 2 | LOAD-03 | T-9-04 | Route-level loading mirrors the real page shell without exposing misleading or interactive placeholder controls | build | `npm run build` | ✅ | pending |
| 9-02-02 | 02 | 2 | LOAD-01, LOAD-02, LOAD-03 | T-9-01, T-9-02, T-9-04 | Tests lock the continuity wiring so future changes do not reintroduce remounts or fake loading | build+tests | `npm run build && npm test` | ✅ | pending |

*Status: pending = not yet executed; green/red filled during execution.*

---

## Wave 0 Requirements

- [x] Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Interactive section preserves orientation during hotspot changes | MOTN-04, LOAD-02 | Continuity quality and orientation are visual | Interact with multiple map hotspots and category buttons; confirm the panel shell, map shell, and full timeline stay visible while emphasis and copy settle in place. |
| Route-level loading shell feels like the same portfolio page | LOAD-03 | Structural continuity is visual | Trigger a real route-level loading path and confirm the shell preserves hero, map/timeline, and lower-grid structure without showing generic spinner-only UI. |
| Real-loading guardrails remain truthful | LOAD-01 | Requires checking absence of fake loading on immediate SSR content | Reload the page and inspect hero, contact, education, languages, and relocation sections; confirm they render as real content instead of placeholders when no real wait exists. |

---

## Validation Sign-Off

- [x] All tasks have build-based verification or stronger
- [x] Sampling continuity: no plan wave ends without automated verification
- [x] Wave 0 covers all missing references
- [x] No watch-mode flags
- [x] Feedback latency < 90s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
