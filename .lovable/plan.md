# Complete Live Project details and improve the unlocked experience

## Goal
Make every available project detail easy to read after a member applies their personal Project Accessible Code, while keeping protected details hidden from everyone else.

## Changes
- Replace the truncated unlocked cards with a clear summary card plus a full project-details view.
- Show the complete brief, company name, website, contact person, contact email, application link, duration, location, stipend, openings, skills, and interview requirement when those values exist.
- Add an obvious “Access unlocked” confirmation and keep one primary application action per project.
- Keep locked cards privacy-safe: protected company, contact, title, and application data remain absent until the signed-in member redeems their own code.
- Improve phone, tablet, and desktop layouts using the existing golden-ratio spacing and 60-30-10 design tokens, with accessible controls and stable card sizing.
- Improve Live Projects page search metadata and structured project-list data without exposing locked details to page markup.
- Refine shared navigation and the homepage Live Projects entry so the main path remains understandable within three clicks across devices.

## Verification
- Test a signed-in member with a redeemed code and confirm complete stored project details appear.
- Confirm signed-out and signed-in locked states never expose protected details in the page content.
- Check the board at mobile and desktop sizes, including search, filters, detail view, website/email links, and application actions.
- Confirm the current app build has no errors.

## Technical details
- Keep `list_live_projects()` as the server-side privacy boundary and continue deriving access from the authenticated user.
- Refetch project data immediately after successful redemption so the current screen cannot retain masked cached rows.
- Render full details only when the RPC returns `unlocked: true`; do not query the protected base table from the browser.
