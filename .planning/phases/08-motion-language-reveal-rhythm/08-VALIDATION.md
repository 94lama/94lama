---
phase: 8
slug: motion-language-reveal-rhythm
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-21
---

# Phase 8 - Validation Strategy

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
| 8-01-01 | 01 | 1 | MOTN-01 | - | Shared motion helpers stay in existing app code without extra dependencies | build | `npm run build` | ✅ | passed |
| 8-01-02 | 01 | 1 | MOTN-02 | - | Section and hero reveal logic keeps server-rendered content readable and build-safe | build | `npm run build` | ✅ | passed |
| 8-02-01 | 02 | 2 | MOTN-03 | - | CTA, contact, map-panel, and experience feedback changes compile without client/runtime drift | build | `npm run build` | ✅ | passed |
| 8-02-02 | 02 | 2 | MOTN-01 | - | Shared interaction timing remains wired through common style sources and existing components | build+tests | `npm run build && npm test` | ✅ | passed |

*Status: pending = not yet executed; green/red filled during execution.*

---

## Wave 0 Requirements

- [x] Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero remains effectively immediate while supporting cards gain subtle polish | MOTN-02 | Scan-speed judgment is visual | Load the portfolio and confirm heading, role, summary, and email CTA are readable immediately while nearby surfaces can still reveal subtly. |
| Knowledge-map panel and timeline feedback feel aligned without fake continuity choreography | MOTN-01, MOTN-03 | Timing/fidelity comparison is visual | Interact with map controls, category buttons, and highlighted experience entries; confirm the feedback family matches the rest of the page while the choreography remains compact. |

---

## Validation Sign-Off

- [x] All tasks have build-based verification or stronger
- [x] Sampling continuity: no plan wave ends without automated verification
- [x] Wave 0 covers all missing references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-21 after `npm run build`, `npm test`, and reference verification for both plan files.
