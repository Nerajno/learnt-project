# Project Screenshot Placeholders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate every project-screenshot 404 by rendering a designed placeholder when a screenshot file is missing, and guard the data with tests.

**Architecture:** Screenshots stay as public paths, but `Project.screenshot` becomes optional and no longer points at files that don't exist. One server-rendered `ProjectImage` component checks file existence at build time and renders either a real `<img>` or a token-friendly placeholder box. A Vitest guard fails the build if data ever declares a missing file; a Playwright test fails if any rendered `<img>` is broken.

**Tech Stack:** Astro 5 (static), Tailwind 3, TypeScript, Vitest 3.2.7, Playwright 1.64 (both already present in `node_modules`, not yet declared in `package.json`).

**Spec:** Issue #43 (https://github.com/Nerajno/learnt-project/issues/43), plus the Nov 2026 design approved in conversation (approach A).

## Global Constraints

- Static build only; no new runtime dependencies.
- Node 22; `astro build` must stay green.
- Do not invent screenshot files or capture dead demos.
- Use the site's current Tailwind palette (`gray` / `primary`) for now. #38 will swap these for dvlpr-dialects spine tokens (`--bg-alt`, `--border-strong`, `--font-mono`); leave a comment pointing there.
- Every real `<img>` keeps non-empty alt text from `altText` or a title fallback.
- `og:image` must never point at a missing file.

## Review Focus

- A `screenshot` value that exists on disk but is a directory, not a file.
- Paths with a query string or hash (`/x.png?v=1`) must still resolve.
- Case sensitivity: a path that works on macOS may 404 on Linux CI.
- Lazy-loaded images must be loaded before the e2e check reads `naturalWidth`.
- `og:image` when `project` is absent or `screenshot` is undefined (home/archive pages).

---

### Task 1: Public-asset existence helper

**Files:**
- Create: `src/lib/images.ts`
- Create: `vitest.config.ts`
- Create: `tests/images.test.ts`
- Modify: `package.json` (scripts + devDependencies)

**Interfaces:**
- Produces: `publicFileExists(pathname?: string): boolean`
- Produces: `repoLabel(githubUrl: string | undefined, slug: string): string`

- [ ] **Step 1: Write the failing test**

`tests/images.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { publicFileExists, repoLabel } from '../src/lib/images';

describe('publicFileExists', () => {
  it('returns true for an existing public asset', () => {
    expect(publicFileExists('/images/placeholder.png')).toBe(true);
  });

  it('returns false for a missing screenshot', () => {
    expect(publicFileExists('/images/screenshots/does-not-exist.png')).toBe(false);
  });

  it('returns false for undefined or empty input', () => {
    expect(publicFileExists(undefined)).toBe(false);
    expect(publicFileExists('')).toBe(false);
  });

  it('ignores query strings and hashes', () => {
    expect(publicFileExists('/images/placeholder.png?v=2#top')).toBe(true);
  });

  it('returns false for a directory', () => {
    expect(publicFileExists('/images')).toBe(false);
  });
});

describe('repoLabel', () => {
  it('returns owner/repo from a GitHub URL', () => {
    expect(repoLabel('https://github.com/Nerajno/learnt-project', 'x')).toBe('Nerajno/learnt-project');
  });

  it('falls back to the slug', () => {
    expect(repoLabel(undefined, 'trumma-drum-machine')).toBe('trumma-drum-machine');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/images.test.ts`
Expected: FAIL — cannot resolve `../src/lib/images`.

- [ ] **Step 3: Implement the helper**

`src/lib/images.ts`:

```ts
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PUBLIC_DIR = join(process.cwd(), 'public');

/** True when `pathname` points at a real file inside `public/`. Build-time only. */
export function publicFileExists(pathname?: string): boolean {
  if (!pathname) return false;
  const clean = pathname.split('?')[0].split('#')[0].replace(/^\//, '');
  if (!clean) return false;
  const full = join(PUBLIC_DIR, clean);
  return existsSync(full) && statSync(full).isFile();
}

/** `https://github.com/Nerajno/foo` -> `Nerajno/foo`; otherwise the slug. */
export function repoLabel(githubUrl: string | undefined, slug: string): string {
  if (!githubUrl) return slug;
  try {
    const parts = new URL(githubUrl).pathname.split('/').filter(Boolean);
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : slug;
  } catch {
    return slug;
  }
}
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/e2e/**'],
  },
});
```

`package.json`: add scripts `"test": "vitest run"` and `"test:e2e": "playwright test"`, and devDependencies `"vitest": "^3.2.7"`, `"@playwright/test": "^1.64.0"`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/images.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/images.ts vitest.config.ts tests/images.test.ts package.json
git commit -m "feat: add public-asset existence helper"
```

---

### Task 2: Remove dead screenshot paths and guard the data

**Files:**
- Modify: `src/data/projects.ts` (type line 22 + 42 `screenshot:` lines + 42 `gallery:` lines)
- Create: `tests/screenshot-paths.test.ts`

**Interfaces:**
- Consumes: `publicFileExists` from Task 1.
- Produces: `Project.screenshot?: string` and `Project.gallery?: string[]` (both optional).

- [ ] **Step 1: Write the failing guard test**

`tests/screenshot-paths.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { projects } from '../src/data/projects';
import { publicFileExists } from '../src/lib/images';

describe('project screenshots', () => {
  it('every declared screenshot resolves to a real file', () => {
    const missing = projects
      .filter((p) => p.screenshot && !publicFileExists(p.screenshot))
      .map((p) => `${p.slug}: ${p.screenshot}`);
    expect(missing).toEqual([]);
  });

  it('every gallery image resolves to a real file', () => {
    const missing = projects.flatMap((p) =>
      (p.gallery ?? [])
        .filter((src) => !publicFileExists(src))
        .map((src) => `${p.slug}: ${src}`)
    );
    expect(missing).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/screenshot-paths.test.ts`
Expected: FAIL — 42 missing `screenshot` entries and 42 missing `gallery` entries.

- [ ] **Step 3: Make the fields optional and remove the dead values**

In `src/data/projects.ts` change the interface:

```ts
  screenshot?: string;
```

Then delete every `    screenshot: '/images/screenshots/...png',` line and every `    gallery: ['/images/screenshots/...png'],` line. Keep `altText` for when real images land.

Verify nothing was missed:

```bash
grep -c "screenshot: '/images/screenshots" src/data/projects.ts   # expected: 0
grep -c "gallery:" src/data/projects.ts                            # expected: 0
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/screenshot-paths.test.ts`
Expected: PASS (both lists empty).

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.ts tests/screenshot-paths.test.ts
git commit -m "fix: drop screenshot paths that never existed"
```

---

### Task 3: Render a designed placeholder instead of a broken image

**Files:**
- Create: `src/components/ProjectImage.astro`
- Modify: `src/components/ProjectCard.astro:58-67`
- Modify: `src/pages/learnt/[slug].astro:314-343` and the related-projects `<img>` (~665)
- Modify: `src/components/ProjectDetail.astro:13-20`
- Modify: `src/layouts/Layout.astro:50-56`

**Interfaces:**
- Consumes: `publicFileExists`, `repoLabel` from Task 1.
- Produces: `<ProjectImage src? alt? title slug repo? class? heightClass? />` — renders `<img>` when `src` exists, otherwise a `<div>` placeholder. No `<img>` element is emitted for placeholders.

- [ ] **Step 1: Create the component**

`src/components/ProjectImage.astro`:

```astro
---
import { publicFileExists, repoLabel } from '../lib/images';

export interface Props {
  src?: string;
  alt?: string;
  title: string;
  slug: string;
  repo?: string;
  class?: string;
  heightClass?: string;
  loading?: 'lazy' | 'eager';
}

const {
  src,
  alt,
  title,
  slug,
  repo,
  class: className = '',
  heightClass = 'aspect-[16/10]',
  loading = 'lazy',
} = Astro.props;

const hasImage = publicFileExists(src);
const label = repo ?? repoLabel(undefined, slug);
---

{
  hasImage ? (
    <img
      src={src}
      alt={alt || `Screenshot of ${title}`}
      class={className}
      loading={loading}
      decoding="async"
    />
  ) : (
    <div
      class={`screenshot-placeholder flex flex-col items-center justify-center gap-1 ${heightClass} ${className}`}
      data-placeholder="true"
      style="background-image: repeating-linear-gradient(45deg, transparent 0 10px, rgba(0,0,0,.04) 10px 11px)"
    >
      <span class="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
        no screenshot
      </span>
      <span class="font-mono text-xs text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  )
}

<style>
  /* TODO(#38): swap for --bg-alt / --border-strong / --font-mono once dvlpr-dialects lands. */
  .screenshot-placeholder {
    background-color: rgb(243 244 246);
    border: 1px dashed rgb(209 213 219);
  }
  :global(.dark) .screenshot-placeholder {
    background-color: rgb(31 41 55);
    border-color: rgb(75 85 99);
  }
</style>
```

- [ ] **Step 2: Wire it into the card**

In `src/components/ProjectCard.astro`, add `import ProjectImage from './ProjectImage.astro';` and replace the `<img … />` block (lines 60-67) with:

```astro
    <ProjectImage
      src={project.screenshot}
      alt={project.altText}
      title={project.title}
      slug={project.slug}
      repo={repoLabel(project.githubUrl, project.slug)}
      class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      heightClass="h-48"
    />
```

Import `repoLabel` from `../lib/images` in the frontmatter.

- [ ] **Step 3: Wire it into the detail page**

In `src/pages/learnt/[slug].astro`, import `ProjectImage` and `publicFileExists`. Replace the hero `<img>` (line 323) with:

```astro
            <ProjectImage
              src={project.screenshot}
              alt={project.altText}
              title={project.title}
              slug={project.slug}
              loading="eager"
              class="w-full h-auto"
            />
```

Replace the dialog `<img>` (line 334) the same way. Then split the hero block on existence:

```astro
{
  publicFileExists(project.screenshot) ? (
    /* existing <button> + <dialog> lightbox markup, now using <ProjectImage> */
  ) : (
    <ProjectImage
      src={project.screenshot}
      alt={project.altText}
      title={project.title}
      slug={project.slug}
      class="w-full h-auto"
    />
  )
}
```

The placeholder must still render when the file is missing — only the lightbox wrapper is conditional. Replace the related-projects `<img>` (~665) with `<ProjectImage … heightClass="h-40" />`.

- [ ] **Step 4: Wire it into ProjectDetail and OG metadata**

`src/components/ProjectDetail.astro`: replace its `<img>` with `<ProjectImage src={project.screenshot} alt={project.altText} title={project.title} slug={project.slug} class="w-full rounded-xl shadow mb-6" />`.

`src/layouts/Layout.astro`: compute

```ts
const ogImage = image && publicFileExists(image) ? image : '/images/placeholder.png';
```

and use `ogImage` for `og:image`, `twitter:image` and the JSON-LD `image` field. Import `publicFileExists` from `../lib/images`.

- [ ] **Step 5: Build and check for dead references**

```bash
npm run build
grep -rn "/images/screenshots/" dist | head
```

Expected: build exits 0; the grep prints nothing.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProjectImage.astro src/components/ProjectCard.astro src/components/ProjectDetail.astro src/pages/learnt/\[slug\].astro src/layouts/Layout.astro
git commit -m "fix: render designed placeholder for missing project screenshots"
```

---

### Task 4: Playwright no-broken-images test

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/images.spec.ts`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: the built site from Task 3.
- Produces: `npm run test:e2e` covering Home, Archive and two detail pages.

- [ ] **Step 1: Write the config**

`playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
```

- [ ] **Step 2: Write the test**

`tests/e2e/images.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const pages = ['/', '/learnt', '/learnt/trumma-drum-machine', '/learnt/trapper-keeper-v1'];

for (const path of pages) {
  test(`no broken images on ${path}`, async ({ page }) => {
    const failures: string[] = [];
    page.on('response', (res) => {
      if (res.status() >= 400) failures.push(`${res.status()} ${res.url()}`);
    });

    await page.goto(path);

    // Load lazy images: scroll to the bottom, then wait until every img is complete.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForFunction(() =>
      Array.from(document.images).every((img) => img.complete)
    );

    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }

    // No request on the page may 404, including images and the OG asset.
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og).toBeTruthy();
    const ogResponse = await page.request.get(new URL(og!, page.url()).toString());
    expect(ogResponse.ok()).toBe(true);

    expect(failures).toEqual([]);
  });
}
```

- [ ] **Step 3: Run it**

Run: `npm run test:e2e`
Expected: PASS (4 tests). If a lazy image is still not complete, assert on `img.complete` first to find the offender rather than adding a timeout.

- [ ] **Step 4: Ignore generated output**

Append to `.gitignore`:

```
# test output
test-results/
playwright-report/
```

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e/images.spec.ts .gitignore
git commit -m "test: assert no broken images in the built site"
```

---

### Task 5: Full verification and issue update

**Files:**
- Modify: none (verification only)
- GitHub: comment on #43

- [ ] **Step 1: Run every check fresh**

```bash
npx vitest run
npm run build
npm run test:e2e
grep -rn "/images/screenshots/" dist || echo "no dead screenshot refs"
```

Expected: unit tests pass, build exits 0, e2e passes, grep finds nothing.

- [ ] **Step 2: Confirm placeholders render**

```bash
grep -c 'data-placeholder="true"' dist/learnt/trumma-drum-machine/index.html
```

Expected: at least `1`.

- [ ] **Step 3: Comment on #43**

Post the verification output, note that all 42 projects currently render the placeholder (no real captures yet), and link the follow-up for per-project OG generation.

- [ ] **Step 4: Commit any remaining changes**

```bash
git status -s
```
Expected: clean apart from ignored test output.
