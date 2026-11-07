# Graveyard Fields Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five overlapping project date fields with canonical `born`/`died`, add optional graveyard content slots, and make every reader agree on the same dates.

**Architecture:** A one-off codemod rewrites the 42 entries in `src/data/projects.ts` in place. The type gains `born`, optional `died`, and optional `causeOfDeath`/`supersededBy`/`epitaph`, and loses the legacy date fields. Readers (archive engine, card, detail page, helpers, JSON-LD) switch to `born`/`died`; no content is invented.

**Tech Stack:** Astro 5.13, TypeScript, Vitest 3.2, Playwright 1.64.

**Spec:** `docs/superpowers/specs/2026-11-07-graveyard-fields-design.md`

## Global Constraints

- Site stays static; no new dependencies.
- `born` comes from `dateStarted`; `died` comes from `sunsetDate ?? dateCompleted`.
- No project may keep `dateStarted`, `dateCreated`, `dateCompleted`, `sunsetDate`, or `dateSunset`.
- `causeOfDeath`, `supersededBy`, and `epitaph` are typed but unset on every entry; do not invent content.
- `status` and `phase` stay until #39.
- Keep all 42 projects; the migration must not drop or reorder entries or strip comments.
- E2E runs through `npm run test:e2e` (build + preview at `127.0.0.1:4321`, desktop + mobile).
- Do not change the #42 filter behavior except where it reads dates.

## Review Focus

- A project whose `died` is before `born` must never produce a negative lifespan.
- An open project (no `died`) must show no duration and must not age with today.
- Card, detail page, and archive filter must all read the same `born`; the old card/detail disagreement must be gone.
- The codemod must not drop, duplicate, or reorder a project or alter non-date fields.
- The detail page's JSON-LD must still carry a valid date after `dateCreated` disappears.

## Before Task 1

Run `npm install`. If Chromium is missing, run `npx playwright install chromium`.

---

### Task 1: New schema and data migration

**Files:**
- Modify: `src/data/projects.ts` (type block + 42 entries)
- Create: `scripts/migrate-graveyard-dates.mjs` (temporary, deleted after use)
- Modify: `tests/unit/projects.test.ts`

**Interfaces:**
- Produces: `Project.born: string`, `Project.died?: string`, `Project.causeOfDeath?`, `Project.supersededBy?`, `Project.epitaph?`; removes the five legacy date fields.

- [ ] **Step 1: Write the failing guard tests**

Add to `tests/unit/projects.test.ts`:

```ts
describe('graveyard dates (#15)', () => {
  const ISO = /^\d{4}-\d{2}-\d{2}$/;
  const legacy = ['dateStarted', 'dateCreated', 'dateCompleted', 'sunsetDate', 'dateSunset'];

  it('every project has a born date', () => {
    for (const project of projects) {
      expect(project.born).toMatch(ISO);
    }
  });

  it('keeps no legacy date fields', () => {
    for (const project of projects) {
      for (const key of legacy) {
        expect(key in project).toBe(false);
      }
    }
  });

  it('died is absent or a valid date on or after born', () => {
    for (const project of projects) {
      if (project.died === undefined) continue;
      expect(project.died).toMatch(ISO);
      expect(project.died >= project.born).toBe(true);
    }
  });

  it('keeps all 42 projects', () => {
    expect(projects).toHaveLength(42);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/unit/projects.test.ts`
Expected: FAIL — `project.born` is undefined and legacy keys are present.

- [ ] **Step 3: Replace the date fields in the `Project` type**

In `src/data/projects.ts`, replace the type lines for the five date fields with:

```ts
  born: string;
  died?: string;
  causeOfDeath?: 'shipped' | 'superseded' | 'outgrew-stack' | 'course-ended' | 'abandoned' | 'merged-into';
  supersededBy?: string;
  epitaph?: string;
```

Keep `status`, `phase`, `short`, and `learned` unchanged.

- [ ] **Step 4: Run the codemod**

Create `scripts/migrate-graveyard-dates.mjs`:

```js
// One-off #15 migration. Run: node --experimental-strip-types scripts/migrate-graveyard-dates.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { projects } from '../src/data/projects.ts';

const file = new URL('../src/data/projects.ts', import.meta.url);
const lines = readFileSync(file, 'utf8').split('\n');
const out = [];
let block = null;

function flush() {
  if (!block) return;
  const slug = block.join('\n').match(/^ {4}slug: '([^']+)'/m)?.[1];
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`No project for block: ${slug}`);
  const died = project.sunsetDate ?? project.dateCompleted;
  for (const line of block) {
    if (/^ {4}dateStarted: /.test(line)) {
      out.push(line.replace('dateStarted:', 'born:'));
      if (died) out.push(`    died: '${died}',`);
    } else if (/^ {4}(dateCreated|dateCompleted|sunsetDate|dateSunset): /.test(line)) {
      // dropped
    } else {
      out.push(line);
    }
  }
  block = null;
}

for (const line of lines) {
  if (line === '  {') block = [];
  if (block) {
    block.push(line);
    if (line === '  },') flush();
  } else {
    out.push(line);
  }
}

writeFileSync(file, out.join('\n'));
```

Run it, then delete the script:

```bash
node --experimental-strip-types scripts/migrate-graveyard-dates.mjs
rm scripts/migrate-graveyard-dates.mjs
```

- [ ] **Step 5: Verify the migration counts and diff**

Run:

```bash
node --experimental-strip-types -e "import {projects} from './src/data/projects.ts'; console.log('total',projects.length,'born',projects.filter(p=>p.born).length,'died',projects.filter(p=>p.died).length)"
grep -cE "dateStarted|dateCreated|dateCompleted|sunsetDate|dateSunset" src/data/projects.ts
diff <(git show HEAD:src/data/projects.ts | grep -o "^    slug: '[^']*'") <(grep -o "^    slug: '[^']*'" src/data/projects.ts)
git diff --stat src/data/projects.ts
```

Expected: `total 42 born 42 died 36`; grep count `0`; the slug diff is
empty (no project dropped or reordered); the diff only touches date lines.

- [ ] **Step 6: Run the guard tests**

Run: `npx vitest run tests/unit/projects.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/data/projects.ts tests/unit/projects.test.ts
git commit -m "feat: migrate projects to born/died graveyard dates"
```

---

### Task 2: Archive engine and card read born/died

**Files:**
- Modify: `src/lib/archive.ts:88-96`
- Modify: `src/components/ProjectCard.astro:168-169`
- Modify: `tests/unit/fixtures.ts:15`
- Modify: `tests/archive-classify.test.ts`
- Modify: `tests/unit/ProjectCard.test.ts`

**Interfaces:**
- Consumes: `Project.born` / `Project.died` from Task 1.
- Produces: `ArchiveItem.born` / `.died` populated directly from the project.

- [ ] **Step 1: Update the tests first**

In `tests/unit/fixtures.ts`, replace `dateStarted: '2023-01-15',` with `born: '2023-01-15',`.

In `tests/archive-classify.test.ts`:

- replace `dateStarted`/`dateCreated` in the `project()` factory with `born: '2024-01-01'`;
- replace the `toArchiveItem` date cases with:

```ts
it('passes born and died through to the archive item', () => {
  const item = toArchiveItem(
    project({ born: '2024-03-02', died: '2024-03-05' }),
  );
  expect(item.born).toBe('2024-03-02');
  expect(item.died).toBe('2024-03-05');
});

it('leaves died empty for an open project', () => {
  expect(toArchiveItem(project({ born: '2024-03-02' })).died).toBe('');
});

it('derives the year from the ISO born string', () => {
  expect(toArchiveItem(project({ born: '2023-01-01' })).year).toBe(2023);
});
```

- update the lowercase-search test to use `born`/`died` instead of `dateCreated`/`dateCompleted`.

In `tests/unit/ProjectCard.test.ts`, add:

```ts
it('shows the born date', async () => {
  const html = await render(makeProject({ born: '2023-01-15' }));
  expect(html).toContain('datetime="2023-01-15"');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/archive-classify.test.ts tests/unit/ProjectCard.test.ts`
Expected: FAIL — the archive item still reads `dateCreated`/`dateStarted`, and the card still renders `dateStarted`.

- [ ] **Step 3: Read `born`/`died` in `src/lib/archive.ts`**

Delete the `startDate` and `endDate` helpers. In `toArchiveItem`:

```ts
const born = project.born;
const died = project.died ?? '';
```

Everything else stays the same.

- [ ] **Step 4: Use `born` in `ProjectCard.astro`**

Replace the two `project.dateStarted` references with `project.born`.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run tests/archive-classify.test.ts tests/unit/ProjectCard.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/archive.ts src/components/ProjectCard.astro tests/unit/fixtures.ts tests/archive-classify.test.ts tests/unit/ProjectCard.test.ts
git commit -m "refactor: read born and died in archive cards and engine"
```

---

### Task 3: Detail page, metadata, and date E2E

**Files:**
- Modify: `src/pages/learnt/[slug].astro:46-58,106,123,474,497-498,546-553,572-579`
- Modify: `src/components/ProjectDetail.astro:29-31`
- Modify: `src/layouts/Layout.astro:61-62`
- Create: `tests/e2e/dates.spec.ts`

**Interfaces:**
- Consumes: `Project.born` / `Project.died`.
- Produces: card/detail/JSON-LD all use `born`; duration is `born → died` with no today fallback.

- [ ] **Step 1: Write the failing E2E test**

`tests/e2e/dates.spec.ts`:

```ts
import { projects } from '../../src/data/projects';
import { test, expect } from './test';

const trumma = projects.find((p) => p.slug === 'trumma-drum-machine')!;
const side = projects.find((p) => p.slug === 'side-project-status')!;

test('archive card and detail page show the same born date', async ({ page }) => {
  await page.goto('/learnt/');
  await expect(
    page.locator('article[data-slug="trumma-drum-machine"] time'),
  ).toHaveAttribute('datetime', trumma.born);

  await page.goto('/learnt/trumma-drum-machine/');
  await expect(page.locator(`time[datetime="${trumma.born}"]`).first()).toBeVisible();
});

test('duration is born to died and does not age with today', async ({ page }) => {
  await page.goto('/learnt/side-project-status/');
  await expect(page.locator(`time[datetime="${side.died}"]`).first()).toBeVisible();
  // 2025-04-15 -> 2025-06-01 = 47 days
  await expect(page.locator('dd').filter({ hasText: '47 days' })).toBeVisible();
});

test('an open project shows no duration', async ({ page }) => {
  await page.goto('/learnt/portfolio-v3/');
  await expect(page.getByText('Duration', { exact: true })).toHaveCount(0);
});

test('project JSON-LD carries the born date', async ({ page }) => {
  await page.goto('/learnt/trumma-drum-machine/');
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(raw!).dateCreated).toBe(trumma.born);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/dates.spec.ts`
Expected: FAIL — the card still renders the old value, and the detail metadata still reads `dateCreated`.

- [ ] **Step 3: Update the detail page**

In `src/pages/learnt/[slug].astro`:

- Replace `getProjectDuration` with:

```ts
const getProjectDuration = (start: string, end?: string) => {
  if (!start || !end) return null;
  const days = Math.max(0, Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000));
  if (days < 60) return `${days} day${days === 1 ? '' : 's'}`;
  const months = Math.round(days / 30.44);
  return months >= 12
    ? `${Math.floor(months / 12)} year${months >= 24 ? 's' : ''}`
    : `${months} months`;
};
```

- Call it with `project.born, project.died`.
- `structuredData.dateCreated` reads `project.born`.
- The “Started” block condition and `<time>` read `project.born`.
- The sunset block condition becomes `project.phase === "sunset" && project.died`;
  its `<time>` reads `project.died`.
- The “Completed” block condition and `<time>` read `project.died`.

- [ ] **Step 4: Update the unused detail component and Layout metadata**

- `src/components/ProjectDetail.astro`: the `project.dateSunset` condition and value become `project.died`.
- `src/layouts/Layout.astro`: `datePublished` → `Astro.props.project.born`; `dateModified` → `Astro.props.project.died ?? Astro.props.project.born`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:e2e -- tests/e2e/dates.spec.ts`
Expected: PASS (desktop and mobile).

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: build completes with 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages/learnt/[slug].astro src/components/ProjectDetail.astro src/layouts/Layout.astro tests/e2e/dates.spec.ts
git commit -m "refactor: use born and died on detail pages and metadata"
```

---

### Task 4: Recent/year helpers and full verification

**Files:**
- Modify: `src/data/projects.ts` (`getProjectsByYear`, `getProjectYears`, `getRecentProjects`)
- Modify: `tests/unit/projects.test.ts`

**Interfaces:**
- Consumes: `Project.born`.
- Produces: `getProjectsByYear(year)` and `getProjectYears()` bucket by the ISO `born` year; `getRecentProjects` sorts by `born`.

- [ ] **Step 1: Write the failing helper tests**

Extend the existing import at the top of `tests/unit/projects.test.ts` to also
import `getProjectYears`, `getProjectsByYear`, and `getRecentProjects`. Then add:

```ts
describe('date helpers use born (#15)', () => {
  it('getRecentProjects is ordered by born descending', () => {
    const born = getRecentProjects(5).map((p) => p.born);
    expect([...born].sort().reverse()).toEqual(born);
  });

  it('getProjectsByYear buckets by the born year, timezone-stable', () => {
    const expected = projects
      .filter((p) => p.born.startsWith('2023'))
      .map((p) => p.slug)
      .sort();
    expect(getProjectsByYear(2023).map((p) => p.slug).sort()).toEqual(expected);
  });

  it('getProjectYears returns the born years, newest first', () => {
    const expected = [...new Set(projects.map((p) => Number(p.born.slice(0, 4))))].sort((a, b) => b - a);
    expect(getProjectYears()).toEqual(expected);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/unit/projects.test.ts`
Expected: FAIL — helpers still read `dateCreated || dateStarted`.

- [ ] **Step 3: Update the helpers**

- `getProjectsByYear`: `project.born.slice(0, 4) === String(year)`.
- `getProjectYears`: `projects.map((p) => Number(p.born.slice(0, 4)))`, unique, descending.
- `getRecentProjects`: sort by `b.born.localeCompare(a.born)`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run tests/unit/projects.test.ts`
Expected: PASS.

- [ ] **Step 5: Run the full verification**

Run each and confirm:

- `npm test` → all unit tests pass
- `npm run build` → 0 errors
- `npm run test:e2e` → all specs pass (desktop + mobile)
- `grep -rnE "dateStarted|dateCreated|dateCompleted|sunsetDate|dateSunset" src` → no matches
- `node --experimental-strip-types -e "import {projects} from './src/data/projects.ts'; console.log(projects.length, projects.filter(p=>p.died).length)"` → `42 36`

- [ ] **Step 6: Commit**

```bash
git add src/data/projects.ts tests/unit/projects.test.ts
git commit -m "fix: derive recent and year helpers from born"
```
