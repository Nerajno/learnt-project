# dvlpr-dialects Tokens + Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the site on the `@nerajno/dialects` v0.1.0 `learn` surface — JetBrains Mono, 0.875× density, ochre accent, light/dark — and remove the old blue palette.

**Architecture:** Install the pinned spine from its GitHub tag; import its tokens and the JetBrains Mono faces; add its Tailwind preset and replace the head theme script with its `theme-init.js`. Move `global.css` base/shared classes onto semantic tokens, replace every `primary-*` utility, and delete the remaining raw hex. Page-specific `gray-*` surfaces stay for #41/#45/#46.

**Tech Stack:** Astro 5.13, Tailwind 3.4, Vitest 3.2, Playwright 1.64, `@nerajno/dialects@0.1.0`.

**Spec:** `docs/superpowers/specs/2026-11-07-dvlpr-dialects-tokens-design.md`

## Global Constraints

- Package: `github:Nerajno/dvlpr-dialects#v0.1.0` (package name `@nerajno/dialects`).
- Surface is exactly `learn` on `<html>` and on the inline init script.
- Theme classes are exactly `light` / `dark`; `data-theme` mirrors the class; `data-surface="learn"`.
- Do not redesign page layouts or sweep page-specific `gray-*` surfaces; those are #41/#45/#46.
- No raw `#rrggbb` and no `primary-*` may remain under `src/`.
- Accent-filled text uses `text-surface` (`var(--bg)`); never `text-white` or a fixed light/dark value.
- `--accent-soft` is fill-only in dark; do not put body text on it.
- Keep `scroll-smooth`; keep the theme toggle control and its accessible name.
- E2E runs through `npm run test:e2e` (build + preview at `127.0.0.1:4321`, desktop + mobile).
- The issue body is stale; update #38 or the PR description to the spine before merging.

## Review Focus

- A saved dark theme must be on `<html>` before first paint; no flash of light.
- Accent-filled controls must invert their text in both themes and still meet contrast.
- The 0.875× density must not cause horizontal overflow at 360px on `/` or `/learnt`.
- A transitional gray page surface must still be readable on the token background in both themes.
- A missed `primary-*` or raw hex must fail the contract test, not ship.

## Before Task 1

Run `npm install`. If Chromium is missing, run `npx playwright install chromium`.

---

### Task 1: Install the spine, wire fonts/tokens/theme

**Files:**
- Modify: `package.json`, `package-lock.json`
- Modify: `tailwind.config.mjs`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/styles/global.css` (base layer only)
- Create: `tests/e2e/theme.spec.ts`

**Interfaces:**
- Produces: `data-surface="learn"`, `.light`/`.dark`, `data-theme`, the Tailwind token classes (`bg-surface`, `text-body`, `text-accent`, `border-surface-strong`, …).

- [ ] **Step 1: Install the package and the mono faces**

Run:

```bash
npm install github:Nerajno/dvlpr-dialects#v0.1.0 @fontsource/jetbrains-mono@^5.2.8
```

Expected: `package.json` lists `@nerajno/dialects` and `@fontsource/jetbrains-mono`; the lockfile updates.

- [ ] **Step 2: Write the failing theme E2E test**

`tests/e2e/theme.spec.ts`:

```ts
import { test, expect } from './test';

test('learn surface and system theme apply before paint', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-surface', 'learn');

  const html = await (await page.request.get('/')).text();
  const head = html.slice(0, html.indexOf('<body'));
  expect(head).toContain('data-surface="learn"');
  expect(head).toContain('data-theme');
});

test('toggle persists across reloads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveClass(/light/);
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.reload();
  await expect(page.locator('html')).toHaveClass(/light/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('system preference is followed without a saved choice', async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('theme'));
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/light/);

  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npm run test:e2e -- tests/e2e/theme.spec.ts`
Expected: FAIL — no `data-surface`, no `data-theme`, no `.light`.

- [ ] **Step 4: Add the Tailwind preset and remove the blue scale**

In `tailwind.config.mjs`:

```js
import dialects from '@nerajno/dialects/tailwind-preset';

export default {
  presets: [dialects],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      // keep the existing animation/keyframes block
    },
  },
  plugins: [],
};
```

Remove the `safelist`, the whole `colors.primary` block, and the `fontFamily` block. Keep the custom `gray` scale and the animations for the pages #41/#45/#46 will migrate.

- [ ] **Step 5: Wire the Layout**

In `src/layouts/Layout.astro` frontmatter, before `../styles/global.css`:

```ts
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import '@nerajno/dialects/tokens.css';
import themeInit from '@nerajno/dialects/theme-init.js?raw';
import '../styles/global.css';
```

Then:

- `<html lang="en" class="scroll-smooth" data-surface="learn">`.
- Remove the Google Fonts preconnect links and the old inline theme script.
- In `<head>`, add `<script is:inline data-surface="learn" set:html={themeInit}></script>`.
- Change the body class to `class="min-h-screen transition-colors duration-300"` (the base CSS owns background, text, and font).
- Update the toggle handler:

```js
themeToggle?.addEventListener('click', () => {
  const isDark = html.classList.contains('dark');
  html.classList.toggle('dark', !isDark);
  html.classList.toggle('light', isDark);
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});
```

- [ ] **Step 6: Move the base layer onto tokens**

In `src/styles/global.css`, remove the Google Fonts `@import` and replace the base layer:

```css
@layer base {
  :root.light { color-scheme: light; }
  :root.dark { color-scheme: dark; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text-body);
    font-family: var(--font-body);
    @apply transition-colors duration-300;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    color: var(--text-strong);
  }

  a { color: var(--accent); }
  a:hover { color: var(--accent-hover); }

  ::selection { background: var(--accent); color: var(--bg); }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg-alt); }
  ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 9999px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-soft); }

  *:focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 2px;
  }
}
```

- [ ] **Step 7: Run the theme test and build**

Run:

```bash
npm run test:e2e -- tests/e2e/theme.spec.ts
npm run build
```

Expected: theme tests PASS (desktop + mobile); build completes with 0 errors.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json tailwind.config.mjs src/layouts/Layout.astro src/styles/global.css tests/e2e/theme.spec.ts
git commit -m "feat: adopt dvlpr-dialects tokens, fonts, and theme init"
```

---

### Task 2: Shared components, primary sweep, raw hex

**Files:**
- Modify: `src/styles/global.css` (components layer)
- Modify: `src/layouts/Layout.astro` (primary usages)
- Modify: `src/components/ProjectCard.astro`
- Modify: `src/components/SearchBar.astro`
- Modify: `src/pages/learnt.astro`
- Modify: `src/pages/index.astro`
- Delete: `src/components/Welcome.astro`
- Create: `tests/tokens.test.ts`

**Interfaces:**
- Consumes: the token classes and theme from Task 1.
- Produces: zero `primary-*` and zero raw hex in `src/`.

- [ ] **Step 1: Write the failing contract test**

`tests/tokens.test.ts`:

```ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = new URL('../src/', import.meta.url).pathname;

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const files = walk(SRC).filter((f) => /\.(astro|css|ts)$/.test(f));

describe('token adoption', () => {
  it('has no raw hex colours under src', () => {
    const hits = files.flatMap((file) => {
      const text = readFileSync(file, 'utf8');
      return [...text.matchAll(/#[0-9a-fA-F]{3,6}\b/g)].map((m) => `${file}: ${m[0]}`);
    });
    expect(hits).toEqual([]);
  });

  it('has no primary-* utilities under src', () => {
    const hits = files.flatMap((file) => {
      const text = readFileSync(file, 'utf8');
      return text.includes('primary-') ? [file] : [];
    });
    expect(hits).toEqual([]);
  });

  it('removes the safelist and the blue scale from Tailwind', () => {
    const config = readFileSync(new URL('../tailwind.config.mjs', import.meta.url), 'utf8');
    expect(config).not.toContain('safelist');
    expect(config).not.toMatch(/\bprimary\s*:/);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/tokens.test.ts`
Expected: FAIL — `primary-*` and raw hex remain.

- [ ] **Step 3: Move the component classes onto tokens**

In `src/styles/global.css`, replace the component colours:

```css
.btn           { @apply inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed; }
.btn-primary   { @apply btn bg-accent text-surface border-accent hover:bg-accent-hover hover:border-accent-hover shadow-sm hover:shadow-md; }
.btn-secondary { @apply btn bg-surface-card text-strong border-surface-strong hover:bg-surface-alt; }
.btn-ghost     { @apply btn bg-transparent text-body border-transparent hover:bg-surface-alt; }
.card          { @apply bg-surface-card border border-surface rounded-xl shadow-card hover:shadow-card-lg transition-all duration-200; }
.card-header   { @apply px-6 py-4 border-b border-surface; }
.card-footer   { @apply px-6 py-4 border-t border-surface bg-surface-alt rounded-b-xl; }
.badge-primary { @apply badge bg-accent text-surface; }
.input         { @apply block w-full px-3 py-2 text-sm border border-surface-strong rounded-lg bg-surface-card text-strong placeholder:text-muted focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-200; }
.spinner       { @apply animate-spin rounded-full border-2 border-surface border-t-accent; }
.gradient-text { color: var(--accent); }
.focus-within-ring { @apply focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2; }
```

Keep the status/difficulty badge colours, `.glass`, and layout utilities as they are for now.

- [ ] **Step 4: Replace every primary utility**

Apply the design’s mapping table across these files:

- `Layout.astro`: logo link and logo marks → `text-accent`; nav hover/active/underline → `text-accent` / `hover:text-accent-hover` / `bg-accent`; footer links → `text-accent` / `hover:text-accent-hover`.
- `ProjectCard.astro`: featured ring → `ring-accent`; featured badge → `bg-accent text-surface`; title hover → `hover:text-accent-hover`; footer link → `text-accent hover:text-accent-hover`.
- `SearchBar.astro`: hover border → `hover:border-accent`; pressed buttons → `aria-pressed:bg-accent aria-pressed:text-surface aria-pressed:border-accent`.
- `learnt.astro`: hero gradient → `bg-surface-alt`; stat number → `text-accent`.
- Delete `ring-offset-white dark:ring-offset-gray-900` classes; the base `focus-visible` outline owns the offset. `text-white` on an accent fill → `text-surface`.
- Replace `focus:ring-primary-500` with `focus:ring-accent`; `border-t-primary-600` with `border-t-accent`; `from-primary-600 to-purple-600 bg-clip-text text-transparent` with `text-accent`.

Do not change sizes, spacing, radius, or layout.

- [ ] **Step 5: Remove the last raw hex**

- `src/pages/index.astro`: replace the `.hero` gradients with
  `background: linear-gradient(135deg, var(--bg-alt), var(--bg-card));`
  and delete the `.dark .hero` rule.
- Delete `src/components/Welcome.astro` (imported nowhere; 210 lines of raw hex).

- [ ] **Step 6: Run the contract test and build**

Run:

```bash
npx vitest run tests/tokens.test.ts
npm run build
npm run test:e2e -- tests/e2e/theme.spec.ts
```

Expected: contract test PASS; build 0 errors; theme tests still PASS.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/layouts/Layout.astro src/components/ProjectCard.astro src/components/SearchBar.astro src/pages/learnt.astro src/pages/index.astro tests/tokens.test.ts
git rm src/components/Welcome.astro
git commit -m "feat: move shared styles and accent usage onto dvlpr tokens"
```

---

### Task 3: Contrast, axe, and full verification

**Files:**
- Modify: `tests/tokens.test.ts` (contrast checks)
- Modify: `tests/e2e/theme.spec.ts` (axe + overflow checks)

**Interfaces:**
- Consumes: everything from Tasks 1–2.
- Produces: verified contrast, accessibility, and responsive density.

- [ ] **Step 1: Add the token contrast test**

Extend `tests/tokens.test.ts` to read `node_modules/@nerajno/dialects/tokens.css` and verify the spine’s pairs:

- Extract the `learn` dials from `:root[data-surface="learn"]`.
- Extract the light tokens from the `:root` block that contains `--bg`, and the dark tokens from the first `.dark` block that contains `--bg`.
- Resolve `var(--dial-*)` and simple `calc(a + b)` / `calc(a * b)` values.
- Convert the `oklch(L C h)` values to sRGB and compute WCAG relative luminance and contrast.
- Assert every `--text-strong`, `--text-body`, `--text-soft`, `--text-muted`, and `--accent` pair is at least 4.5:1 on `--bg`, `--bg-alt`, and `--bg-card`, in both themes.
- Assert `--border-strong` is at least 3:1 on the same three grounds in both themes.

Use the standard OKLCH → OKLab → linear-sRGB → gamma conversion; clamp channels to `[0, 1]`.

- [ ] **Step 2: Run the contrast test**

Run: `npx vitest run tests/tokens.test.ts`
Expected: PASS. If a pair fails, fix the token import/surface, not the threshold.

- [ ] **Step 3: Add axe and overflow checks**

Extend `tests/e2e/theme.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';

for (const scheme of ['light', 'dark'] as const) {
  test(`no serious axe violations on the shell (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .include('nav')
      .include('footer')
      .include('main')
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(serious).toEqual([]);
  });
}

for (const path of ['/', '/learnt/']) {
  test(`no horizontal overflow at 360px on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
```

If axe reports pre-existing page-specific issues on `/`, record them for #47 and narrow that include to the shared shell; do not redesign pages in this ticket.

- [ ] **Step 4: Run the full gate**

Run each and confirm:

- `npm test` → all unit tests pass
- `npm run build` → 0 errors
- `npm run test:e2e` → all specs pass (desktop + mobile)
- `grep -rn "primary-" src` → no matches
- `grep -rnE "#[0-9a-fA-F]{3,6}\b" src` → no matches

- [ ] **Step 5: Commit**

```bash
git add tests/tokens.test.ts tests/e2e/theme.spec.ts
git commit -m "test: cover token contrast, theme, and density"
```
