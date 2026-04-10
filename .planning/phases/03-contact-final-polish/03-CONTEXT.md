# Phase 3: Contact & Final Polish - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Make recruiter action obvious and complete the first milestone with clear outbound contact paths.

</domain>

<decisions>
## Implementation Decisions

### Contact destinations
- Keep email as the primary recruiter CTA.
- Use GitHub profile URL `https://github.com/94lama` for the secondary GitHub action.
- Use LinkedIn profile URL `https://www.linkedin.com/in/riccardo-la-malfa` for the secondary LinkedIn action.

### Portfolio constraints
- Keep the portfolio as a single-page experience.
- Preserve `public/assets/cv.md` as the source of truth for contact data.

### the agent's Discretion
Final CTA placement, supporting copy, and release-polish details are at the agent's discretion as long as recruiter contact remains obvious and high-signal.

</decisions>

<code_context>
## Existing Code Insights

- Phase 2 already rebuilt the page into a recruiter-focused one-page portfolio.
- The shared content model already supports optional `github` and `linkedin` fields on `contact`.
- The current blocker is missing authored contact URLs, not a missing contact-data shape.

</code_context>

<specifics>
## Specific Ideas

- Add the GitHub and LinkedIn URLs to the authored CV source rather than hardcoding them in the page.
- Make the secondary contact actions visible near the primary email CTA and in the contact section.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
