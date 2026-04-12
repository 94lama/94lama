---
quick_task: 260412-hzh
type: quick
autonomous: true
files_modified:
  - TODO.md
  - app/components/knowledge-experience-coordinator.tsx
  - app/components/legal-embed-footer.tsx
  - app/components/skills-knowledge-map.tsx
  - package.json
  - package-lock.json
  - public/assets/cv.md
  - public/cookie-anchor.html
  - public/privacy-anchor.html
---

<objective>
Commit all currently tracked worktree changes.

Purpose: Capture the current state of the repository exactly as it stands, including modified and deleted tracked files.
Output: One code commit containing every currently tracked change in the worktree.
</objective>

<context>
@.planning/STATE.md
@./AGENTS.md

<interfaces>
From git status:
```text
All currently tracked modified and deleted files in the worktree.
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Stage and commit the entire current tracked worktree</name>
  <files>Current tracked git changes</files>
  <action>Stage every currently tracked modified and deleted file exactly as it appears in the worktree and create a single commit that accurately summarizes the combined change set. Do not add untracked files unless they are quick-task artifacts required by this workflow. Do not alter file contents as part of this task; the request is to commit the current state, not to modify it further.</action>
  <verify>
    <automated>git status --short</automated>
  </verify>
  <done>All currently tracked modified and deleted files are committed, and the remaining worktree only contains any expected untracked quick-task artifacts before the final docs commit.</done>
</task>

</tasks>

<success_criteria>
- All currently tracked modified and deleted files are included in one commit.
- No extra content changes are introduced.
- `git status --short` shows the tracked worktree is clear aside from quick-task docs before the final docs commit.
</success_criteria>

<output>
After completion, create `.planning/quick/260412-hzh-commit-all-changes/260412-hzh-SUMMARY.md`
</output>
