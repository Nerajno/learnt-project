# #21 Timeline view Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a timeline view to the `/learnt` archive. It shows the cards grouped by the year each project ended, it can be switched on from the grid, and it respects the same filters.

**Architecture:**
- A pure selector (`src/lib/timeline.ts`) groups projects by the year they ended.
- `ArchiveTimeline.astro` server-renders that grouping.
- The existing client filter script (`src/scripts/archive-filter.ts`) shows or hides timeline rows by slug, in the same way it already hides cards.
- A new `view` filter (`grid` | `timeline`) lives in the URL (`?view=timeline`) next to the other filters.

**Tech Stack:** Astro 5, TypeScript, Vitest + Astro Container API, Playwright + `@axe-core/playwright`, dvlpr-dialects tokens.

**Spec:** https://github.com/Nerajno/learnt-project/issues/21. The user skipped brainstorming, so this plan's "Decisions" section stands in for the spec.

## Decisions (my calls; the user didn't specify these)
- **Year of a project:**
  - shipped or composted with a `died` date: the year of `died`
  - otherwise (seed, sprout, or no `died`): the year of `born`
- **Order:** years newest first; within a year, by that same date, newest first, then by title.
- **Icon:** no project has `causeOfDeath` yet (#25), so each row uses `StageChip` with `cause={project.causeOfDeath}`. The cause shows automatically once the data has it. No new icon set.
- **Stats:** the archive already shows computed stat cards (`data-stat`, from `getStats`, tested in `stage-ui.spec.ts`), so no second stats line.
- **Sort:** sort doesn't apply in the timeline, which always uses year order. The other filters (q, stage, category, year) do apply.
- **Coursework:** coursework stays in its own list, below the timeline as well.
- **Motion:** the timeline adds no animation or transition.

## Global Constraints
- Use tokens only (`--bg-card`, `--border`, `--text-*`, `--accent`, `--success`, `--warning`, `--radius-*`). No new gray/blue Tailwind colors.
- The grid is the default view, and `buildQuery` leaves out `view` when it is `grid`.
- Commits end with `Facilitated-by: Claude Opus 5.5 <noreply@anthropic.com>`. No Co-Authored-By.
- Playwright serves `dist`, so run `npm run build` before E2E.
- If `npm install` rewrites `@nerajno/dialects` in `package-lock.json` to `git+ssh`, revert it to `git+https`.
- The PR carries #21's labels: `enhancement`, `phase:3-ui`.

## Review Focus
1. The grid is filtered (e.g. `?stage=composted`) and the user switches to the timeline: the same projects show, and year groups with no visible rows are hidden. (Task 3 E2E)
2. A deep link to `?view=timeline&year=2024` opens straight into the timeline, filtered. (Task 3 E2E)
3. Every filter hides everything in the timeline: the empty state shows, and no orphan year headings remain. (Task 3 E2E)
4. JS is disabled: the grid still renders and the timeline stays `hidden`, never both. (Task 2 unit test: the timeline renders with the `hidden` attribute)
5. Keyboard and screen reader: the toggle is two buttons with `aria-pressed`, and the active one is announced. (Task 3 E2E + axe)

---

### Task 1: Selector `getTimeline` + `view` filter

**Files:**
- Create: `src/lib/timeline.ts`
- Modify: `src/lib/archive.ts`, to add `view` to `ArchiveFilters`, `DEFAULT_FILTERS`, `parseFilters`, `buildQuery`
- Test: `tests/unit/timeline.test.ts`, and extend the existing `parseFilters`/`buildQuery` tests (`grep -rl parseFilters tests`)

**Interfaces:**
- Produces:
  - `type ArchiveView = 'grid' | 'timeline'`
  - `ArchiveFilters.view: ArchiveView` (default `'grid'`)
  - `endYear(p: Project): number`
  - `interface TimelineYear { year: number; projects: Project[] }`
  - `getTimeline(all: Project[] = getCardProjects()): TimelineYear[]`

- [ ] **Step 1: Write the failing tests.** Use `makeProject` from `tests/unit/fixtures.ts`.
  - `endYear` uses `died` for a composted project (`born 2022-05-01`, `died 2023-02-01` → `2023`) and for a shipped one.
  - `endYear` uses `born` for a sprout, even when `died` is set.
  - `getTimeline` puts years in descending order and projects within a year newest first. A tie on the date sorts by title.
  - `getTimeline([])` returns `[]`.
  - `parseFilters('?view=timeline').view === 'timeline'`. `parseFilters('?view=bogus').view === 'grid'`.
  - `buildQuery({...DEFAULT_FILTERS, view: 'timeline'}) === '?view=timeline'`. `buildQuery(DEFAULT_FILTERS) === ''`.
- [ ] **Step 2:** Run `npx vitest run tests/unit/timeline.test.ts $(grep -rl parseFilters tests/unit)`. Expected: FAIL (module/export missing).
- [ ] **Step 3:** Implement. `view` goes last in `buildQuery`'s order.
- [ ] **Step 4:** Rerun. Expected: PASS. `npm run typecheck` shows 0 errors.
- [ ] **Step 5:** Commit: `feat: add timeline selector and view filter (#21)`.

### Task 2: `ArchiveTimeline.astro`

**Files:**
- Create: `src/components/ArchiveTimeline.astro`
- Test: `tests/unit/ArchiveTimeline.test.ts`

**Interfaces:**
- Consumes: `getTimeline`, `TimelineYear`, `endYear` (Task 1); `StageChip` (props `stage`, `cause`).
- Produces the markup that Task 3's script relies on:
  - `<section id="project-timeline" aria-labelledby="timeline-h" hidden>`, with `<h2 id="timeline-h" class="sr-only">Timeline</h2>`
  - `<ol role="list">` of `<li data-year-group="{year}">`, each holding `<h3>{year}</h3>` and an `<ol role="list">` of rows
  - row: `<li data-slug="{slug}">` containing `StageChip`, `<a href="/learnt/{slug}">{title}</a>`, `short`, and `<time datetime="{born}">` plus, when set, `<time datetime="{died}">`

- [ ] **Step 1: Write the failing tests.** Props: `{ years: TimelineYear[] }`.
  - Two years render as two `data-year-group` items, in the order given.
  - The section has the `hidden` attribute (Review Focus 4).
  - A row links to `/learnt/{slug}` and includes a `.stage-chip[data-stage]`.
  - A sprout row has no `died` `<time>`.
  - Empty `years` renders the section with no groups.
- [ ] **Step 2:** Run `npx vitest run tests/unit/ArchiveTimeline.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement. It's a vertical rule (`border-left: 1px solid var(--border-strong)`) with each year as a marker. No `transition` or `animation` properties. Rows use the ledger row style from `src/pages/index.astro` `.rows`.
- [ ] **Step 4:** Rerun. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: add archive timeline component (#21)`.

### Task 3: Wire into `/learnt`, add the toggle, filter the timeline

**Files:**
- Modify:
  - `src/pages/learnt.astro`: render `<ArchiveTimeline years={getTimeline(archiveProjects)} />` after `ProjectList`
  - `src/components/SearchBar.astro`: add the toggle
  - `src/scripts/archive-filter.ts`
- Test: `tests/e2e/timeline.spec.ts`

**Interfaces:**
- Consumes: `ArchiveFilters.view`, plus the markup from Task 2.
- Toggle markup: `<div role="group" aria-label="View">` with two `<button type="button" data-view="grid|timeline" aria-pressed>`, labelled "Grid" and "Timeline".

- [ ] **Step 1: Write the failing E2E tests** in `tests/e2e/timeline.spec.ts`:
  - **Toggle:** click "Timeline". The URL ends with `?view=timeline`, `#project-timeline` is visible, `#project-list` is hidden, and the Timeline button has `aria-pressed="true"`.
  - **Grouping:** the year headings equal `getTimeline().map(y => String(y.year))`. Each group's row slugs equal that year's project slugs, in order.
  - **Filters carry over (Review Focus 1):** `/learnt?stage=composted&view=timeline` shows only composted rows. Its visible row count equals `#archive-count`, and every visible `[data-year-group]` has at least one visible row.
  - **Deep link (Review Focus 2):** `/learnt?view=timeline&year=2024` makes the timeline visible. The visible row slugs equal `filterProjects(getCardProjects().map(toArchiveItem), {...DEFAULT_FILTERS, year: 2024})` slugs. The `year` filter stays born-year based, the same as the Home trail links, so a row can appear under a later end-year heading.
  - **Empty (Review Focus 3):** `?view=timeline&q=zzzz-no-match` shows `#archive-empty` and no visible `[data-year-group]`.
  - **Back button:** after toggling to the timeline, `page.goBack()` returns to the grid view.
  - **Reduced motion:** with `emulateMedia({ reducedMotion: 'reduce' })`, every element in `#project-timeline` has a computed `transition-duration` and `animation-duration` of `0s`.
  - **Width:** no horizontal scroll at 360px in the timeline view.
  - **Axe:** no serious violations in light or dark, in the timeline view.
- [ ] **Step 2:** Run `npm run build && npx playwright test tests/e2e/timeline.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - `archive-filter.ts`, `readControls` reads `view` from the pressed button.
  - In `apply`:
    - toggle `hidden` on `#project-list` and `#project-timeline` based on `filters.view`
    - set `row.hidden` for each `#project-timeline li[data-slug]` from `visibleSlugs`
    - hide each `[data-year-group]` with no visible row
    - set `aria-pressed` on the toggle buttons
  - The toggle buttons call `apply(readControls(), 'push')`.
  - Don't reorder timeline rows on sort.
- [ ] **Step 4:** Rerun that spec, then the whole suite: `npx vitest run && npm run build && npx playwright test`. Expected: all pass. The existing `archive-filters.spec.ts` and `filters.spec.ts` are unchanged and still green.
- [ ] **Step 5:** Screenshots of `/learnt?view=timeline` at 1280 (light and dark) and at 360. Review them.
- [ ] **Step 6:** Commit: `feat: add timeline view toggle to the archive (#21)`. Then run `cavecrew-reviewer` and fix the findings. Open the PR with labels `enhancement`, `phase:3-ui` and `Closes #21`.

## Done when
- The typecheck shows 0 errors.
- Vitest and Playwright are green.
- The screenshots have been reviewed.
- The reviewer's findings are handled.
- The PR is open with #21's labels.
