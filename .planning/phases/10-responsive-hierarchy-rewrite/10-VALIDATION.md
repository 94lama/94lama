---
phase: 10
slug: responsive-hierarchy-rewrite
status: partial
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-21
---

# Phase 10 - Validation Strategy

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
| 10-01-01 | 01 | 1 | LAY-01 | T-10-01 | Shared page rhythm stays server-safe and reusable instead of fragmenting into one-off classes | build | `npm run build` | ✅ | passed |
| 10-01-02 | 01 | 1 | LAY-02, LAY-03 | T-10-02 | Hero and proof composition improve hierarchy without DOM-order drift or client-layout logic | build | `npm run build` | ✅ | passed |
| 10-02-01 | 02 | 2 | LAY-01, LAY-02 | T-10-03 | Supporting sections stay compact and CTA visibility remains explicit across breakpoints | build | `npm run build` | ✅ | passed |
| 10-02-02 | 02 | 2 | LAY-02, LAY-03 | T-10-04 | Automated checks protect layout order, route-shell alignment, and CTA-related composition wiring | build+tests | `npm run build && npm test` | ✅ | passed |

*Status: pending = not yet executed; green/red filled during execution.*

---

## Wave 0 Requirements

- [x] Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Recruiter can scan positioning, proof, and primary CTA faster than before across mobile, tablet, and desktop | LAY-01, LAY-02, LAY-03 | Scan speed and perceived hierarchy need visual judgment | Review the page at one mobile width, one tablet width, and one desktop width; confirm hero positioning is first, the proof block reads immediately after, and the primary email CTA remains obvious in hero and contact contexts. |
| Lower supporting sections feel secondary to proof while remaining readable and trustworthy | LAY-01, LAY-03 | Relative visual weight is hard to prove from source assertions alone | Compare the lower grids against the hero and proof block; confirm education, languages, relocation, and contact read as supporting evidence rather than competing headline surfaces. |

---

## Validation Sign-Off

- [x] All tasks have build-based verification or stronger
- [x] Sampling continuity: no plan wave ends without automated verification
- [x] Wave 0 covers all missing references
- [x] No watch-mode flags
- [x] Feedback latency < 90s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending manual review (`10-HUMAN-UAT.md`).
