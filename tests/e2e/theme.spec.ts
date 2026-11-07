import AxeBuilder from '@axe-core/playwright';
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

for (const scheme of ['light', 'dark'] as const) {
  test(`no serious axe violations on the shell (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/');
    // Cards fade in; analyze the settled colours, not a mid-animation blend.
    await page.addStyleTag({
      content: '* { animation: none !important; transition: none !important; }',
    });
    const results = await new AxeBuilder({ page })
      .include('nav')
      .include('footer')
      .include('main h1')
      .include('main h2')
      .include('main p')
      .include('.btn')
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
