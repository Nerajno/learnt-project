# Coursework Plot (#20) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render `tier: 'coursework'` projects as a compact, collapsed list at the bottom of `/learnt`, keep them out of the card grid and Featured, and leave the full unit, typecheck, build, and e2e suites green.

**Architecture:** The data layer exposes `getCardProjects()` (every non-coursework project) and `getCourseworkProjects()` (coursework, newest first). `/learnt` renders `ProjectList` with the card projects and `CourseworkList` with the coursework projects. `getFeaturedProjects()` also excludes coursework, so the home page cannot headline a tutorial clone. Coursework detail pages still exist; only the card grid and Featured change.

**Tech Stack:** Astro 5.13, TypeScript, Tailwind 3.4, Vitest 3.2, Playwright 1.64 + axe.

**Spec:** GitHub issue #20, "Add collapsed Coursework plot for tutorial projects" — https://github.com/Nerajno/learnt-project/issues/20. There is no local design doc; the issue body is the authority.

**Starting state:** `feature/20-coursework-plot` already contains the data selectors, the `CourseworkList` component, the `/learnt` integration, and the first coursework specs in the working tree. Task 1 fixes a pre-existing test-harness bug, Task 2 verifies the data selectors, Task 3 fixes the remaining axe failure, and Task 4 repairs existing e2e specs that still assume every project is a card.

## Global Constraints

- Exactly 42 projects: 5 `headstone`, 28 `marker`, 9 `coursework`. Never hard-code these counts in tests; derive them from `projects`.
- `tier` values are exactly `'headstone' | 'marker' | 'coursework'`.
- Coursework detail pages must keep rendering at `/learnt/<slug>/`.
- The archive card count is `getCardProjects().length`; the full project count is `projects.length`. Do not use `projects.length` for anything rendered in `#project-list` or `#archive-count`.
- `CourseworkList` uses a native `<details>`/`<summary>`; it must be keyboard operable and have zero serious/critical axe violations in light and dark.
- No new dependencies. Use the existing token utilities; no raw hex colours.
- E2E runs through `npm run test:e2e` (build, then preview at `127.0.0.1:4321`, desktop + mobile). Never point tests at `astro dev`.

## Review Focus

- A coursework project must still resolve at `/learnt/<slug>/` even though it is no longer a card.
- Home Featured must contain zero coursework projects.
- Archive counts, stage counts, clear-all, and the no-JavaScript render must all use the card count (33), not the full project count (42).
- The Repo link's accessible name must include its visible text, `Repo`; axe `label-content-name-mismatch` is the failure this fixes.
- If a project ever has zero coursework, `/learnt` must render no empty `<details>` block.

## Before Task 1

Run `npm install`. If Chromium is missing, run `npx playwright install chromium`.

Commit this plan before changing code:

```bash
git add docs/superpowers/plans/2026-11-07-coursework-plot.md
git commit -m "docs: add the #20 coursework plot plan"
```

---

### Task 1: Unblock the unit suite path handling (pre-existing)

**Files:**
- Modify: `tests/tokens.test.ts:5`

**Interfaces:**
- Produces: a `SRC` path that works when the repository path contains spaces.

- [ ] **Step 1: Run the unit suite to confirm the pre-existing failure**

Run: `npm test`
Expected: FAIL — `tests/tokens.test.ts` throws `ENOENT ... learnt%20-%20projects/learnt-project/src/`.

- [ ] **Step 2: Replace the URL pathname with `fileURLToPath`**

In `tests/tokens.test.ts`, add the import and replace the constant:

```ts
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));
```

- [ ] **Step 3: Run the tokens test to verify it passes**

Run: `npx vitest run tests/tokens.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add tests/tokens.test.ts
git commit -m "test: resolve the src path with fileURLToPath"
```

---

### Task 2: Verify the data-layer split

**Files:**
- Modify (already in tree): `src/data/projects.ts`
- Modify (already in tree): `tests/unit/projects.test.ts`

**Interfaces:**
- Consumes: `projects`, `Project`.
- Produces: `getCardProjects(): Project[]`, `getCourseworkProjects(): Project[]`; `getFeaturedProjects()` excludes `tier === 'coursework'`.

- [ ] **Step 1: Run the focused unit tests**

Run: `npx vitest run tests/unit/projects.test.ts`
Expected: PASS, including the three `coursework plot (#20)` tests.

- [ ] **Step 2: Confirm the selectors partition every project exactly once**

Run:

```bash
node --experimental-strip-types -e "import {projects,getCardProjects,getCourseworkProjects} from './src/data/projects.ts'; const cards=getCardProjects(), course=getCourseworkProjects(); console.log('all',projects.length,'cards',cards.length,'course',course.length); console.log('coursework only', course.every(p=>p.tier==='coursework')); console.log('cards exclude coursework', cards.every(p=>p.tier!=='coursework')); console.log('newest first', course.map(p=>p.born).join(',') === [...course.map(p=>p.born)].sort().reverse().join(','));"
```

Expected: `all 42 cards 33 course 9`, both booleans `true`, `newest first true`.

- [ ] **Step 3: Commit**

```bash
git add src/data/projects.ts tests/unit/projects.test.ts
git commit -m "feat: split coursework from the archive card grid (#20)"
```

---

### Task 3: Fix the coursework list accessibility and verify the plot

**Files:**
- Modify (already in tree): `src/components/CourseworkList.astro`
- Modify (already in tree): `src/pages/learnt.astro`
- Modify (already in tree): `tests/e2e/coursework.spec.ts`
- Create: `tests/unit/CourseworkList.test.ts`

**Interfaces:**
- Consumes: `Project[]`; `/learnt` passes `getCourseworkProjects()` from Task 2.
- Produces: `details#coursework` with a `summary` whose text starts `Coursework (<n>)`, one `li` per coursework project, a detail link, a `<time datetime>`, an optional Repo link, and an optional epitaph.

- [ ] **Step 1: Run the coursework e2e spec to confirm the axe failure**

Run: `npm run test:e2e -- tests/e2e/coursework.spec.ts`
Expected: 7 pass, 1 skip, 4 fail — each failure is `label-content-name-mismatch` on the Repo link because the visible text `Repo` is not in `aria-label="<title> repository"`.

- [ ] **Step 2: Write the failing component test**

Create `tests/unit/CourseworkList.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import CourseworkList from '../../src/components/CourseworkList.astro';
import { makeProject } from './fixtures';

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe('CourseworkList', () => {
  it('renders nothing when there is no coursework', async () => {
    const html = await container.renderToString(CourseworkList, { props: { projects: [] } });
    expect(html).not.toContain('id="coursework"');
  });

  it('renders a collapsed list with title, date, repo, and epitaph', async () => {
    const html = await container.renderToString(CourseworkList, {
      props: {
        projects: [
          makeProject({
            title: 'Tutorial',
            slug: 'tutorial',
            born: '2024-03-01',
            githubUrl: 'https://github.com/Nerajno/x',
            epitaph: 'Learned loops',
          }),
        ],
      },
    });
    expect(html).toContain('id="coursework"');
    expect(html).not.toMatch(/<details[^>]*\sopen/);
    expect(html).toContain('Coursework (1)');
    expect(html).toContain('href="/learnt/tutorial"');
    expect(html).toContain('datetime="2024-03-01"');
    expect(html).toContain('href="https://github.com/Nerajno/x"');
    expect(html).toContain('aria-label="Repo: Tutorial"');
    expect(html).toContain('Learned loops');
  });
});
```

Run: `npx vitest run tests/unit/CourseworkList.test.ts`
Expected: FAIL — the Repo link currently has `aria-label="Tutorial repository"`, not `aria-label="Repo: Tutorial"`.

- [ ] **Step 3: Make the accessible name include the visible text**

In `src/components/CourseworkList.astro`, change the Repo link's `aria-label` to include `Repo` and open it like the card links:

```astro
<a
  href={project.githubUrl}
  target="_blank"
  rel="noopener noreferrer"
  class="text-sm"
  aria-label={`Repo: ${project.title}`}
>
  Repo
</a>
```

- [ ] **Step 4: Run the component and e2e tests**

Run: `npx vitest run tests/unit/CourseworkList.test.ts`
Expected: PASS, both tests.

Run: `npm run test:e2e -- tests/e2e/coursework.spec.ts`
Expected: PASS (desktop and mobile; the mobile keyboard check is skipped).

- [ ] **Step 5: Commit**

```bash
git add src/components/CourseworkList.astro src/pages/learnt.astro tests/e2e/coursework.spec.ts tests/unit/CourseworkList.test.ts
git commit -m "feat: add the collapsed coursework plot (#20)"
```

---

### Task 4: Align existing e2e specs with card-only counts

**Files:**
- Modify: `tests/e2e/archive-a11y.spec.ts`
- Modify: `tests/e2e/archive-filters.spec.ts`
- Modify: `tests/e2e/archive-render.spec.ts`
- Modify: `tests/e2e/learnings.spec.ts`

**Interfaces:**
- Consumes: `getCardProjects()` from Task 2; `toArchiveItem`, `deriveStage` from `src/lib/archive`.
- Produces: no production code; only test expectations that use `getCardProjects()` instead of `projects`.

- [ ] **Step 1: Run the full e2e suite to confirm the stale expectations**

Run: `npm run test:e2e`
Expected: the following unique failures (each repeated on desktop/mobile where noted):
- `archive-a11y` — "all projects still render" expects 42 cards, sees 33.
- `archive-filters` — "clear all resets the list and the URL" expects 42 visible cards, sees 33.
- `archive-render` — "renders every project card..." expects 42 cards and 42-based stage counts, sees 33 and card-only counts.
- `learnings` — "every card matches its detail page..." loops over all 42 fixture slugs and finds no card for the 9 coursework slugs.
- `coursework` — the four axe failures from Task 3 (fixed before this task).

- [ ] **Step 2: Update `archive-a11y.spec.ts`**

Replace the `projects` import with `getCardProjects` and use the card count:

```ts
import { getCardProjects } from '../../src/data/projects';

const cardCount = getCardProjects().length;
```

- `all projects still render` → expect `cardCount` cards (rename the test to `all card projects still render`).
- `the category query filters the archive` → `expect(count).toBeLessThan(cardCount)`.

- [ ] **Step 3: Update `archive-filters.spec.ts`**

Replace the `projects` import with `getCardProjects` and add:

```ts
const cardProjects = getCardProjects();
```

- The `?stage=composted` expectation filters `cardProjects`, not `projects`.
- `expect(count).toBeLessThan(cardProjects.length)`.
- `clear all resets the list and the URL` → `toHaveCount(cardProjects.length)`.

- [ ] **Step 4: Update `archive-render.spec.ts`**

Replace the `projects` import with `getCardProjects`, add `const cardProjects = getCardProjects();`, and use it for the card count, `#archive-count`, and the stage-count loop:

```ts
await expect(page.locator('#project-list article[data-slug]')).toHaveCount(cardProjects.length);
await expect(page.locator('#archive-count')).toHaveText(String(cardProjects.length));

const items = cardProjects.map(toArchiveItem);
```

- [ ] **Step 5: Update `learnings.spec.ts`**

Keep the frozen fixture, but intersect it with the card projects so coursework is not expected to have a card:

```ts
import { getCardProjects } from '../../src/data/projects';

const cardSlugs = new Set(getCardProjects().map((p) => p.slug));
const cardFixtureSlugs = slugs.filter((slug) => cardSlugs.has(slug));
```

Loop over `cardFixtureSlugs` in the "every card matches its detail page" test. The two explicit slug tests (`trumma-drum-machine`, `trapper-keeper-v1`) are already cards and stay unchanged.

- [ ] **Step 6: Re-run the repaired specs**

Run: `npm run test:e2e -- tests/e2e/archive-a11y.spec.ts tests/e2e/archive-filters.spec.ts tests/e2e/archive-render.spec.ts tests/e2e/learnings.spec.ts`
Expected: PASS on desktop and mobile (the learnings data check skips mobile by design).

- [ ] **Step 7: Commit**

```bash
git add tests/e2e/archive-a11y.spec.ts tests/e2e/archive-filters.spec.ts tests/e2e/archive-render.spec.ts tests/e2e/learnings.spec.ts
git commit -m "test: count only card projects in the archive e2e"
```

---

### Task 5: Full verification

**Files:**
- No production changes; verification only.

- [ ] **Step 1: Run the unit suite**

Run: `npm test`
Expected: PASS, all test files, 0 failures.

- [ ] **Step 2: Run the type checker**

Run: `npm run typecheck`
Expected: 0 errors (the three existing hints in `src/pages/learnt/[slug].astro` are allowed).

- [ ] **Step 3: Run the build**

Run: `npm run build`
Expected: build completes with 0 errors.

- [ ] **Step 4: Run the full e2e suite**

Run: `npm run test:e2e`
Expected: all specs pass on desktop and mobile; the known skips are the mobile-only keyboard/data checks.

- [ ] **Step 5: Confirm no stale full-project counts remain in the archive specs**

Run: `grep -rn "projects.length" tests/e2e/archive-a11y.spec.ts tests/e2e/archive-filters.spec.ts tests/e2e/archive-render.spec.ts tests/e2e/learnings.spec.ts`
Expected: no matches.

- [ ] **Step 6: Confirm the working tree is clean**

Run: `git status --short`
Expected: no output. If any verification fix produced a change, commit it with a message naming the fix.
