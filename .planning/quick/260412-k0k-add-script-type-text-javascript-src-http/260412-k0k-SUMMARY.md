---
quick_task: 260412-k0k
tags: [nextjs, scripts, iubenda, app-router]
key-files:
  created: []
  modified:
    - app/layout.tsx
  deleted: []
completed: 2026-04-12
---

# Quick Task 260412-k0k Summary

**Added the requested global Iubenda widget loader to the root App Router layout via `next/script` with `strategy="beforeInteractive"`, placed inside `<body>` so Next can inject it into the document head without invalid root-layout markup.**

## Accomplishments
- Inserted the requested `https://embeds.iubenda.com/widgets/283fdcdd-8702-47d7-84ee-59bc1203b52c.js` asset in `app/layout.tsx` using `next/script` with `type="text/javascript"` and `strategy="beforeInteractive"`.
- Corrected the placement so the `Script` component lives inside `<body>`, avoiding invalid `<html> > <script>` markup while still letting Next inject the script into the document head.
- Preserved the existing metadata, fonts, inline Iubenda loaders, and GTM wiring.
- Verified the layout still linted and built after the script addition.

## Files Created/Modified
- Modified `app/layout.tsx` to include the global Iubenda widget script at the root layout level.

## Validation
- `npm run lint` *(passes; reports existing unrelated warnings in `tests/agent-skills-caveman.test.ts` only)*
- `npm run build`

## Task Commits
- `a8341fe` — `fix(260412-k0k): load Iubenda widget with next/script`
- `0dea861` — `fix(260412-k0k): inject Iubenda widget in head`
- `1d3acba` — `fix(260412-k0k): place Iubenda script inside body`

## Deviations from Plan
None - plan executed exactly as written.

## Known Stubs
None.
