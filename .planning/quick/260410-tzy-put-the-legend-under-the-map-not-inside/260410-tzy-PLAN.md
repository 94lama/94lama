---
quick_task: 260410-tzy
type: quick
autonomous: true
files_modified:
  - app/components/skills-knowledge-map.tsx
---

<objective>
Move the knowledge-map legend below the map instead of rendering it inside the map card.

Purpose: Reduce visual crowding inside the 3D map area so the interactive graph remains the focus while the legend stays easy to scan.
Output: Updated legend placement and spacing in the knowledge-map client component.
</objective>

<context>
@.planning/STATE.md
@./AGENTS.md
@.planning/quick/260410-tbn-update-the-experience-items-according-to/260410-tbn-SUMMARY.md
@app/components/skills-knowledge-map.tsx

<interfaces>
From `app/components/skills-knowledge-map.tsx`:
```tsx
<div className="relative overflow-hidden rounded-[2rem] ...">
  {/* 3D map viewport */}
  <div className="relative h-[24rem] ...">
    <div ref={viewportRef} className="absolute inset-0" />
  </div>

  <div className="mt-4 rounded-[1.4rem] ...">
    <p>Link legend</p>
    <p>Dot size = skill knowledge</p>
  </div>
</div>
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Relocate the legend beneath the map container</name>
  <files>app/components/skills-knowledge-map.tsx</files>
  <action>Refactor the lower layout of `SkillsKnowledgeMap` so the legend block currently rendered as part of the map card is moved below the map instead of inside it. Keep the existing legend content, labels, and general visual language, but separate it from the viewport wrapper so the 3D canvas card ends after the interaction hint and the legend becomes its own block beneath the map. Preserve the current selection behavior, OGL viewport structure, and recruiter-facing copy other than any minimal wording/spacing tweaks needed for the new layout. Per `AGENTS.md`, the executor should check the relevant Next.js 16 App Router/client-component guidance in `node_modules/next/dist/docs/` before changing this client component.</action>
  <verify>
    <automated>npm run lint &amp;&amp; npm run build</automated>
  </verify>
  <done>The map card no longer contains the legend panel; the legend renders as a separate section beneath the map while remaining readable and visually aligned with the surrounding layout.</done>
</task>

</tasks>

<success_criteria>
- The 3D map area ends with the map viewport and its interaction hint, without the legend embedded inside that card.
- The legend still shows both link-type and dot-size explanations, now positioned below the map.
- The knowledge map's interaction behavior and selection-driven experience filtering remain unchanged.
- `npm run lint` and `npm run build` pass after the change.
</success_criteria>

<output>
After completion, create `.planning/quick/260410-tzy-put-the-legend-under-the-map-not-inside/260410-tzy-SUMMARY.md`
</output>
