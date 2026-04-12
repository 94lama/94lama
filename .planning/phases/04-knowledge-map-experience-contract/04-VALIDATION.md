---
phase: 4
slug: knowledge-map-experience-contract
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-12
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node test runner |
| **Config file** | none |
| **Quick run command** | `node --test --experimental-strip-types tests/phase-04-knowledge-experience.test.ts` |
| **Full suite command** | `node --test --experimental-strip-types tests/phase-03-contact-validation.test.ts tests/phase-04-knowledge-experience.test.ts` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test --experimental-strip-types tests/phase-04-knowledge-experience.test.ts`
- **After every plan wave:** Run `node --test --experimental-strip-types tests/phase-03-contact-validation.test.ts tests/phase-04-knowledge-experience.test.ts`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | MAP-01, EXP-01, EXP-02 | T-4-01 | Selection input only affects derived ranking/highlighting; no hidden timeline state | unit | `node --test --experimental-strip-types tests/phase-04-knowledge-experience.test.ts` | ❌ W0 | ⬜ pending |
| 4-01-02 | 01 | 1 | MAP-01, EXP-01, EXP-02 | T-4-01 | Shared coordinator exposes one selection contract across map and timeline | unit | `node --test --experimental-strip-types tests/phase-04-knowledge-experience.test.ts` | ❌ W0 | ⬜ pending |
| 4-02-01 | 02 | 2 | MAP-01, MAP-02 | T-4-02 | Rendered map no longer exposes duplicate skills block or visible center sphere affordance | unit | `node --test --experimental-strip-types tests/phase-04-knowledge-experience.test.ts` | ❌ W0 | ⬜ pending |
| 4-02-02 | 02 | 2 | EXP-01, EXP-02 | T-4-01 | Section wiring keeps all experience entries present while surfacing matches first | unit | `node --test --experimental-strip-types tests/phase-04-knowledge-experience.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/phase-04-knowledge-experience.test.ts` — stubs for `MAP-01`, `MAP-02`, `EXP-01`, `EXP-02`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Recruiter can comfortably scan and interact with the de-centered map in section `01` | MAP-02 | Visual spacing and click/tap usability need human judgment | Run app locally, inspect section `01`, confirm center sphere is gone, nodes are visually separated, and node/category selection updates section `02` immediately |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
