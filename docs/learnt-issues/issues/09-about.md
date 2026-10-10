Part of {{EPIC}} · Blocked by {{CHIP}}, {{LAYOUT}}

## Scope

Rewrite `src/pages/about.astro` to match the mockup.

1. **H1:** "Killed by Google, but every headstone says what it taught me." Then the teacher-keeps-receipts intro.
2. **The proof-of-work standard.** An eight-item checklist:
   - the problem;
   - a public repo;
   - a live demo;
   - screenshots;
   - what was hard;
   - what I learned;
   - lifespan;
   - lineage.

   Credit the Vets Who Code portfolio checklist.
3. **Why not seedling, budding, evergreen?** A short explanation of the new stages, with a link to the planned article (placeholder until it's published).
4. **Where everything else lives:** three cards for the Blog, the Garden (`garden.developingdvlpr.com`, the Rolodex of terms) and the Tracker (`isnerandodoneyet.com`).
5. **Still alive, so not composted yet:** pills generated from Sprout projects; not hard-coded.

## Acceptance criteria

- [ ] The Sprout list updates automatically from the collection.
- [ ] The article link is clearly a placeholder (or hidden) until the post is live.

## Testing

- **End-to-end:**
  - the number of pills equals the number of Sprout projects in the collection;
  - each pill links to a valid detail page;
  - the three sister-site cards link to the right domains.
- **Content:** in CI, search the built `dist/about/index.html` for `[` placeholders, so a draft placeholder can't ship by accident.
- **Accessibility:** axe in both themes; the checklist is a real `<ul>`, and the ✓ marks are `aria-hidden`.
- **Visual:** screenshots at 360px and 1280px, in both themes.

## Suggestions

- Link "Vets Who Code portfolio checklist" to the source, if it's public.
- Add a short "How this site is built" footnote (Astro, content collections, Netlify) and link the repo. That's proof of work for the site itself.
- Reuse the `STAGES` map from {{CHIP}} for the stage explanation, so the copy never drifts from the chips.
