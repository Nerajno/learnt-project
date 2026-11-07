# Layout Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the header, nav, theme toggle, and footer on the `learn` token spine, with correct landmarks, focus, tap targets, and mobile-menu behavior.

**Architecture:** Keep the shell in `src/layouts/Layout.astro`; compute the current route in the frontmatter, render token-based desktop and mobile nav + footer, and extend the existing inline script for the toggle ARIA and the mobile menu. Add `blog`/`garden` to `src/data/site.ts`.

**Tech Stack:** Astro 5.13, Tailwind 3.4 + dvlpr-dialects preset, Playwright 1.64.

**Spec:** `docs/superpowers/specs/2026-11-07-layout-shell-design.md`

## Global Constraints

- Spine tokens only: JetBrains Mono, `--accent`, `--bg-alt`, `--bg-card`, `--border-strong`. Do not reintroduce `primary-*`, IBM Plex, `--accent-text`, or `--nav-hover`.
- Current route: `aria-current="page"` on exactly one nav link; Archive is current for every `/learnt*` path.
- Header is `static` on mobile, `md:sticky` on desktop.
- Every nav link, the toggle, and the menu button is at least 44×44.
- External links open in the same tab.
- Footer keeps `social-link`, the social aria-labels, the `site.name` portfolio link, and the © year.
- No new dependencies; no page-body redesign.
- E2E runs through `npm run test:e2e` (build + preview at `127.0.0.1:4321`, desktop + mobile).

## Review Focus

- A deep link to a detail page (`/learnt/trumma-drum-machine/`) keeps Archive current, not Home.
- `aria-pressed` and the toggle label are correct on first load, not only after a click.
- Escape closes the mobile menu and returns focus to its button; outside click also closes.
- The 0.875× density must not shrink the 44px targets below 44px.
- The footer restyle must not break the existing social/name/© contracts.

## Before Task 1

Run `npm install`. If Chromium is missing, run `npx playwright install chromium`.

---

### Task 1: Site data, container, and shell markup

**Files:**
- Modify: `src/data/site.ts`
- Modify: `src/styles/global.css` (`.container-custom`)
- Modify: `src/layouts/Layout.astro` (header, nav, footer, style block)
- Create: `tests/e2e/shell.spec.ts`

**Interfaces:**
- Produces: `site.blog`, `site.garden`; `nav[aria-label="Main"]`; one `[aria-current="page"]`; the new footer links; `#mobile-menu-toggle`/`#mobile-menu` with `aria-expanded` later in Task 2.

- [ ] **Step 1: Write the failing structural test**

`tests/e2e/shell.spec.ts`:

```ts
import { site } from '../../src/data/site';
import { test, expect } from './test';

const routes = [
  ['/', 'Home'],
  ['/learnt/', 'Archive'],
  ['/about/', 'About'],
  ['/contact/', 'Contact'],
] as const;

for (const [path, label] of routes) {
  test(`${label} is current on ${path}`, async ({ page }) => {
    await page.goto(path);
    const nav = page.locator('nav[aria-label="Main"]');
    await expect(nav).toHaveCount(1);
    // Desktop and mobile share the label; assert each rendered group once.
    await expect(nav.locator('.nav-link[aria-current="page"]')).toHaveCount(1);
    await expect(nav.locator('.nav-link[aria-current="page"]')).toHaveText(label);
    await expect(nav.locator('.mobile-nav-link[aria-current="page"]')).toHaveCount(1);
    await expect(nav.locator('.mobile-nav-link[aria-current="page"]')).toHaveText(label);
  });
}

test('nav has the new labels and the external portfolio link', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('nav[aria-label="Main"]');
  for (const label of ['Home', 'Archive', 'About', 'Contact']) {
    await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
  const external = nav.getByRole('link', { name: /developingdvlpr\.com/ });
  await expect(external).toHaveAttribute('href', site.portfolio);
  await expect(external).not.toHaveAttribute('target', '_blank');
});

test('footer has the new links and no categories column', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute('href', site.blog);
  await expect(footer.getByRole('link', { name: 'Garden', exact: true })).toHaveAttribute('href', site.garden);
  await expect(footer.getByRole('heading', { name: 'Categories' })).toHaveCount(0);
  await expect(footer).toContainText(`© ${new Date().getFullYear()}`);
  await expect(footer.getByRole('link', { name: site.name })).toHaveAttribute('href', site.portfolio);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e -- tests/e2e/shell.spec.ts`
Expected: FAIL — nav says Projects, no aria-current, no Blog/Garden, Categories still present.

- [ ] **Step 3: Add the site URLs**

In `src/data/site.ts`:

```ts
export const site = {
  name: 'Nerando Johnson',
  portfolio: 'https://developingdvlpr.com/',
  blog: 'https://developingdvlpr.com/blog',
  garden: 'https://garden.developingdvlpr.com/',
  social: { /* unchanged */ },
};
```

- [ ] **Step 4: Widen the container**

In `src/styles/global.css`:

```css
.container-custom {
  @apply max-w-[1160px] mx-auto px-6;
}
```

- [ ] **Step 5: Rebuild the header and footer markup**

In `src/layouts/Layout.astro` frontmatter, after `canonicalURL`:

```ts
const path = Astro.url.pathname;
const current = path === '/'
  ? 'Home'
  : path.startsWith('/learnt')
    ? 'Archive'
    : path.startsWith('/about')
      ? 'About'
      : path.startsWith('/contact')
        ? 'Contact'
        : '';
```

Header:
- `<nav aria-label="Main" class="static md:sticky md:top-0 z-40 w-full border-b border-surface bg-surface">`.
- Wordmark: `<a href="/" class="font-mono text-xl font-semibold text-strong">learnt<span class="text-accent">/</span></a>`.
- Desktop links: Home `/`, Archive `/learnt`, About `/about`, Contact `/contact`,
  plus `<a href={site.portfolio}>developingdvlpr.com ↗</a>`.
  Each link gets `aria-current={current === label ? 'page' : undefined}` and
  `class:list` with `nav-link` and `active` when current.
- Theme toggle: `w-11 h-11` bordered token button, keep the sun/moon SVGs and
  `id="theme-toggle"`; add `aria-pressed="false"` initially.
- Mobile button: `w-11 h-11`, `aria-expanded="false"`,
  `aria-controls="mobile-menu"`.
- Mobile menu: keep `id="mobile-menu"`, add the same five links (including the
  external link) with `mobile-nav-link` and active state.

Footer:
- `<footer class="border-t border-surface bg-surface-alt">`.
- Left: `learnt/` wordmark + `Progress over perfection.`
- Right: Blog (`site.blog`), Garden (`site.garden`), GitHub, LinkedIn, X.
  The social links keep `class="social-link"` and their aria-labels; all links
  open in the same tab.
- Bottom line: `© {year} <a href={site.portfolio}>{site.name}</a>`; no
  Quick Links or Categories columns.

- [ ] **Step 6: Update the shell styles**

In the `<style>` block at the bottom of `Layout.astro`:

- Remove the duplicate `@import '../styles/global.css';` (the frontmatter import
  already loads it).
- `.nav-link`: `inline-flex items-center min-h-[44px] px-3 rounded-md text-sm font-medium text-body hover:text-accent hover:bg-surface-alt transition-colors`.
- `.nav-link.active`: `text-accent bg-surface-alt`.
- `.mobile-nav-link`: `flex items-center min-h-[44px] px-3 rounded-md text-base font-medium text-body hover:text-accent hover:bg-surface-alt`.
- `.footer-link`: `text-soft hover:text-accent-hover underline underline-offset-2`.
- `.social-link`: `inline-flex items-center justify-center w-11 h-11 text-muted hover:text-body`.
- Remove the old `.nav-link::after` underline rules.

- [ ] **Step 7: Run the structural test and the existing shell/footer tests**

Run:

```bash
npm run test:e2e -- tests/e2e/shell.spec.ts tests/e2e/footer.spec.ts tests/e2e/theme.spec.ts
npm run build
```

Expected: shell PASS; footer/theme still PASS; build 0 errors.

- [ ] **Step 8: Commit**

```bash
git add src/data/site.ts src/styles/global.css src/layouts/Layout.astro tests/e2e/shell.spec.ts
git commit -m "feat: restyle the layout shell on dvlpr tokens"
```

---

### Task 2: Toggle ARIA, mobile menu behavior, and a11y

**Files:**
- Modify: `src/layouts/Layout.astro` (inline script)
- Modify: `tests/e2e/shell.spec.ts`

**Interfaces:**
- Consumes: the Task 1 markup.
- Produces: `aria-pressed`/label sync, mobile menu open/close with focus return, tap-target and focus guarantees.

- [ ] **Step 1: Write the failing behavior tests**

Append to `tests/e2e/shell.spec.ts`:

```ts
test('theme toggle mirrors dark mode on load and click', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const toggle = page.locator('#theme-toggle');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(toggle).toHaveAttribute('aria-label', 'Switch to light mode');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark mode');

  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
});

test('mobile menu opens, closes with Escape, and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const button = page.locator('#mobile-menu-toggle');
  const menu = page.locator('#mobile-menu');

  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();

  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Home', exact: true })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();
  await expect(button).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
});

test('tap targets are at least 44px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const targets = [
    ...(await page.locator('.nav-link').all()),
    page.locator('#theme-toggle'),
  ];
  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  for (const target of [page.locator('#theme-toggle'), page.locator('#mobile-menu-toggle')]) {
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('keyboard focus is visible', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const style = getComputedStyle(el);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  expect(outline.outlineStyle).not.toBe('none');
  expect(outline.outlineWidth).not.toBe('0px');
});

test('no horizontal overflow at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm run test:e2e -- tests/e2e/shell.spec.ts`
Expected: FAIL — no aria-pressed sync, no mobile focus/Escape behavior; target sizes may fail.

- [ ] **Step 3: Extend the inline script**

In `Layout.astro`:

```js
const setThemeButton = () => {
  const dark = html.classList.contains('dark');
  themeToggle?.setAttribute('aria-pressed', String(dark));
  themeToggle?.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
};

setThemeButton();
themeToggle?.addEventListener('click', () => {
  const isDark = html.classList.contains('dark');
  html.classList.toggle('dark', !isDark);
  html.classList.toggle('light', isDark);
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  setThemeButton();
});

const setMenu = (open) => {
  if (!mobileMenu || !mobileMenuToggle) return;
  mobileMenu.classList.toggle('hidden', !open);
  mobileMenuToggle.setAttribute('aria-expanded', String(open));
  if (open) {
    mobileMenu.querySelector('a')?.focus();
  }
};

mobileMenuToggle?.addEventListener('click', () => {
  setMenu(mobileMenu?.classList.contains('hidden') ?? false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileMenu?.classList.contains('hidden')) {
    setMenu(false);
    mobileMenuToggle?.focus();
  }
});

document.addEventListener('click', (event) => {
  if (
    !mobileMenuToggle?.contains(event.target) &&
    !mobileMenu?.contains(event.target)
  ) {
    setMenu(false);
  }
});
```

Keep the existing outside-click behavior, but route it through `setMenu` so
`aria-expanded` stays correct.

- [ ] **Step 4: Fix any target-size shortfall**

Because the `learn` surface uses a 0.875× root, `11` is ~38.5px. Use explicit
`min-h-[44px] min-w-[44px]` (or `w-[44px] h-[44px]`) on the nav links, toggle,
menu button, and social links. Re-run the tap-target test.

- [ ] **Step 5: Run the shell tests and the full gate**

Run:

```bash
npm run test:e2e -- tests/e2e/shell.spec.ts
npm test
npm run build
npm run test:e2e
```

Expected: all green.

- [ ] **Step 6: Visual check**

Capture `/` at 1280px and 360px in light and dark, header and footer. View the
screenshots and confirm the wordmark, nav, toggle, menu, footer, and focus
states match the spec. Save them outside the repo.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/Layout.astro tests/e2e/shell.spec.ts
git commit -m "feat: finish shell toggle and mobile-menu behavior"
```
