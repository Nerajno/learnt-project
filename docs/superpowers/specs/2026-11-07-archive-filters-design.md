# Archive filters — design (issue #42)

## Intent

Make the archive's search, stage, category, year, and sort controls work on the
deployed static site, with shareable URLs and Back/Forward support.

Today `src/pages/learnt.astro` reads `Astro.url.searchParams` at build time, when
they are always empty. `SearchBar` submits a GET that only updates a summary
string, and the footer's `?category=` links are equally dead. The page is static,
so filtering has to happen in the browser over cards rendered at build time.

Part of epic #32 (phase 1). Blocks #22 and the `?year=` test in #45; part of #47.

## Goals

- Filter without a page navigation: search, stage, category, year, sort.
- The URL is the source of truth: `?q=&stage=&category=&year=&sort=`.
- Back/Forward restore previous filters; reload restores the same view.
- Without JavaScript, every project still renders.
- Footer category links (`/learnt?category=frontend`) filter correctly.
- Keyboard accessible, `aria-pressed` on stage buttons, result count in an
  `aria-live="polite"` region, visible focus.
- Pure filter logic unit-tested; the static preview covered by Playwright.

## Non-goals

- `causeOfDeath` and `tier` filters — those fields do not exist yet (#15/#16);
  #22 adds cause after the schema lands.
- Server-side filtering, `output: 'server'`, or an API endpoint.
- Pagination (#3), difficulty/technology/phase/tag filters (removed per #42).
- The real `stage` schema (#39).
- Restyling the page — #38/#41/#45 do that later.

## Constraints

- Static output; no Vue or other framework installed. Vanilla TypeScript script.
- Current data has `status` + `phase`, not `stage`.
- `ProjectCard.astro` is the only card renderer; cards already render at build.
- E2E runs via `npm run test:e2e`, which builds first and previews on
  `127.0.0.1:4321`. The developer's `astro dev` binds only `[::1]`, so they do
  not collide. Tests exercise the built site, which is the point of this bug.
- `tests/e2e/filters.spec.ts` already pins #42 as two `test.fail(...)`
  known-bug tests (category narrows the list; unknown category shows none).
  The fix must remove those `test.fail` markers, or they will fail as
  "expected to fail but passed".
- Screenshots are placeholders (#43 merged); unrelated here but cards have no
  `<img>` today.

## Approach

Chosen: **vanilla TS island + server-rendered cards** (option A).

- All projects render at build inside `ProjectList` / `ProjectCard`.
- Each card carries `data-stage`, `data-category`, `data-year`, `data-born`,
  `data-died`, and a lowercase `data-search` blob (title, description,
  technologies, tags, learnings).
- One small `<script>` serialises the filter state to the URL and toggles
  `hidden` on cards.
- Pure logic lives in `src/lib/archive.ts` so Vitest can test it without a DOM.

### `src/lib/archive.ts`

```ts
export type Stage = 'seed' | 'sprout' | 'shipped' | 'composted';
export type Sort = 'newest' | 'oldest' | 'longest' | 'shortest';

export interface ArchiveFilters {
  q: string;
  stage: Stage | '';
  category: string;
  year: number | null;
  sort: Sort;
}

export const DEFAULT_FILTERS: ArchiveFilters;
export const STAGES: { value: Stage; label: string }[];

export function parseFilters(search: string): ArchiveFilters; // ignores unknown params
export function buildQuery(filters: ArchiveFilters): string;  // omits defaults, stable order
export function deriveStage(project: Project): Stage;         // TODO(#39)
export function lifespanDays(project: Project): number | null;
export function matchesFilters(project: Project, filters: ArchiveFilters): boolean;
export function sortProjects(projects: Project[], sort: Sort): Project[];
export function filterProjects(projects: Project[], filters: ArchiveFilters): Project[];
```

`deriveStage` is the temporary bridge for #39:

| status      | phase              | stage     |
| ----------- | ------------------ | --------- |
| planned     | any                | seed      |
| in-progress | any                | sprout    |
| completed   | active / archived  | shipped   |
| completed   | sunset             | composted |
| archived    | any                | composted |

Marked `TODO(#39)` in one place. Delete it when the real `stage` field lands.
`side-project-status` and `burble-v1` are the two review cases #39 already names.

`lifespanDays` uses `dateCreated ?? dateStarted` → `dateCompleted ?? sunsetDate ??
dateSunset`; for `seed`/`sprout` with no end date it returns `null` (not "today"),
so "longest lived" never silently ages open projects. Open-ended projects have no
lifespan and sort last in both length sorts.

### Page and components

- `src/pages/learnt.astro`: remove the build-time filter block. Render all
  projects, the stage counts, and the result line. Initial state is provided as
  JSON (or read from the URL by the script) — the script applies filters after
  paint. Keep an empty-state block hidden by default; the script reveals it.
- `src/components/SearchBar.astro`: rewrite as the archive filter bar:
  - search input;
  - four stage toggle buttons (All, Seed, Sprout, Shipped, Composted) with
    build-time counts and `aria-pressed`;
  - category, year, sort selects (category keeps the footer links working);
  - "Clear all" button;
  - no advanced filter toggle, no 120-tag list.
  Keep it a real `<form method="get" action="/learnt">` for graceful degradation.
- `src/components/ProjectCard.astro`: add the data attributes to the root
  `<article>`; accept no new props beyond the existing `project`.
- Script: `src/scripts/archive-filter.ts`, imported by `learnt.astro` with
  `<script>`. Responsibilities:
  - parse URL on load, apply filters, set control state;
  - `input` on search → debounce ~150ms → `history.replaceState`;
  - `change` on selects / click on stage buttons → apply → `history.pushState`;
  - `popstate` → re-parse and apply;
  - update result count text and empty state;
  - `Escape`/clear resets to `/learnt`.

### Decisions

1. **Stage derived temporarily** (user-approved option 1), isolated in
   `deriveStage`, tested.
2. **Category stays** (as a select and URL param) so the three footer links work.
3. **Cause/tier deferred** to #22 after #15/#16.
4. **Vanilla TS**, not Vue.
5. Sorts: newest (default), oldest, longest lived, shortest lived. Stable
   tiebreak by `title`.
6. Unknown query params are ignored; canonical URL only emits non-defaults.

## Testing

### Unit — `tests/archive.test.ts`

- search is case-insensitive and matches title/description/technologies/tags;
- filters combine with AND;
- each sort is ordered and stable;
- `parseFilters`/`buildQuery` round-trip, and unknown params are ignored;
- `deriveStage` covers all six status/phase combinations;
- `lifespanDays` handles end-dated, open-ended, and missing dates.

### E2E — `tests/e2e/archive-filters.spec.ts` (built preview via `npm run test:e2e`)

- `/learnt?stage=composted` shows only composted cards; the button is
  `aria-pressed="true"`;
- typing "rails" updates the URL without a navigation and narrows the list;
- Back restores the previous filters;
- an impossible combination shows the empty state and count "Showing 0 of 42";
- `javaScriptEnabled: false` renders all 42 cards;
- `/learnt?category=frontend` filters (footer link contract);
- axe: no serious/critical violations in light and dark on `/learnt`.

Add `@axe-core/playwright` as a dev dependency; #47 will reuse it.

## Files touched

- `src/lib/archive.ts` (new)
- `src/scripts/archive-filter.ts` (new)
- `src/pages/learnt.astro`
- `src/components/SearchBar.astro`
- `src/components/ProjectCard.astro`
- `src/components/ProjectList.astro` (pass the project through unchanged; only
  if a wrapper is needed)
- `tests/archive.test.ts` (new)
- `tests/e2e/archive-filters.spec.ts` (new)
- `package.json` / `package-lock.json` (axe dev dependency)

## Risks and mitigations

- **Derived stage diverges from #39.** One tested mapping, labelled `TODO(#39)`;
  the real field replaces it in phase 2.
- **HTML size.** ~42 cards × a short lowercase blob; a few KB before gzip.
- **Hidden cards and CSS.** Use the `hidden` attribute; verify no `display`
  utility on the card root overrides it.
- **Back/Forward noise.** `replaceState` while typing, `pushState` for discrete
  changes; no history entry per keystroke.
- **No-JS.** All cards render; controls remain a normal GET form, so nothing
  breaks even though filtering needs JavaScript.
- **E2E port collision.** Use the repository's existing e2e config (`npm run
  test:e2e` builds, then previews on `127.0.0.1:4321`); never test against
  `astro dev`.
- **Known-bug tests.** Remove the two `test.fail` markers in
  `tests/e2e/filters.spec.ts` once category filtering works; otherwise the
  suite fails because they unexpectedly pass.
