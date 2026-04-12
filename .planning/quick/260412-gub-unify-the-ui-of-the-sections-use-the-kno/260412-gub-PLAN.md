---
quick_task: 260412-gub
type: quick
autonomous: true
files_modified:
  - app/page.tsx
---

<objective>
Unify the UI language of the later page sections using the knowledge-map area as the visual reference.

Purpose: Make sections `03` through `06` feel like part of the same designed system as the knowledge map instead of reverting to flatter, more generic card treatments.
Output: Updated section wrappers and inner cards in `app/page.tsx` with a shared visual treatment aligned to the knowledge-map surface.
</objective>

<context>
@.planning/STATE.md
@./AGENTS.md
@app/page.tsx
@app/components/knowledge-experience-coordinator.tsx
@app/components/skills-knowledge-map.tsx
@app/components/experience-card.tsx
@app/components/experience-timeline-section.tsx
@app/globals.css

<interfaces>
From `app/page.tsx`:
```tsx
<section className="grid gap-8 xl:grid-cols-2">
  <article className="rounded-4xl border border-white/10 bg-surface ...">
```

From `app/components/skills-knowledge-map.tsx`:
```tsx
<div className="relative overflow-hidden rounded-4xl border border-black/10 bg-black/3 ...">
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Restyle sections 03 to 06 around the knowledge-map visual language</name>
  <files>app/page.tsx</files>
  <action>Refactor the wrappers and inner content blocks for sections `03` (Education), `04` (Languages), `05` (Relocation), and `06` (Contact) so they inherit the same atmospheric language used around the knowledge map: translucent surfaces, subtle radial glow/backdrop layering, softer bordered inner cards, and more intentional spacing hierarchy. Keep the current content order and data bindings intact, but reduce the visual jump between the map/timeline area and the later sections. Use the knowledge-map section as the reference, not the hero. Keep the implementation minimal and local to `app/page.tsx`; do not change the shared selection behavior or add new components unless absolutely necessary.</action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>Sections 03 to 06 share the same polished visual system as the knowledge-map area while preserving the existing content, layout flow, and app behavior.</done>
</task>

</tasks>

<success_criteria>
- Sections `03` to `06` no longer feel visually flatter than the knowledge-map area.
- Their wrappers and inner cards use a more consistent surface, border, and glow language.
- Content structure and bindings remain unchanged.
- `npm run build` passes.
</success_criteria>

<output>
After completion, create `.planning/quick/260412-gub-unify-the-ui-of-the-sections-use-the-kno/260412-gub-SUMMARY.md`
</output>
