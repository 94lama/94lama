---
phase: 2
slug: portfolio-page-experience
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-10
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | other — ESLint + Next.js production build + source inspection |
| **Config file** | `eslint.config.mjs`, `tsconfig.json` |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run lint && npm run build` |
| **Estimated runtime** | ~20-40 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run lint && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 40 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | HERO-01, HERO-02, HERO-03, PORT-02 | T-2-01 | No untrusted input; hero renders server-side content only | build + source | `npm run lint` | ✅ | ⬜ pending |
| 2-01-02 | 01 | 1 | SKIL-01, EXPR-01, EXPR-02 | T-2-01 | Static typed content only; no new trust boundary | build + source | `npm run lint` | ✅ | ⬜ pending |
| 2-02-01 | 02 | 2 | PORT-01, PORT-02 | T-2-02 | No security regression in global styles/layout | build | `npm run lint && npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero immediately communicates name, role, summary, and relocation context | HERO-01, HERO-02, HERO-03 | Visual hierarchy and scan speed are subjective | Run the app, inspect the top viewport on desktop and mobile widths, confirm all four elements are visible without hunting |
| Page feels intentionally bold/creative rather than starter-like | PORT-02 | Design quality cannot be fully inferred from lint/build | Compare current rendered page against the original simple layout and confirm strong typography, contrast, and section rhythm |
| Mobile and desktop reading flow remain comfortable | PORT-01 | Responsive usability requires visual/browser validation | Check ~375px and desktop widths, confirm no horizontal scroll, readable spacing, and preserved section order |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 40s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
