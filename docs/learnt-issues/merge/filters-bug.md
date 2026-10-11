Part of #32 · Phase 1 (fixes) · Blocks #22

## Bug

`src/pages/learnt.astro` reads every filter from `Astro.url.searchParams`. `astro.config.mjs` sets no `output`, so the site builds as **static**: the page renders once at build time, when the params are always empty. **On the live site, search and every filter do nothing,** and the footer's `?category=` links show the unfiltered list. #22 (shareable `?cause=` URLs) would hit the same wall.

## Scope

1. **Render every card at build time** with `data-stage`, `data-cause`, `data-tier`, `data-year`, `data-category` and a lowercase `data-search` blob (title, stack, learnings).
2. **Filter in the browser** with a small script or a Vue island on the filter bar only. Sync the filters to the URL (`?stage=composted&cause=superseded&year=2024&q=rails`) and restore them on load.
3. **Cut the controls down** to search, stage buttons with counts, cause of death (#22), year and sort (newest, longest lived, shortest lived). Drop the difficulty, technology and phase dropdowns and the list of around 120 tags; tags stay as links on detail pages.
4. **Result line** "Showing N of 42" with `aria-live="polite"`, and an empty state.

## Acceptance criteria

- [ ] On the deployed site, `/learnt?stage=composted` shows only Composted projects.
- [ ] Filtering doesn't reload the page; Back and Forward restore the previous filters.
- [ ] Without JavaScript, all projects still render.
- [ ] The footer category links work, or are removed.

## Testing

- **Unit:** move the logic into a pure `filterProjects(items, { q, stage, cause, year, sort })`. Test that:
  - search ignores case;
  - filters combine with AND;
  - each sort is ordered and stable;
  - parsing a URL and building it back gives the same filters.
- **End-to-end, against `astro preview` (the static build), not `astro dev`** — that's the point of this bug:
  - `?stage=composted` shows only Composted cards, and the button has `aria-pressed="true"`;
  - typing "rails" changes the URL without a navigation;
  - Back restores the previous filters;
  - an impossible combination shows the empty state;
  - with `javaScriptEnabled: false`, all cards render.
- **Accessibility:** axe in light and dark; the result count is announced; every filter works with the keyboard.

## Suggestions

- Use `history.replaceState` while typing (debounced by about 150ms) and `pushState` for discrete filter changes, so Back doesn't step through every keystroke.
- Add a Netlify `_redirects` shortcut, `/learnt/graveyard` → `/learnt?stage=composted`.
- If you'd rather keep server-side filtering, the alternative is `output: 'server'` with the Netlify adapter. That's heavier for a site that is otherwise fully static.
