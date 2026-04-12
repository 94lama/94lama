---
quick_task: 260412-hvf
type: quick
autonomous: true
files_modified:
  - app/globals.css
  - app/page.tsx
  - app/components/experience-card.tsx
---

<objective>
Change the portfolio accent color from green to blue.

Purpose: Align the visual identity with the preferred blue accent without leaving older green highlight treatments behind.
Output: Updated accent tokens and matching blue glow/gradient treatments in the app UI.
</objective>

<context>
@.planning/STATE.md
@./AGENTS.md
@app/globals.css
@app/page.tsx
@app/components/experience-card.tsx

<interfaces>
From `app/globals.css`:
```css
--accent: #b8ff20;
```

From `app/page.tsx` and `app/components/experience-card.tsx`:
```tsx
bg-[linear-gradient(...rgba(184,255,32,...))]
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Switch accent tokens and remaining green highlight treatments to blue</name>
  <files>app/globals.css, app/page.tsx, app/components/experience-card.tsx</files>
  <action>Update the global accent token in `app/globals.css` from green to a blue value that still works on both the dark and light themes, keeping contrast acceptable for accent foreground text. Then replace the remaining hardcoded green radial/linear highlight treatments in `app/page.tsx` and `app/components/experience-card.tsx` with blue equivalents so the accent system is visually coherent across the page. Keep the rest of the palette, layout, and interaction behavior unchanged.</action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>The app uses blue instead of green for accent surfaces, highlights, and supporting glows, and the app still builds successfully.</done>
</task>

</tasks>

<success_criteria>
- Accent tokens are blue in both themes.
- Remaining hardcoded green UI highlight treatments are replaced with blue equivalents.
- No layout or behavior changes beyond color.
- `npm run build` passes.
</success_criteria>

<output>
After completion, create `.planning/quick/260412-hvf-change-accent-from-green-to-blue/260412-hvf-SUMMARY.md`
</output>
