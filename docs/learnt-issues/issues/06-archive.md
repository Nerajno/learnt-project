Part of {{EPIC}} · Blocked by {{DATA}}, {{CHIP}}, {{LAYOUT}}

## Bug in the current page

`src/pages/learnt.astro` reads filters from `Astro.url.searchParams`. The site builds as static output (`astro.config.mjs` sets no `output`), so the page renders once at build time with empty params. **Search and every filter do nothing on the live site,** and the footer's `?category=` links show the unfiltered list.

## Scope

1. **Filter in the browser.** Render every card at build time with `data-stage`, `data-year`, `data-category` and a `data-search` text blob. Filter them with a small script (or a Vue island; Vue is the core stack). Sync the filters to the URL (`?stage=composted&year=2024&q=rails`) so filtered views can be shared, and restore them on load.
2. **Cut the controls down** to:
   - search (title, stack, learnings);
   - stage toggle buttons showing counts (All, Sprout, Shipped, Composted, Seed), with `aria-pressed`;
   - year;
   - sort: newest first, longest lived, shortest lived.

   Remove the difficulty, technology, phase and tag dropdowns, and the list of around 120 tags. Tags stay as links on detail pages.
3. **New `ProjectCard.astro`:**
   - chip and date;
   - title linking to the detail page;
   - one-line blurb;
   - optional note line in `--amber-text` (lifespan or superseded by);
   - "category · stack" in mono;
   - a "Proof:" row with Repo, Demo (only when `liveUrl` exists) and Post-mortem.

   Composted cards use `--compost-bg` and `--compost-line`.
4. **Result line and empty state:** "Showing N of 42" plus the active filters. The empty state reads "Nothing planted here yet. Seeds show up once an idea has a README."

## Acceptance criteria

- [ ] On the deployed site, `/learnt?stage=composted` shows only Composted projects.
- [ ] Filtering doesn't reload the page; Back and Forward restore the previous filter.
- [ ] Without JavaScript, all projects still render.
- [ ] The grid is 3, 2 or 1 columns at roughly 980px and 640px breakpoints.

## Testing

- **Unit:** pull the filter logic into a pure `filterProjects(items, { q, stage, year, sort })` and test it:
  - search matches title, stack and learnings, ignoring case;
  - stage and year combine (AND);
  - each sort orders correctly, and ties are stable;
  - parsing the URL string and building it back gives the same filters.
- **End-to-end:**
  - `/learnt?stage=composted` shows only Composted cards, and the Composted button has `aria-pressed="true"`;
  - typing "rails" narrows the results with no page navigation (assert the URL changes but `page.on('framenavigated')` doesn't fire);
  - Back restores the previous filter;
  - "All" resets the view;
  - an impossible combination shows the empty state;
  - with JavaScript off (`javaScriptEnabled: false`), all 42 cards render.
- **Regression for the current bug:** run against `astro preview` (static output), not `astro dev`, so the test proves filtering works after the build.
- **Accessibility:**
  - axe in both themes;
  - after filtering, the result count is announced (`aria-live="polite"` on the count);
  - the filter buttons work with the keyboard.
- **Visual:** default, Composted-only and empty-state screenshots, in both themes.

## Suggestions

- If you use a Vue island (`client:idle`), keep it to the filter bar only; the cards stay static HTML for speed.
- Debounce search by about 150ms.
- Use `history.replaceState` for typing, and `pushState` only for discrete filter changes, so Back doesn't step through every keystroke.
- A "Copy link to this view" button is cheap and fits the shareable-filter goal.
- Add a `/learnt/compost` shortcut redirect (Netlify `_redirects`) for the graveyard-only view.
