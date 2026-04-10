---
quick_task: 260410-swt
type: quick
autonomous: true
files_modified:
  - app/components/skills-knowledge-map.tsx
  - package.json
  - package-lock.json
---

<objective>
Turn the skills section into a real interactive 3D knowledge map using OGL so visitors can drag to rotate the graph in 3D and select a node to highlight its immediate neighboring nodes and edges.

Purpose: Replace the faux-3D presentation with an actual interaction model while preserving the existing CV-driven skills data and surrounding portfolio layout.
Output: An OGL-powered client component with drag rotation, node picking, neighbor highlighting, and synchronized detail controls.
</objective>

<context>
@.planning/STATE.md
@app/page.tsx
@app/components/skills-knowledge-map.tsx
@src/content/portfolio/types.ts
@package.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Build the OGL-rendered graph scene</name>
  <files>app/components/skills-knowledge-map.tsx</files>
  <action>Replace the static faux-3D skills display with an OGL scene that builds graph nodes and edges from `skillGroups`, renders them in 3D space, supports drag-based rotation, and uses projected pointer hit testing so a clicked or tapped node becomes the active selection.</action>
  <verify>
    <automated>rg -n "Renderer|Camera|Program|pointerdown|pickNode|projectedNodes" app/components/skills-knowledge-map.tsx</automated>
  </verify>
  <done>The knowledge map is a real 3D graph that users can rotate directly and interact with through pointer selection.</done>
</task>

<task type="auto">
  <name>Task 2: Sync selection state and ship the dependency</name>
  <files>app/components/skills-knowledge-map.tsx, package.json, package-lock.json</files>
  <action>Add the `ogl` dependency and wire the selected graph node back into the surrounding UI so category buttons, skill chips, and the selected-node panel all stay aligned with graph focus while the selected node highlights its immediate neighboring nodes and edges.</action>
  <verify>
    <automated>rg -n '"ogl"' package.json && npm run lint && npm run build</automated>
  </verify>
  <done>The portfolio UI and the 3D canvas stay in sync, and the OGL-based implementation passes project validation.</done>
</task>

</tasks>

<success_criteria>
- The skills section uses OGL rather than a static CSS-only faux-3D layout.
- Visitors can drag the graph to rotate it in 3D.
- Selecting a node highlights its immediate neighboring nodes and connected edges.
- Category buttons and skill chips still control the active selection.
- `npm run lint` and `npm run build` pass.
</success_criteria>

<output>
After completion, create `.planning/quick/260410-swt-the-knowledge-map-has-to-be-interactive-/260410-swt-SUMMARY.md`
</output>
