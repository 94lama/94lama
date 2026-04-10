---
quick_task: 260410-trc
type: quick
autonomous: true
files_modified:
  - app/components/skills-knowledge-map.tsx
---

<objective>
Increase the visual opacity of unselected dots in the 3D knowledge map so non-focused nodes remain easier to perceive while the selected node and its neighbors still read as the active focus.

Purpose: Improve map legibility for recruiters by reducing how much non-selected nodes fade during selection states.
Output: Adjusted node highlight/alpha logic in the knowledge-map client component.
</objective>

<context>
@.planning/STATE.md
@./AGENTS.md
@.planning/quick/260410-tbn-update-the-experience-items-according-to/260410-tbn-SUMMARY.md
@app/components/skills-knowledge-map.tsx

<interfaces>
From `app/components/skills-knowledge-map.tsx`:
```ts
function syncHighlight(
  scene: SceneState | null,
  nodeMap: Map<string, GraphNode>,
  selectedNodeId: string,
) { /* updates uAlpha, uGlow, scale, and colors for nodes/edges */ }
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Raise the baseline visibility of non-selected map nodes</name>
  <files>app/components/skills-knowledge-map.tsx</files>
  <action>Update the node emphasis logic inside `syncHighlight` so unselected dots retain noticeably higher opacity than the current faded state while selected and neighboring nodes still remain visually dominant. Keep the current interaction model, color system, glow behavior, and scale hierarchy intact; only rebalance the baseline dimming values so the graph stays readable without flattening the focus contrast. Because this is a client component in a Next.js 16 app, the executor should check the relevant App Router/client-component guidance in `node_modules/next/dist/docs/` before making changes, per `AGENTS.md`.</action>
  <verify>
    <automated>npm run lint &amp;&amp; npm run build</automated>
  </verify>
  <done>When a node is selected, non-selected dots remain clearly visible at higher opacity, but the selected node and its linked neighbors still stand out as the active cluster.</done>
</task>

</tasks>

<success_criteria>
- Unselected dots in the knowledge map are visibly less faded during selection states.
- Selected and neighboring dots still have stronger emphasis than unrelated dots.
- No changes are made to map behavior beyond highlight styling.
- `npm run lint` and `npm run build` pass after the change.
</success_criteria>

<output>
After completion, create `.planning/quick/260410-trc-increase-the-opacity-of-the-unselected-d/260410-trc-SUMMARY.md`
</output>
