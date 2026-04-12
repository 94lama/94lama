---
quick_task: 260412-jzg
type: quick
autonomous: true
files_modified:
  - app/layout.tsx
  - app/components/legal-footer.tsx
---

<objective>
Move the Iubenda privacy-policy and cookie-policy UI out of `app/layout.tsx` into a dedicated footer component.

Purpose: Keep the root layout focused on app shell concerns while giving the legal links a reusable footer boundary that is easier to maintain.
Output: A new footer component rendered by the root layout, with the existing privacy/cookie links and required Iubenda script preserved.
</objective>

<context>
@.planning/STATE.md
@./AGENTS.md
@app/layout.tsx
@node_modules/next/dist/docs/01-app/02-guides/scripts.md

<interfaces>
From `app/layout.tsx`:
```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Extract the legal embed markup into a footer component</name>
  <files>app/components/legal-footer.tsx</files>
  <action>Create `app/components/legal-footer.tsx` as the new footer boundary for the legal links. Move the existing Iubenda privacy-policy and cookie-policy anchors into this component, keep the current hrefs, titles, and Iubenda class names, and render them inside a semantic `<footer>` wrapper with minimal layout styling only if needed to keep them grouped. Follow the Next 16 script guidance by keeping the Iubenda bootstrap in `next/script` inside the component rather than raw DOM injection. Avoid changing copy, URLs, consent behavior, or adding unrelated footer content.</action>
  <verify>
    <automated>npm run lint</automated>
  </verify>
  <done>`app/components/legal-footer.tsx` exists, contains both legal links, and owns the Iubenda script loading needed for them to initialize.</done>
</task>

<task type="auto">
  <name>Task 2: Wire the root layout to use the new footer component</name>
  <files>app/layout.tsx, app/components/legal-footer.tsx</files>
  <action>Update `app/layout.tsx` to import and render `LegalFooter` after `{children}` so the legal UI no longer lives inline in the layout body. Remove the duplicated inline privacy/cookie anchors and scripts from the layout, but preserve the rest of the root shell exactly: metadata, fonts, body classes, and both existing Google Tag Manager entries stay untouched. Keep the change scoped to this extraction only.</action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>The root layout renders the new footer component, the inline legal markup is gone from `app/layout.tsx`, and the app still builds successfully.</done>
</task>

</tasks>

<success_criteria>
- `app/layout.tsx` no longer contains inline privacy/cookie anchor or script blocks.
- `app/components/legal-footer.tsx` owns the legal footer rendering.
- The privacy and cookie policy links keep their current Iubenda destinations and initialization behavior.
- `npm run lint` and `npm run build` pass.
</success_criteria>

<output>
After completion, create `.planning/quick/260412-jzg-move-privacy-and-cookie-from-app-layout-/260412-jzg-SUMMARY.md`
</output>
