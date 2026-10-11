# Testing Setup (Component + E2E + CI) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add component tests (Vitest + Astro Container API), end-to-end tests (Playwright against the built site), and a GitHub Actions workflow that runs both on every PR — so Phase 2 (#15–#18, data-layer migration) has a safety net that catches broken slugs and regressions of the Phase 1 fixes.

**Architecture:** Unit/component tests live in `tests/unit/*.test.ts`, run by Vitest through Astro's `getViteConfig()` so `.astro` files compile, and render components to HTML strings with `experimental_AstroContainer`. E2E tests live in `tests/e2e/*.spec.ts`, run by Playwright against `astro preview` serving `dist/`, on a desktop and a mobile Chromium project. A frozen `slugs.json` fixture pins every `/learnt/<slug>/` URL so the #18 migration cannot silently change URLs. Analytics is blocked in all tests so CI never sends hits to GA4 or Clarity.

**Tech Stack:** Astro 5.18, TypeScript (strict), Vitest 3.2, `@playwright/test` 1.55 (Chromium only), GitHub Actions, Node 22.

**Spec:** Testing proposal from the 2026-10-07 session (three tickets: component tests, E2E tests, CI), plus the behavior fixed in PR #33 (issues #10, #11, #13, #14), known bug #2 (filters ignored on the static build), and #18's acceptance criterion "deploy preview matches current URLs (no broken slugs)".

## Global Constraints

- Precondition: PR #33 (`fix/phase-1-fixes`) is merged into `master`. Tests assert its behavior (`src/data/site.ts`, footer links, About "Currently building").
- Branch: `chore/test-setup`, created from up-to-date `master`. Never commit to `master`.
- Commit trailer on every commit: `Facilitated-by: Claude Opus 5.5 <noreply@anthropic.com>`. No `Co-Authored-By`.
- Node 22 (local is v22.23.2). Do not upgrade Astro or Tailwind in this plan.
- Unit tests: `tests/unit/**/*.test.ts`. E2E tests: `tests/e2e/**/*.spec.ts`. Neither runner may pick up the other's files.
- Tests never send network traffic to `googletagmanager.com`, `google-analytics.com`, or `clarity.ms`.
- Tests never invent project data; they read `src/data/projects.ts` or the frozen slug fixture.
- Known bug #2 is documented with `test.fail()`, not fixed, in this plan.

## Review Focus

1. **Unknown slug** (`/learnt/does-not-exist/`) — expect a 404 status, not a 200 with an empty page. → Task 3 `slugs.spec.ts`.
2. **Card for a project with no `liveUrl` or `githubUrl`** — expect no `href="undefined"` and no dead "live demo"/"source code" links. → Task 1 `ProjectCard.test.ts`.
3. **Card for a project with an empty `technologies` array** — expect it to render without a "+N more" chip or a crash. → Task 1 `ProjectCard.test.ts`.
4. **Footer on a phone-width viewport** — expect the social links to stay visible and correct. → Task 4 `footer.spec.ts` runs on the `mobile` project.
5. **CI runs that load the real analytics scripts** — expect zero requests to GA4/Clarity from tests. → Task 3 shared fixture blocks them; Task 4 `analytics.spec.ts` asserts no GA `collect` request is made.

---

## File Structure

| Path | Responsibility |
|---|---|
| `vitest.config.ts` (create) | Vitest config via Astro's `getViteConfig`; limits to `tests/unit` |
| `tests/unit/fixtures.ts` (create) | `makeProject()` — builds a valid `Project` with overrides |
| `tests/unit/ProjectCard.test.ts` (create) | Component tests for `ProjectCard.astro` |
| `tests/unit/projects.test.ts` (create) | Unit tests for data helpers in `src/data/projects.ts` |
| `src/data/projects.ts:2197-2199` (modify) | `getFeaturedProjects()` excludes `phase: 'active'` |
| `src/pages/index.astro:4-9` (modify) | Use `getFeaturedProjects()` instead of inline filter |
| `playwright.config.ts` (create) | Playwright config: preview web server, desktop + mobile projects, service workers blocked |
| `tests/e2e/test.ts` (create) | Shared `test`/`expect` with analytics hosts aborted |
| `tests/e2e/fixtures/slugs.json` (create) | Frozen list of the 42 project slugs |
| `tests/e2e/slugs.spec.ts` (create) | Every slug returns 200 with a heading; unknown slug 404s |
| `tests/e2e/home.spec.ts` (create) | Featured excludes active projects; no fake progress |
| `tests/e2e/about.spec.ts` (create) | "Currently building" lists every active project |
| `tests/e2e/footer.spec.ts` (create) | Real social links, portfolio link, build year |
| `tests/e2e/analytics.spec.ts` (create) | Analytics tags configured; no GA hits sent from tests |
| `tests/e2e/filters.spec.ts` (create) | Documents bug #2 with `test.fail()` |
| `.github/workflows/test.yml` (create) | CI: build, unit, e2e on PRs and pushes to `master` |
| `package.json` (modify) | `test`, `test:watch`, `test:e2e` scripts; dev deps |
| `.gitignore` (modify) | Ignore Playwright output |
| `README.md` (modify) | Replace starter text with run/test instructions |

---

### Task 1: Vitest + Astro Container setup with ProjectCard component tests

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/unit/fixtures.ts`
- Create: `tests/unit/ProjectCard.test.ts`
- Modify: `package.json` (scripts + devDependencies)

**Interfaces:**
- Consumes: `Project` type from `src/data/projects.ts`; `ProjectCard.astro` props `{ project: Project; featured?: boolean; showFullDescription?: boolean }`.
- Produces: `makeProject(overrides?: Partial<Project>): Project` in `tests/unit/fixtures.ts`; `npm test` script (runs `vitest run`).

- [ ] **Step 1: Create the branch**

```bash
git checkout master && git pull --ff-only origin master
git checkout -b chore/test-setup
```

- [ ] **Step 2: Install Vitest**

```bash
npm i -D vitest@^3.2.4
```

Expected: `package.json` devDependencies now include `"vitest": "^3.2.4"`.

- [ ] **Step 3: Add scripts to `package.json`**

Replace the `"scripts"` block with:

```json
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest run",
    "test:watch": "vitest"
  },
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 5: Create `tests/unit/fixtures.ts`**

```ts
import type { Project } from '../../src/data/projects';

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'test-1',
    title: 'Test Project',
    slug: 'test-project',
    description: 'Short description',
    longDescription: 'Long description',
    technologies: ['Astro', 'TypeScript'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'beginner',
    phase: 'archived',
    dateStarted: '2023-01-15',
    screenshot: '/images/project-placeholder.svg',
    features: [],
    learnings: [],
    challenges: [],
    tags: ['astro'],
    featured: false,
    ...overrides,
  };
}
```

- [ ] **Step 6: Write the component tests in `tests/unit/ProjectCard.test.ts`**

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ProjectCard from '../../src/components/ProjectCard.astro';
import type { Project } from '../../src/data/projects';
import { makeProject } from './fixtures';

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (project: Project) =>
  container.renderToString(ProjectCard, { props: { project } });

describe('ProjectCard', () => {
  it('renders the title as a link to the detail page', async () => {
    const html = await render(makeProject({ title: 'Burble V1', slug: 'burble-v1' }));
    expect(html).toContain('href="/learnt/burble-v1"');
    expect(html).toContain('Burble V1');
  });

  it('shows no progress value for in-progress projects (#10)', async () => {
    const html = await render(makeProject({ status: 'in-progress' }));
    expect(html).not.toContain('width: 75%');
    expect(html).not.toContain('>75%<');
  });

  it('renders no live or source links when the urls are missing', async () => {
    const html = await render(makeProject({ liveUrl: undefined, githubUrl: undefined }));
    expect(html).not.toContain('href="undefined"');
    expect(html).not.toContain('live demo');
    expect(html).not.toContain('source code');
  });

  it('renders links when the urls are present', async () => {
    const html = await render(
      makeProject({ liveUrl: 'https://example.com', githubUrl: 'https://github.com/Nerajno/x' }),
    );
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('href="https://github.com/Nerajno/x"');
  });

  it('renders with an empty technologies list', async () => {
    const html = await render(makeProject({ technologies: [] }));
    expect(html).toContain('Test Project');
    expect(html).not.toMatch(/\+-?\d+ more/);
  });

  it('collapses more than four technologies into a "+N more" chip', async () => {
    const html = await render(makeProject({ technologies: ['A', 'B', 'C', 'D', 'E', 'F'] }));
    expect(html).toMatch(/\+2\s*more/);
  });
});
```

- [ ] **Step 7: Run the tests**

Run: `npm test`
Expected: 6 passed. These are characterization tests of behavior fixed in PR #33, so they pass on first run. If any fails, stop: that is a real bug in `ProjectCard.astro` — report it rather than editing the test to pass.

- [ ] **Step 8: Prove the #10 test can fail**

Temporarily add `<span>75%</span>` just inside the `<article>` in `src/components/ProjectCard.astro`, run `npm test`, confirm "shows no progress value" FAILS, then revert with `git checkout src/components/ProjectCard.astro` and re-run `npm test` (6 passed).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vitest.config.ts tests/unit
git commit -m "test: add Vitest with Astro Container and ProjectCard tests

Facilitated-by: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Move the Featured rule into `getFeaturedProjects()` (TDD)

**Files:**
- Create: `tests/unit/projects.test.ts`
- Modify: `src/data/projects.ts:2197-2199`
- Modify: `src/pages/index.astro:4-9`

**Interfaces:**
- Consumes: `projects: Project[]` and `getFeaturedProjects(): Project[]` from `src/data/projects.ts`.
- Produces: `getFeaturedProjects()` returns projects where `featured === true && phase !== 'active'`, in data order. `index.astro` calls it.

- [ ] **Step 1: Write the failing test in `tests/unit/projects.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { getFeaturedProjects, projects } from '../../src/data/projects';

describe('getFeaturedProjects', () => {
  it('never returns active projects (#14)', () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThan(0);
    for (const project of featured) {
      expect(project.featured).toBe(true);
      expect(project.phase).not.toBe('active');
    }
  });

  it('returns every featured non-active project in data order', () => {
    const expected = projects
      .filter((p) => p.featured && p.phase !== 'active')
      .map((p) => p.slug);
    expect(getFeaturedProjects().map((p) => p.slug)).toEqual(expected);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/projects.test.ts`
Expected: FAIL — "never returns active projects" fails because `portfolio-v3` (featured, `phase: 'active'`) is returned.

- [ ] **Step 3: Implement in `src/data/projects.ts`**

Replace:

```ts
export function getFeaturedProjects(): Project[] {
  return projects.filter(project => project.featured);
}
```

with:

```ts
// Learnt is for past projects; living ones are listed on the About page.
export function getFeaturedProjects(): Project[] {
  return projects.filter(project => project.featured && project.phase !== 'active');
}
```

- [ ] **Step 4: Use it in `src/pages/index.astro`**

Replace the frontmatter import and filter:

```ts
import { getAllProjects } from '../data/projects';

// Learnt is for past projects; living ones are listed on the About page.
const featuredProjects = getAllProjects().filter(
  project => project.featured && project.phase !== 'active'
);
```

with:

```ts
import { getFeaturedProjects } from '../data/projects';

const featuredProjects = getFeaturedProjects();
```

- [ ] **Step 5: Run tests and build**

Run: `npm test && npm run build`
Expected: 8 passed; build completes with 47 pages.

- [ ] **Step 6: Commit**

```bash
git add tests/unit/projects.test.ts src/data/projects.ts src/pages/index.astro
git commit -m "refactor: move Featured rule into getFeaturedProjects with tests

Facilitated-by: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Playwright setup, analytics-blocking fixture, and slug coverage

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/test.ts`
- Create: `tests/e2e/fixtures/slugs.json`
- Create: `tests/e2e/slugs.spec.ts`
- Modify: `package.json` (script + devDependency)
- Modify: `.gitignore`

**Interfaces:**
- Consumes: built site in `dist/` served by `astro preview`.
- Produces: `test` and `expect` exported from `tests/e2e/test.ts` — every spec imports from here, never directly from `@playwright/test`. `npm run test:e2e` (builds, then runs Playwright). Projects named `desktop` and `mobile`.

- [ ] **Step 1: Install Playwright**

```bash
npm i -D @playwright/test@^1.55.0
npx playwright install chromium
```

- [ ] **Step 2: Add the e2e script to `package.json`**

Add after `"test:watch": "vitest"`:

```json
    "test:e2e": "astro build && playwright test"
```

- [ ] **Step 3: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
    // Partytown runs GA through a service worker; blocking it keeps GA from executing.
    serviceWorkers: 'block',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 4: Create `tests/e2e/test.ts`**

```ts
import { test as base, expect } from '@playwright/test';

const ANALYTICS = /(googletagmanager\.com|google-analytics\.com|clarity\.ms)/;

// Abort analytics so test runs never send hits to GA4 or Clarity.
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route(ANALYTICS, (route) => route.abort());
    await use(context);
  },
});

export { expect };
```

- [ ] **Step 5: Ignore Playwright output in `.gitignore`**

Append:

```
# test output
test-results/
playwright-report/
.playwright-mcp/
```

- [ ] **Step 6: Generate the frozen slug fixture**

```bash
npm run build
mkdir -p tests/e2e/fixtures
node -e "const fs=require('fs');const s=fs.readdirSync('dist/learnt',{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name).sort();fs.writeFileSync('tests/e2e/fixtures/slugs.json',JSON.stringify(s,null,2)+'\n');console.log(s.length)"
```

Expected output: `42`. This file is intentionally frozen: it is the URL contract #18 must keep. Only edit it when a project is deliberately added or removed.

- [ ] **Step 7: Write `tests/e2e/slugs.spec.ts`**

```ts
import { readFileSync } from 'node:fs';
import { test, expect } from './test';

const slugs: string[] = JSON.parse(
  readFileSync(new URL('./fixtures/slugs.json', import.meta.url), 'utf8'),
);

test.describe('project detail URLs', () => {
  for (const slug of slugs) {
    test(`/learnt/${slug}/ renders`, async ({ page }) => {
      const response = await page.goto(`/learnt/${slug}/`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1').first()).not.toBeEmpty();
    });
  }

  test('unknown slug returns 404', async ({ page }) => {
    const response = await page.goto('/learnt/does-not-exist/');
    expect(response?.status()).toBe(404);
  });
});
```

- [ ] **Step 8: Run it**

Run: `npm run test:e2e`
Expected: 86 passed (43 tests × 2 projects).

- [ ] **Step 9: Prove the slug test can fail**

Temporarily add `"not-a-real-slug"` to `tests/e2e/fixtures/slugs.json`, run `npx playwright test slugs --project=desktop`, confirm `/learnt/not-a-real-slug/ renders` FAILS with status 404, then revert with `git checkout tests/e2e/fixtures/slugs.json` (if the file is not yet committed, remove the line by hand).

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json playwright.config.ts tests/e2e .gitignore
git commit -m "test: add Playwright e2e with frozen slug contract

Every /learnt/<slug>/ must return 200 so the content-collection
migration (#18) cannot silently change URLs. Analytics hosts are
aborted and service workers blocked so tests never send GA hits.

Facilitated-by: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Page behavior specs (home, about, footer, analytics, known bug #2)

**Files:**
- Create: `tests/e2e/home.spec.ts`
- Create: `tests/e2e/about.spec.ts`
- Create: `tests/e2e/footer.spec.ts`
- Create: `tests/e2e/analytics.spec.ts`
- Create: `tests/e2e/filters.spec.ts`

**Interfaces:**
- Consumes: `test`, `expect` from `tests/e2e/test.ts`; `projects` from `src/data/projects.ts`; `site` from `src/data/site.ts` (`site.portfolio: string`, `site.social.{github,linkedin,x}.url: string`).
- Produces: nothing consumed later.

- [ ] **Step 1: Write `tests/e2e/home.spec.ts`**

```ts
import { projects } from '../../src/data/projects';
import { test, expect } from './test';

const activeTitles = projects.filter((p) => p.phase === 'active').map((p) => p.title);

test.describe('home page', () => {
  test('Featured shows no active projects (#14)', async ({ page }) => {
    await page.goto('/');
    const featured = page.locator('section', {
      has: page.getByRole('heading', { name: 'Featured Projects' }),
    });
    await expect(featured.locator('article').first()).toBeVisible();
    const titles = (await featured.locator('article h3').allTextContents()).map((t) => t.trim());
    for (const title of activeTitles) {
      expect(titles).not.toContain(title);
    }
  });

  test('no card shows a made-up progress value (#10)', async ({ page }) => {
    await page.goto('/');
    expect(await page.content()).not.toContain('width: 75%');
  });
});
```

- [ ] **Step 2: Write `tests/e2e/about.spec.ts`**

```ts
import { projects } from '../../src/data/projects';
import { test, expect } from './test';

const active = projects.filter((p) => p.phase === 'active');

test('About lists every active project under "Currently building" (#14)', async ({ page }) => {
  await page.goto('/about/');
  const list = page.locator('h2:has-text("Currently building") ~ ul');
  await expect(list).toBeVisible();
  for (const project of active) {
    await expect(list.getByRole('link', { name: project.title, exact: true })).toHaveAttribute(
      'href',
      `/learnt/${project.slug}`,
    );
  }
});
```

- [ ] **Step 3: Write `tests/e2e/footer.spec.ts`**

```ts
import { site } from '../../src/data/site';
import { test, expect } from './test';

const socials: [label: string, href: string][] = [
  ['GitHub', site.social.github.url],
  ['LinkedIn', site.social.linkedin.url],
  ['X (Twitter)', site.social.x.url],
];

for (const path of ['/', '/learnt/', '/about/', '/contact/']) {
  test(`footer on ${path} links to real profiles (#11, #13)`, async ({ page }) => {
    await page.goto(path);
    const footer = page.locator('footer');
    for (const [label, href] of socials) {
      const link = footer.locator(`a.social-link[aria-label="${label}"]`);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', href);
    }
    await expect(footer.getByRole('link', { name: site.name })).toHaveAttribute('href', site.portfolio);
    await expect(footer).toContainText(`© ${new Date().getFullYear()}`);
    expect(await page.content()).not.toContain('yourusername');
  });
}
```

- [ ] **Step 4: Write `tests/e2e/analytics.spec.ts`**

```ts
import { test, expect } from './test';

test('analytics tags are configured with real IDs', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html).toContain('surxnzd38u');
  expect(html).not.toContain('REPLACE_WITH_PROJECT_ID');
  expect(html).toContain('G-CXQYQ18LFT');
  expect(html).toContain('type="text/partytown"');
});

test('test runs send no GA hits', async ({ page }) => {
  const hits: string[] = [];
  page.on('requestfinished', (req) => {
    if (req.url().includes('google-analytics.com/g/collect')) hits.push(req.url());
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(hits).toEqual([]);
});
```

- [ ] **Step 5: Write `tests/e2e/filters.spec.ts`**

```ts
import { test, expect } from './test';

const KNOWN_BUG =
  'Bug #2: learnt.astro reads Astro.url.searchParams at build time, so filters do nothing on the static site';

test('category filter narrows the list', async ({ page }) => {
  test.fail(true, KNOWN_BUG);
  await page.goto('/learnt/');
  const all = await page.locator('article').count();
  await page.goto('/learnt/?category=backend');
  expect(await page.locator('article').count()).toBeLessThan(all);
});

test('unknown category shows no projects', async ({ page }) => {
  test.fail(true, KNOWN_BUG);
  await page.goto('/learnt/?category=not-a-category');
  expect(await page.locator('article').count()).toBe(0);
});
```

- [ ] **Step 6: Run the full e2e suite**

Run: `npm run test:e2e`
Expected: all pass. The two `filters.spec.ts` tests report as "expected to fail" (green). If a footer or About test fails, stop and check whether PR #33 is merged into this branch's base.

- [ ] **Step 7: Prove the footer test can fail**

Do not edit `src/data/site.ts` for this (the test reads its expected values from there). Instead, temporarily change the X link in `src/layouts/Layout.astro` from `href={site.social.x.url}` to `href="https://x.com/wrong"`, run `npm run test:e2e -- footer --project=desktop`, confirm FAIL, then `git checkout src/layouts/Layout.astro`.

- [ ] **Step 8: Commit**

```bash
git add tests/e2e
git commit -m "test: cover Featured, About, footer, analytics, and document bug #2

Filter tests use test.fail() so they flip to a visible failure the
moment #2 is fixed and the annotation can be removed.

Facilitated-by: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: GitHub Actions workflow and README

**Files:**
- Create: `.github/workflows/test.yml`
- Modify: `README.md` (replace whole file)

**Interfaces:**
- Consumes: `npm test`, `npm run test:e2e` from Tasks 1 and 3.
- Produces: a `Test` workflow that reports status on every PR.

- [ ] **Step 1: Create `.github/workflows/test.yml`**

```yaml
name: Test

on:
  pull_request:
  push:
    branches: [master]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report
          retention-days: 7
```

- [ ] **Step 2: Replace `README.md`**

````markdown
# Learnt

Archive of past projects at [learnt.developingdvlpr.com](https://learnt.developingdvlpr.com). Astro 5 + Tailwind, static output.

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Serve the build locally |
| `npm test` | Component + unit tests (Vitest) |
| `npm run test:e2e` | Build, then end-to-end tests (Playwright, desktop + mobile) |

First e2e run: `npx playwright install chromium`.

## Tests

- `tests/unit/` — Vitest. Components render through Astro's Container API.
- `tests/e2e/` — Playwright against `astro preview`. Import `test`/`expect` from `tests/e2e/test.ts`, which blocks analytics.
- `tests/e2e/fixtures/slugs.json` — frozen list of project URLs. Edit only when deliberately adding or removing a project.
````

- [ ] **Step 3: Validate the workflow file parses**

Run: `node -e "const y=require('fs').readFileSync('.github/workflows/test.yml','utf8');if(!/jobs:\n  test:/.test(y))throw new Error('bad');console.log('ok')"`
Expected: `ok`

- [ ] **Step 4: Run everything locally one last time**

Run: `npm ci && npm test && npm run test:e2e`
Expected: `npm ci` succeeds from the committed lockfile; all unit and e2e tests pass.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/test.yml README.md
git commit -m "ci: run unit and e2e tests on every PR

Facilitated-by: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 6: Push and open the PR (only after the user approves)**

```bash
git push -u origin chore/test-setup
gh pr create --base master --title "Testing: Vitest component tests, Playwright e2e, CI"
```

Expected: the `Test` workflow runs on the PR and passes, including `npm ci` on Linux with the macOS-generated lockfile. If `npm ci` fails on a missing native binary, regenerate the lockfile with `npm i --package-lock-only` and re-push.

- [ ] **Step 7: Manual follow-up for the user**

Making a failing test block merges needs a GitHub setting: Settings → Branches → add rule for `master` → "Require status checks to pass" → select `test`. Code cannot do this.
