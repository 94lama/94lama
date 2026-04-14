# QA Checklist: v1.1 Atomization of Components

**Goal:** Confirm the refactor preserved recruiter-facing parity while shipping the new atomic architecture.

## Automated Checks

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm test`
- [x] `npm run test:e2e`

## Recruiter-Facing Parity

- [x] Hero still shows name, role, summary, location, relocation, and profile photo on first load.
- [x] Primary CTA is still email-first and visible before interacting with the map.
- [x] GitHub and LinkedIn still render as secondary authored contact actions.
- [x] Education, languages, relocation, and contact sections still appear in the same order.
- [x] Recruiter-facing copy hierarchy remains unchanged apart from invisible refactor work.

## Knowledge Map Parity

- [x] Overview state still keeps the full experience timeline visible.
- [x] Selecting a field or technology still highlights related experience and moves matching entries higher.
- [x] Reset to overview returns the experience list to the full-timeline helper state.
- [x] Related-point chips/buttons still navigate between connected nodes.
- [x] Map remains usable with reduced-motion preference enabled.

## Responsive And Accessibility Smoke Checks

- [x] Desktop layout still preserves the recruiter-first scan path.
- [x] Mobile layout still keeps all sections readable without horizontal overflow.
- [x] Interactive controls remain keyboard-focusable and visibly focusable.
- [x] Contact links, privacy policy, and cookie policy remain reachable.

## Layout-Level Wiring

- [x] `LegalFooter` still renders privacy and cookie policy links.
- [x] Iubenda widget bootstrap still loads from `app/layout.tsx`.
- [x] GTM tags remain present in the root layout.

## Signoff Notes

- Result: Passed
- Verified by: OpenCode
- Date: 2026-04-13
