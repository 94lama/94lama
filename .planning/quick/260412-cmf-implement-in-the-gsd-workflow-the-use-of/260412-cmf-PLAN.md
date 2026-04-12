---
quick_task: 260412-cmf
type: quick
autonomous: true
files_modified:
  - .opencode/get-shit-done/bin/lib/init.cjs
  - .opencode/get-shit-done/workflows/quick.md
---

<objective>
Make the quick workflow treat the repo-root `TODO.md` as the user-requested modification backlog without disturbing the existing `.planning/todos` capture flow.

Purpose: Let `/gsd-quick` pull useful backlog context from `TODO.md`, optionally pick a task from it when no description is given, and mark the chosen item done after a successful quick run.
Output: A minimal quick-workflow update plus small init support that surfaces `TODO.md` items to the workflow.
</objective>

<context>
@.planning/STATE.md
@./AGENTS.md
@TODO.md
@.planning/PROJECT.md
@.opencode/get-shit-done/workflows/quick.md
@.opencode/get-shit-done/workflows/add-todo.md
@.opencode/get-shit-done/workflows/check-todos.md
@.opencode/get-shit-done/workflows/progress.md
@.opencode/get-shit-done/workflows/resume-project.md
@.opencode/get-shit-done/bin/lib/init.cjs
@.opencode/get-shit-done/bin/lib/commands.cjs

<interfaces>
From `.opencode/get-shit-done/bin/lib/init.cjs`:
```cjs
function cmdInitQuick(cwd, description, raw) {
```

From `.opencode/get-shit-done/workflows/quick.md`:
```md
**Step 1: Parse arguments and get task description**
...
If `$DESCRIPTION` is empty after parsing, prompt user interactively
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Expose open TODO.md items through quick init</name>
  <files>.opencode/get-shit-done/bin/lib/init.cjs</files>
  <action>Extend `cmdInitQuick()` to inspect the repo-root `TODO.md` when it exists and return structured backlog metadata alongside the existing quick-task fields. Parse only unchecked list items (`- [ ] ...`), include enough data for the workflow to present and later complete an item deterministically (at minimum: section heading, item text, and source line number), and add flags/counts such as `todo_md_exists` and `todo_md_item_count`. Keep this scoped to top-level `TODO.md` support for quick mode only: do not alter `cmdInitTodos()`, `.planning/todos/*`, or the semantics of `/gsd-add-todo` and `/gsd-check-todos`.</action>
  <verify>
    <automated>node --check ".opencode/get-shit-done/bin/lib/init.cjs" && node ".opencode/get-shit-done/bin/gsd-tools.cjs" init quick "" --raw | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{const j=JSON.parse(s);if(j.todo_md_exists!==true) process.exit(1);if(!Array.isArray(j.todo_md_items)||!j.todo_md_items.some(i=>i.text==='Use blue instead of green as primary color')) process.exit(1);});"</automated>
  </verify>
  <done>`init quick` returns the existing quick metadata plus structured open `TODO.md` items, and the internal `.planning/todos` init flow remains unchanged.</done>
</task>

<task type="auto">
  <name>Task 2: Let quick intake choose work from TODO.md and carry it into planning</name>
  <files>.opencode/get-shit-done/workflows/quick.md</files>
  <action>Update the quick workflow so that when `$DESCRIPTION` is empty it first loads the `TODO.md` backlog via `init quick ""`, offers the unchecked items as selectable work, and still allows a custom freeform description when the user does not want a listed item. After a TODO item is selected, rerun the normal quick init with the chosen description so slug/task-dir generation stays correct. Also inject `TODO.md` into the planner context (and executor context if needed for continuity) so quick plans can use the backlog as implementation context. Preserve the existing quick flow for users who already provided a description, and avoid changing `add-todo.md`, `check-todos.md`, `progress.md`, or `resume-project.md` unless a tiny wording sync is strictly required.</action>
  <verify>
    <automated>node -e "const fs=require('fs');const text=fs.readFileSync('.opencode/get-shit-done/workflows/quick.md','utf8');const checks=['TODO.md','init quick \"\"','custom freeform description'];if(!checks.every(c=>text.includes(c))) process.exit(1);"</automated>
  </verify>
  <done>The quick workflow can bootstrap from `TODO.md` when no description is supplied, still accepts ad-hoc descriptions, and passes `TODO.md` into quick planning context without touching the internal `.planning/todos` workflows.</done>
</task>

<task type="auto">
  <name>Task 3: Mark the selected TODO.md item complete after a successful quick run</name>
  <files>.opencode/get-shit-done/workflows/quick.md</files>
  <action>Add a completion step to the quick workflow that runs only when the task originated from a selected `TODO.md` item. After executor success (and after verification when enabled), flip the exact source line in `TODO.md` from `- [ ]` to `- [x]` using the stored line number/text guard so the workflow does not mark the wrong item if the file drifted mid-run. Include `TODO.md` in the final docs commit file list only when it was changed. If the task was entered manually, or if the selected line no longer matches, leave `TODO.md` untouched and continue normally rather than guessing.</action>
  <verify>
    <automated>node -e "const fs=require('fs');const text=fs.readFileSync('.opencode/get-shit-done/workflows/quick.md','utf8');const checks=['- [x]','TODO.md','line number','final docs commit file list'];if(!checks.every(c=>text.includes(c))) process.exit(1);"</automated>
  </verify>
  <done>A quick task chosen from `TODO.md` can mark its originating checkbox complete after success, while manual quick tasks and mismatched TODO edits are left unchanged.</done>
</task>

</tasks>

<success_criteria>
- `/gsd-quick` can treat `TODO.md` as backlog context without breaking `.planning/todos` behavior.
- When no description is provided, the workflow can offer open `TODO.md` items plus a custom-entry path.
- Quick planning receives `TODO.md` as context.
- A TODO-backed quick task can mark the corresponding `TODO.md` checkbox complete after success.
- If no TODO item was selected, the workflow behaves like today.
</success_criteria>

<output>
After completion, create `.planning/quick/260412-cmf-implement-in-the-gsd-workflow-the-use-of/260412-cmf-SUMMARY.md`
</output>
