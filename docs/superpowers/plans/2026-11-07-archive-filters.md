# Archive Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make search, stage, category, year, and sort work on the static `/learnt` archive, with shareable URLs, Back/Forward support, and no-JavaScript fallback.

**Architecture:** Projects are converted to a small `ArchiveItem` at build time and rendered as cards carrying `data-*` metadata. A vanilla TypeScript script reads those cards, runs the same pure `filterProjects` used by Vitest, hides non-matches, re-orders the grid, and syncs `?q&stage&category&year&sort` to the URL. No framework and no runtime dependency are added.

**Tech Stack:** Astro 5.13, TypeScript, Tailwind 3.4, Vitest 3.2, Playwright 1.64.

**Spec:** `docs/superpowers/specs/2026-11-07-archive-filters-design.md`

## Global Constraints

- Site stays static; filtering is client-side only. Do not add `output: 'server'` or an API route.
- No new runtime dependencies. Exactly one new dev dependency: `@axe-core/playwright@^4.14.0`.
- URL params and values are exactly `q`, `stage`, `category`, `year`, `sort`; stages are exactly `seed`, `sprout`, `shipped`, `composted`; sorts are exactly `newest`, `oldest`, `longest`, `shortest`.
- Card counts must come from `projects.length` and `countByStage`, never a hard-coded 42.
- E2E runs through `npm run test:e2e` (it builds first, then previews at `127.0.0.1:4321`, desktop + mobile). Never point tests at `astro dev`.
- Leave #43's `ProjectImage` placeholder behavior untouched.
- The old empty `SearchBar` script, difficulty/technology/phase/tag controls, and the build-time `searchParams` filter block are removed.

## Review Focus

- An untracked or invalid query (`?utm_source=x`, `?stage=dead`) must show the full list, not the empty state.
- The `.card` class must not override the `hidden` attribute; filtered-out cards must be visually gone.
- Typing must not push one history entry per keystroke; Back returns to the previous discrete filter, not the previous character.
- Open-ended Seed/Sprout projects have no lifespan and must sort last in both length sorts, never as a 0-day project.
- Deep links (`?stage=composted`) and the footer's `?category=frontend` links must filter and set `aria-pressed` correctly on first load.

## Before Task 1

Run `npm install` in the worktree. If Chromium is missing, run
`npx playwright install chromium`.

---

### Task 1: Archive URL state

**Files:**
- Create: `src/lib/archive.ts`
- Create: `tests/archive-url.test.ts`

**Interfaces:**
- Produces: `Stage`, `Sort`, `ArchiveFilters`, `DEFAULT_FILTERS`, `STAGES`, `SORTS`, `parseFilters(search: string): ArchiveFilters`, `buildQuery(filters: ArchiveFilters): string`.

- [ ] **Step 1: Write the failing test**

`tests/archive-url.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { DEFAULT_FILTERS, STAGES, SORTS, parseFilters, buildQuery } from '../src/lib/archive';

describe('parseFilters', () => {
  it('returns defaults for an empty or unknown query', () => {
    expect(parseFilters('')).toEqual(DEFAULT_FILTERS);
    expect(parseFilters('?utm_source=x&foo=bar')).toEqual(DEFAULT_FILTERS);
  });

  it('parses every supported param', () => {
    expect(
      parseFilters('?q=Rails&stage=composted&category=backend&year=2024&sort=oldest'),
    ).toEqual({ q: 'Rails', stage: 'composted', category: 'backend', year: 2024, sort: 'oldest' });
  });

  it('ignores invalid stage, sort, and year values', () => {
    expect(parseFilters('?stage=dead&sort=weird&year=abc')).toEqual(DEFAULT_FILTERS);
  });

  it('trims the search term', () => {
    expect(parseFilters('?q=%20rails%20').q).toBe('rails');
  });
});

describe('buildQuery', () => {
  it('returns an empty string for defaults', () => {
    expect(buildQuery(DEFAULT_FILTERS)).toBe('');
  });

  it('emits non-default params in stable order', () => {
    expect(
      buildQuery({ q: 'rails', stage: 'composted', category: 'backend', year: 2024, sort: 'oldest' }),
    ).toBe('?q=rails&stage=composted&category=backend&year=2024&sort=oldest');
  });

  it('round-trips through parseFilters', () => {
    const filters = {
      q: 'ruby on rails',
      stage: 'shipped' as const,
      category: 'fullstack',
      year: 2023,
      sort: 'shortest' as const,
    };
    expect(parseFilters(buildQuery(filters))).toEqual(filters);
  });

  it('exposes the four stages and four sorts', () => {
    expect(STAGES.map((s) => s.value)).toEqual(['seed', 'sprout', 'shipped', 'composted']);
    expect(SORTS.map((s) => s.value)).toEqual(['newest', 'oldest', 'longest', 'shortest']);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/archive-url.test.ts`
Expected: FAIL — cannot resolve `../src/lib/archive`.

- [ ] **Step 3: Implement the URL state in `src/lib/archive.ts`**

Export these exact shapes:

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

export const DEFAULT_FILTERS: ArchiveFilters = {
  q: '',
  stage: '',
  category: '',
  year: null,
  sort: 'newest',
};

export const STAGES: ReadonlyArray<{ value: Stage; label: string }> = [
  { value: 'seed', label: 'Seed' },
  { value: 'sprout', label: 'Sprout' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'composted', label: 'Composted' },
];

export const SORTS: ReadonlyArray<{ value: Sort; label: string }> = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'longest', label: 'Longest lived' },
  { value: 'shortest', label: 'Shortest lived' },
];
```

`parseFilters` rules: read through `URLSearchParams`; `q` is trimmed; `stage`/`sort` are accepted only when they match a constant, otherwise default; `category` is trimmed; `year` is accepted only when the raw value is a non-empty integer.

`buildQuery` rules: append non-default values in this order — `q`, `stage`, `category`, `year`, `sort` — with `URLSearchParams`; return `''` when empty, otherwise `'?' + params.toString()`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/archive-url.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/archive.ts tests/archive-url.test.ts
git commit -m "feat: add archive filter URL state"
```

---

### Task 2: Project → archive item classification

**Files:**
- Modify: `src/lib/archive.ts`
- Create: `tests/archive-classify.test.ts`

**Interfaces:**
- Consumes: `Stage` from Task 1.
- Produces: `ArchiveItem`, `deriveStage(project: Project): Stage`, `lifespanDays(item: ArchiveItem): number | null`, `toArchiveItem(project: Project): ArchiveItem`, `cardDataset(item: ArchiveItem): Record<string, string>`.

- [ ] **Step 1: Write the failing test**

`tests/archive-classify.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import type { Project } from '../src/data/projects';
import { deriveStage, lifespanDays, toArchiveItem, cardDataset } from '../src/lib/archive';

function project(overrides: Partial<Project> = {}): Project {
  return {
    id: 'x',
    title: 'Thing',
    slug: 'thing',
    description: 'A thing',
    longDescription: 'A longer thing',
    technologies: ['Rails'],
    category: 'backend',
    status: 'completed',
    difficulty: 'beginner',
    phase: 'active',
    dateStarted: '2024-01-01',
    dateCreated: '2024-01-01',
    features: [],
    learnings: ['Learned something'],
    challenges: [],
    tags: ['api'],
    featured: false,
    ...overrides,
  };
}

describe('deriveStage', () => {
  it.each([
    ['planned', 'active', 'seed'],
    ['in-progress', 'active', 'sprout'],
    ['completed', 'active', 'shipped'],
    ['completed', 'archived', 'shipped'],
    ['completed', 'sunset', 'composted'],
    ['archived', 'any', 'composted'],
  ] as const)('%s + %s -> %s', (status, phase, expected) => {
    expect(deriveStage(project({ status, phase: phase === 'any' ? 'archived' : phase }))).toBe(expected);
  });
});

describe('lifespanDays', () => {
  const item = (born: string, died: string) =>
    ({ slug: 's', title: 'T', category: 'backend', stage: 'shipped', year: 2024, born, died, search: '' }) as const;

  it('counts whole days from born to died', () => {
    expect(lifespanDays({ ...item('2024-01-01', '2024-01-31') })).toBe(30);
  });

  it('returns null when the project has no end date', () => {
    expect(lifespanDays({ ...item('2024-01-01', '') })).toBeNull();
  });

  it('returns null without a start date', () => {
    expect(lifespanDays({ ...item('', '2024-01-31') })).toBeNull();
  });

  it('clamps an inverted range to zero', () => {
    expect(lifespanDays({ ...item('2024-02-01', '2024-01-01') })).toBe(0);
  });
});

describe('toArchiveItem', () => {
  it('builds a lowercase search blob and normalised dates', () => {
    const item = toArchiveItem(
      project({
        title: 'Rails Contacts',
        technologies: ['Ruby on Rails'],
        tags: ['CRUD'],
        learnings: ['MVC'],
        dateCreated: '2024-03-02',
        dateCompleted: '2024-03-05',
      }),
    );
    expect(item).toMatchObject({
      slug: 'thing',
      title: 'Rails Contacts',
      category: 'backend',
      stage: 'shipped',
      year: 2024,
      born: '2024-03-02',
      died: '2024-03-05',
    });
    for (const needle of ['rails contacts', 'ruby on rails', 'crud', 'mvc']) {
      expect(item.search).toContain(needle);
    }
    expect(item.search).toBe(item.search.toLowerCase());
  });

  it('falls back to dateStarted when dateCreated is absent', () => {
    const item = toArchiveItem(project({ dateCreated: undefined, dateStarted: '2023-07-04' }));
    expect(item.year).toBe(2023);
    expect(item.born).toBe('2023-07-04');
  });

  it('prefers dateCompleted, then sunsetDate, then dateSunset', () => {
    expect(toArchiveItem(project({ dateCompleted: '2024-01-02' })).died).toBe('2024-01-02');
    expect(
      toArchiveItem(project({ dateCompleted: undefined, sunsetDate: '2024-02-03' })).died,
    ).toBe('2024-02-03');
    expect(
      toArchiveItem(project({ dateCompleted: undefined, sunsetDate: undefined, dateSunset: '2024-03-04' })).died,
    ).toBe('2024-03-04');
  });
});

describe('cardDataset', () => {
  it('emits the data attributes the page and script rely on', () => {
    const dataset = cardDataset({
      slug: 'thing',
      title: 'Thing',
      category: 'backend',
      stage: 'composted',
      year: 2023,
      born: '2023-01-01',
      died: '2023-02-01',
      search: 'thing rails',
    });
    expect(dataset).toEqual({
      'data-slug': 'thing',
      'data-title': 'Thing',
      'data-stage': 'composted',
      'data-category': 'backend',
      'data-year': '2023',
      'data-born': '2023-01-01',
      'data-died': '2023-02-01',
      'data-search': 'thing rails',
    });
  });

  it('emits an empty year when the date is unusable', () => {
    const dataset = cardDataset({
      slug: 's', title: 'S', category: 'api', stage: 'seed', year: null,
      born: '', died: '', search: '',
    });
    expect(dataset['data-year']).toBe('');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/archive-classify.test.ts`
Expected: FAIL — `deriveStage` is not exported.

- [ ] **Step 3: Implement classification in `src/lib/archive.ts`**

Add:

```ts
export interface ArchiveItem {
  slug: string;
  title: string;
  category: Project['category'];
  stage: Stage;
  year: number | null;
  born: string; // ISO date or ''
  died: string; // ISO date or ''
  search: string; // lowercase searchable blob
}
```

`deriveStage`: `planned → seed`, `in-progress → sprout`, `completed` + `sunset → composted`, any other `completed → shipped`, `archived → composted`. Mark with `// TODO(#39): replace with the real stage field.`

`toArchiveItem`: `born` = `dateCreated ?? dateStarted ?? ''`; `died` = `dateCompleted ?? sunsetDate ?? dateSunset ?? ''`; `year` = the year of `born` or `null`; `search` = `[title, description, longDescription, ...technologies, ...tags, ...learnings].join(' ').toLowerCase()`.

`lifespanDays`: `null` unless both `born` and `died` parse; otherwise `Math.max(0, Math.round((end - start) / 86_400_000))`.

`cardDataset`: return the eight `data-*` keys asserted in the test, with `data-year` as `String(year)` or `''`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/archive-classify.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/archive.ts tests/archive-classify.test.ts
git commit -m "feat: derive archive stages and card metadata"
```

---

### Task 3: Matching, sorting, and counts

**Files:**
- Modify: `src/lib/archive.ts`
- Create: `tests/archive-filter.test.ts`

**Interfaces:**
- Consumes: `ArchiveItem`, `lifespanDays` from Task 2; `ArchiveFilters`, `Sort`, `Stage` from Task 1.
- Produces: `matchesFilters(item, filters): boolean`, `sortProjects(items, sort): ArchiveItem[]`, `filterProjects(items, filters): ArchiveItem[]`, `countByStage(items): Record<Stage, number>`.

- [ ] **Step 1: Write the failing test**

`tests/archive-filter.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  countByStage,
  filterProjects,
  matchesFilters,
  sortProjects,
  DEFAULT_FILTERS,
  type ArchiveItem,
} from '../src/lib/archive';

function item(overrides: Partial<ArchiveItem> = {}): ArchiveItem {
  return {
    slug: 'a', title: 'Alpha', category: 'backend', stage: 'shipped', year: 2024,
    born: '2024-01-01', died: '2024-01-11', search: 'alpha rails', ...overrides,
  };
}

const items = [
  item(),
  item({ slug: 'b', title: 'Beta', category: 'frontend', stage: 'composted', year: 2023, born: '2023-01-01', died: '2023-01-02', search: 'beta vue' }),
  item({ slug: 'c', title: 'Gamma', category: 'backend', stage: 'sprout', year: 2024, born: '2024-02-01', died: '', search: 'gamma rails' }),
];

describe('matchesFilters', () => {
  it('matches search case-insensitively', () => {
    expect(items.filter((i) => matchesFilters(i, { ...DEFAULT_FILTERS, q: 'RAILS' })).map((i) => i.slug)).toEqual(['a', 'c']);
  });

  it('combines filters with AND', () => {
    expect(
      items.filter((i) => matchesFilters(i, { ...DEFAULT_FILTERS, q: 'rails', stage: 'shipped' })).map((i) => i.slug),
    ).toEqual(['a']);
  });

  it('filters by category and year', () => {
    expect(items.filter((i) => matchesFilters(i, { ...DEFAULT_FILTERS, category: 'frontend' })).map((i) => i.slug)).toEqual(['b']);
    expect(items.filter((i) => matchesFilters(i, { ...DEFAULT_FILTERS, year: 2024 })).map((i) => i.slug)).toEqual(['a', 'c']);
  });

  it('matches everything with defaults', () => {
    expect(items.filter((i) => matchesFilters(i, DEFAULT_FILTERS))).toHaveLength(3);
  });
});

describe('sortProjects', () => {
  it('sorts newest and oldest by born date', () => {
    expect(sortProjects(items, 'newest').map((i) => i.slug)).toEqual(['c', 'a', 'b']);
    expect(sortProjects(items, 'oldest').map((i) => i.slug)).toEqual(['b', 'a', 'c']);
  });

  it('sorts longest and shortest with open-ended items last', () => {
    expect(sortProjects(items, 'longest').map((i) => i.slug)).toEqual(['a', 'b', 'c']);
    expect(sortProjects(items, 'shortest').map((i) => i.slug)).toEqual(['b', 'a', 'c']);
  });

  it('breaks ties by title and does not mutate the input', () => {
    const tied = [item({ slug: 'z', title: 'Zulu' }), item({ slug: 'y', title: 'Yankee' })];
    expect(sortProjects(tied, 'newest').map((i) => i.title)).toEqual(['Yankee', 'Zulu']);
    expect(tied.map((i) => i.slug)).toEqual(['z', 'y']);
  });
});

describe('filterProjects', () => {
  it('filters then sorts', () => {
    expect(filterProjects(items, { ...DEFAULT_FILTERS, q: 'rails', sort: 'oldest' }).map((i) => i.slug)).toEqual(['a', 'c']);
  });
});

describe('countByStage', () => {
  it('counts every stage, including empty ones', () => {
    expect(countByStage(items)).toEqual({ seed: 0, sprout: 1, shipped: 1, composted: 1 });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/archive-filter.test.ts`
Expected: FAIL — `matchesFilters` is not exported.

- [ ] **Step 3: Implement matching, sorting, and counts in `src/lib/archive.ts`**

`matchesFilters`: trimmed lowercase `q` must be included in `item.search`; `stage`, `category`, and `year` must match when non-empty. All conditions AND.

`sortProjects`: return a copy. Primary comparators: `newest`/`oldest` compare `born` strings; `longest` compares `lifespanDays` descending with `null` last; `shortest` compares ascending with `null` last. Tiebreak `title` ascending in every sort.

`filterProjects`: `sortProjects(items.filter((i) => matchesFilters(i, filters)), filters.sort)`.

`countByStage`: initialise `{ seed: 0, sprout: 0, shipped: 0, composted: 0 }` and increment by `item.stage`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/archive-filter.test.ts`
Expected: PASS.

- [ ] **Step 5: Run the whole unit suite and commit**

Run: `npm test`
Expected: PASS, all unit tests.

```bash
git add src/lib/archive.ts tests/archive-filter.test.ts
git commit -m "feat: add archive matching and sorting"
```

---

### Task 4: Render every card with filter metadata

**Files:**
- Modify: `src/components/ProjectCard.astro:57-59`
- Modify: `src/components/ProjectList.astro:8`
- Modify: `src/components/SearchBar.astro` (full rewrite)
- Modify: `src/pages/learnt.astro` (remove the build-time filter block; render all projects)
- Create: `tests/e2e/archive-render.spec.ts`

**Interfaces:**
- Consumes: `toArchiveItem`, `cardDataset`, `countByStage`, `STAGES`, `SORTS`, `Stage` from Tasks 1–3.
- Produces: `#project-list`, `article[data-slug]`, `#archive-count`, `#archive-empty`, `[data-stage-filter]`, `#archive-search`, `#archive-category`, `#archive-year`, `#archive-sort`, `#archive-clear`.

- [ ] **Step 1: Write the failing E2E test**

`tests/e2e/archive-render.spec.ts`:

```ts
import { projects } from '../../src/data/projects';
import { toArchiveItem } from '../../src/lib/archive';
import { test, expect } from './test';

test('renders every project card with filter metadata and stage counts', async ({ page }) => {
  await page.goto('/learnt/');

  await expect(page.locator('#project-list article[data-slug]')).toHaveCount(projects.length);
  await expect(page.locator('#archive-count')).toHaveText(String(projects.length));

  const items = projects.map(toArchiveItem);
  for (const stage of ['seed', 'sprout', 'shipped', 'composted'] as const) {
    const expected = items.filter((i) => i.stage === stage).length;
    await expect(page.locator(`[data-stage-filter="${stage}"]`)).toContainText(String(expected));
  }

  const first = page.locator('#project-list article[data-slug]').first();
  for (const attr of ['data-stage', 'data-category', 'data-year', 'data-search']) {
    await expect(first).toHaveAttribute(attr, /.+/);
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/archive-render.spec.ts`
Expected: FAIL — `#project-list` and `[data-stage-filter]` do not exist.

- [ ] **Step 3: Add metadata to the card**

In `ProjectCard.astro`:

```ts
import { toArchiveItem, cardDataset } from "../lib/archive";
// ...
const meta = cardDataset(toArchiveItem(project));
```

Spread it on the root `<article>`: `<article {...meta} class={...}>`. The resulting attributes must be exactly the eight keys from `cardDataset` (Task 2).

- [ ] **Step 4: Add the list hook and rebuild the page shell**

- `ProjectList.astro`: accept an optional `id` prop and render `<div id={id} class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">`. The home page keeps calling it without `id`; `/learnt` passes `id="project-list"`.
- `learnt.astro`:
  - Delete the build-time filter block (current lines ~12–110) and the old active-filter badges (current lines ~168–277).
  - Keep the hero stats using `getProjectStats()`.
  - Compute `const items = getAllProjects().map(toArchiveItem); const counts = countByStage(items);`.
  - Render `<SearchBar counts={counts} total={items.length} />`.
  - Render `<ProjectList id="project-list" projects={getAllProjects()} />` (all projects).
  - Replace the old count heading with:

```astro
<p id="archive-result" class="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
  Showing <span id="archive-count">{items.length}</span> of {items.length}
</p>
<div id="archive-empty" hidden class="text-center py-12">
  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects found</h3>
  <p class="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters or search terms</p>
  <button type="button" id="archive-empty-clear" class="btn-primary">Clear all filters</button>
</div>
```

  - Remove the now-unused `getProjectsByYear` / `getProjectYears` imports and the `slideIn` style block.

- [ ] **Step 5: Rewrite `SearchBar.astro` markup**

Props: `{ counts: Record<Stage, number>; total: number }`. Import `STAGES`, `SORTS` from `../lib/archive`, and `getUniqueCategories`, `getProjectYears` from `../data/projects`.

Render, in order:

```astro
<form id="archive-controls" method="get" action="/learnt" class="...">
  <label for="archive-search">Search projects</label>
  <input id="archive-search" name="q" type="search" class="input" autocomplete="off" />

  <div role="group" aria-label="Stage">
    <button type="button" data-stage-filter="" aria-pressed="true">All <span>{total}</span></button>
    {STAGES.map((s) => (
      <button type="button" data-stage-filter={s.value} aria-pressed="false">
        {s.label} <span>{counts[s.value]}</span>
      </button>
    ))}
  </div>

  <select id="archive-category" name="category">
    <option value="">All categories</option>
    {categories.map((c) => <option value={c}>{c}</option>)}
  </select>

  <select id="archive-year" name="year">
    <option value="">All years</option>
    {years.map((y) => <option value={String(y)}>{y}</option>)}
  </select>

  <select id="archive-sort" name="sort">
    {SORTS.map((s) => <option value={s.value} selected={s.value === 'newest'}>{s.label}</option>)}
  </select>

  <button type="button" id="archive-clear">Clear all</button>
</form>
```

Remove the old script block and the technology/tag/difficulty/phase controls entirely.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test:e2e -- tests/e2e/archive-render.spec.ts`
Expected: PASS (desktop and mobile projects).

- [ ] **Step 7: Build and commit**

Run: `npm run build`
Expected: build completes with 0 errors.

```bash
git add src/components/ProjectCard.astro src/components/ProjectList.astro src/components/SearchBar.astro src/pages/learnt.astro tests/e2e/archive-render.spec.ts
git commit -m "feat: render archive cards with filter metadata"
```

---

### Task 5: Client-side filtering, URL sync, and history

**Files:**
- Create: `src/scripts/archive-filter.ts`
- Modify: `src/pages/learnt.astro` (import the script)
- Modify: `src/styles/global.css` (make `hidden` win over `.card`)
- Modify: `tests/e2e/filters.spec.ts` (remove the `test.fail` markers)
- Create: `tests/e2e/archive-filters.spec.ts`

**Interfaces:**
- Consumes: `parseFilters`, `buildQuery`, `filterProjects`, `DEFAULT_FILTERS`, `ArchiveFilters`, `ArchiveItem`, `Sort`, `Stage`; the DOM ids from Task 4.
- Produces: working filtering + URL/history behavior.

- [ ] **Step 1: Write the failing E2E tests**

`tests/e2e/archive-filters.spec.ts`:

```ts
import { projects } from '../../src/data/projects';
import { deriveStage } from '../../src/lib/archive';
import { test, expect } from './test';

const visible = (page: import('@playwright/test').Page) =>
  page.locator('#project-list article[data-slug]:not([hidden])');

test('deep link filters by stage and marks the button pressed', async ({ page }) => {
  await page.goto('/learnt/?stage=composted');
  const expected = projects
    .filter((p) => deriveStage(p) === 'composted')
    .map((p) => p.slug)
    .sort();
  await expect(visible(page)).toHaveCount(expected.length);
  expect(await visible(page).evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.slug!).sort())).toEqual(expected);
  await expect(page.locator('[data-stage-filter="composted"]')).toHaveAttribute('aria-pressed', 'true');
});

test('typing filters without navigation and updates the URL', async ({ page }) => {
  await page.goto('/learnt/');
  let navigations = 0;
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) navigations += 1;
  });

  await page.getByRole('searchbox', { name: /search projects/i }).fill('rails');
  await page.waitForURL(/q=rails/);

  const count = await visible(page).count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(projects.length);
  expect(navigations).toBe(0);
});

test('filtered-out cards are actually hidden', async ({ page }) => {
  await page.goto('/learnt/?stage=composted');
  const hidden = page.locator('#project-list article[data-slug][hidden]');
  expect(await hidden.count()).toBeGreaterThan(0);
  expect(await hidden.first().evaluate((el) => getComputedStyle(el).display)).toBe('none');
});

test('Back restores the previous filters', async ({ page }) => {
  await page.goto('/learnt/');
  await page.locator('[data-stage-filter="composted"]').click();
  await page.waitForURL(/stage=composted/);
  await page.locator('[data-stage-filter="shipped"]').click();
  await page.waitForURL(/stage=shipped/);

  await page.goBack();
  await page.waitForURL(/stage=composted/);
  await expect(page.locator('[data-stage-filter="composted"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-stage-filter="shipped"]')).toHaveAttribute('aria-pressed', 'false');
});

test('an impossible combination shows the empty state', async ({ page }) => {
  await page.goto('/learnt/?stage=seed');
  await expect(page.locator('#archive-empty')).toBeVisible();
  await expect(page.locator('#archive-count')).toHaveText('0');
  await expect(page.locator('#archive-result')).toContainText('Showing 0 of');
});

test('clear all resets the list and the URL', async ({ page }) => {
  await page.goto('/learnt/?stage=composted&q=rails');
  await page.locator('#archive-clear').click();
  await page.waitForURL(/\/learnt\/$/);
  await expect(visible(page)).toHaveCount(projects.length);
  await expect(page.locator('[data-stage-filter=""]')).toHaveAttribute('aria-pressed', 'true');
});
```

Then update `tests/e2e/filters.spec.ts` — remove the `KNOWN_BUG` constant and
both `test.fail(true, KNOWN_BUG);` lines, and count only visible cards
(`article[hidden]` still exists in the DOM, so the old `article` count would
still be 42):

```ts
import { test, expect } from './test';

const visibleCards = (page: import('@playwright/test').Page) =>
  page.locator('#project-list article:not([hidden])');

test('category filter narrows the list', async ({ page }) => {
  await page.goto('/learnt/');
  const all = await visibleCards(page).count();
  await page.goto('/learnt/?category=backend');
  expect(await visibleCards(page).count()).toBeLessThan(all);
});

test('unknown category shows no projects', async ({ page }) => {
  await page.goto('/learnt/?category=not-a-category');
  expect(await visibleCards(page).count()).toBe(0);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test:e2e -- tests/e2e/archive-filters.spec.ts tests/e2e/filters.spec.ts`
Expected: FAIL — filtering does nothing; `?category=` still shows every card.

- [ ] **Step 3: Implement `src/scripts/archive-filter.ts`**

First add the rule that makes filtering visible in `src/styles/global.css`:

```css
[hidden] { display: none !important; }
```

Use these exact ids/selectors. The module must:

- Collect `cards = [...document.querySelectorAll<HTMLElement>('#project-list article[data-slug]')]` and build `ArchiveItem`s with `itemFromCard`:
  `slug`, `title`, `category`, `stage`, `year` (`Number(...)` or `null`), `born`, `died`, `search` from the matching `data-*` attributes.
- `readControls(): ArchiveFilters` reads `#archive-search`, the pressed `[data-stage-filter]`, `#archive-category`, `#archive-year`, `#archive-sort`.
- `apply(filters, mode: 'push' | 'replace' | 'none')`:
  - `const ordered = filterProjects(items, filters); const allowed = new Set(ordered.map((i) => i.slug));`
  - set `card.hidden = !allowed.has(card.dataset.slug!)` for every card;
  - append cards in `ordered` order to `#project-list`;
  - set `#archive-count` to `String(ordered.length)`, toggle `#archive-empty` via `hidden`;
  - sync control values and `aria-pressed`;
  - when `mode !== 'none'`, call `history.pushState`/`replaceState` with `location.pathname + buildQuery(filters)`.
- On start: `apply(parseFilters(location.search), 'none')`.
- `#archive-search` `input`: debounce 150 ms, then `apply(readControls(), 'replace')`; `Escape` clears `q`.
- Stage buttons: click sets `aria-pressed`, then `apply(readControls(), 'push')`; the `""` button clears the stage.
- `#archive-category`, `#archive-year`, `#archive-sort` `change`: `apply(readControls(), 'push')`.
- `#archive-clear` and `#archive-empty-clear`: reset controls to `DEFAULT_FILTERS`, `apply(DEFAULT_FILTERS, 'push')`, focus the search input.
- `popstate`: `apply(parseFilters(location.search), 'none')`.

In `learnt.astro`, add the standard Astro bundled script:

```astro
<script>
  import '../scripts/archive-filter';
</script>
```

It runs after the DOM is parsed.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test:e2e -- tests/e2e/archive-filters.spec.ts tests/e2e/filters.spec.ts`
Expected: PASS (desktop and mobile).

- [ ] **Step 5: Commit**

```bash
git add src/scripts/archive-filter.ts src/pages/learnt.astro src/styles/global.css tests/e2e/filters.spec.ts tests/e2e/archive-filters.spec.ts
git commit -m "feat: filter the archive in the browser"
```

---

### Task 6: No-JS, footer links, axe, and full verification

**Files:**
- Modify: `package.json` / `package-lock.json` (add `@axe-core/playwright@^4.14.0`)
- Create: `tests/e2e/archive-a11y.spec.ts`

**Interfaces:**
- Consumes: everything from Tasks 1–5; it adds tests only.

- [ ] **Step 1: Install the axe dev dependency**

Run: `npm install --save-dev @axe-core/playwright@^4.14.0`
Expected: `package.json` devDependencies includes it; lockfile updates.

- [ ] **Step 2: Write the failing tests**

`tests/e2e/archive-a11y.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { projects } from '../../src/data/projects';
import { test, expect } from './test';

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('all projects still render', async ({ page }) => {
    await page.goto('/learnt/?stage=composted');
    await expect(page.locator('#project-list article')).toHaveCount(projects.length);
  });
});

test('the footer category link filters the archive', async ({ page }) => {
  await page.goto('/learnt/');
  await page.locator('footer a[href="/learnt?category=frontend"]').click();
  await page.waitForURL(/category=frontend/);

  const visible = page.locator('#project-list article[data-slug]:not([hidden])');
  const count = await visible.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(projects.length);
  expect(await visible.evaluateAll((els) => els.every((el) => (el as HTMLElement).dataset.category === 'frontend'))).toBe(true);
});

test('keyboard-only: search and stage buttons work', async ({ page }) => {
  await page.goto('/learnt/');
  await page.getByRole('searchbox', { name: /search projects/i }).fill('rails');
  await page.locator('[data-stage-filter="shipped"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(/stage=shipped/);
  expect(await page.locator('#project-list article[data-slug]:not([hidden])').count()).toBeGreaterThan(0);
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`no serious or critical axe violations in the archive UI (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/learnt/?stage=composted');
    const results = await new AxeBuilder({ page })
      .include('#archive-controls')
      .include('#archive-result')
      .analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious).toEqual([]);
  });
}
```

Axe is scoped to the archive UI this ticket changes. Full-page axe, including global chrome and contrast, stays with #47; note any global findings in the commit message.

- [ ] **Step 3: Run the tests to verify their current state**

Run: `npm run test:e2e -- tests/e2e/archive-a11y.spec.ts`
Expected: the no-JS test passes; the footer test passes after Task 5; any axe failure reports a concrete rule. Fix only violations the archive page owns; note global findings for #47 in the commit message.

- [ ] **Step 4: Run the full verification**

Run each and confirm:

- `npm test` → all unit tests pass
- `npm run build` → build completes with 0 errors
- `npm run test:e2e` → all specs pass (desktop + mobile)
- `grep -n "searchParams" src/pages/learnt.astro` → no matches
- `grep -n "test.fail" tests/e2e/filters.spec.ts` → no matches
- `grep -rn "/images/screenshots/" dist` → no matches

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tests/e2e/archive-a11y.spec.ts
git commit -m "test: cover archive a11y, no-js, and footer links"
```
