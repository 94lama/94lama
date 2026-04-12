---
quick_task: 260412-hky
type: quick
autonomous: true
files_modified:
  - app/page.tsx
---

<objective>
Change the section `06` contact links from text links/cards to icon-based actions.

Purpose: Make the secondary contact actions in the dedicated contact section more compact and visually aligned with the UI refresh while preserving the existing destinations.
Output: Updated section `06` contact CTA area using icon buttons for GitHub and LinkedIn.
</objective>

<context>
@.planning/STATE.md
@./AGENTS.md
@app/page.tsx

<interfaces>
From `app/page.tsx`:
```tsx
{secondaryContactActions.map((action) => (
  <ContactLink ... />
))}
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Replace section 06 secondary contact links with icons</name>
  <files>app/page.tsx</files>
  <action>Update the dedicated section `06` contact area so the GitHub and LinkedIn secondary actions render as compact icon buttons instead of text pills/cards. Keep the existing href targets, accessibility, and visual system intact. Limit the change to section `06`: the hero-area contact actions can stay as they are. Remove any now-redundant GitHub/LinkedIn text cards from section `06` so the contact block does not duplicate the same links in two different formats.</action>
  <verify>
    <automated>npm run build</automated>
  </verify>
  <done>Section `06` shows icon-based GitHub and LinkedIn actions, the links still work, duplicate text link cards are removed, and the page builds successfully.</done>
</task>

</tasks>

<success_criteria>
- Section `06` uses icon buttons for GitHub and LinkedIn.
- The underlying destinations and accessibility remain intact.
- Duplicate GitHub/LinkedIn text cards in section `06` are removed.
- `npm run build` passes.
</success_criteria>

<output>
After completion, create `.planning/quick/260412-hky-change-the-link-in-06-contact-to-icons/260412-hky-SUMMARY.md`
</output>
