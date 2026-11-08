import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './test';

// #40: every card and detail header uses the shared chip.
test('every archive card shows one chip matching its stage', async ({ page }) => {
  await page.goto('/learnt/');
  const cards = page.locator('#project-list article[data-slug]');
  const n = await cards.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++) {
    const card = cards.nth(i);
    const stage = await card.getAttribute('data-stage');
    await expect(card.locator('.stage-chip')).toHaveCount(1);
    await expect(card.locator('.stage-chip')).toHaveAttribute('data-stage', stage!);
  }
});

test('detail page shows the chip once, in the header', async ({ page }) => {
  await page.goto('/learnt/gulp-jest/');
  await expect(page.locator('header .stage-chip[data-stage="composted"]')).toHaveCount(1);
  await expect(page.locator('main .stage-chip')).toHaveCount(1);
});

test('every coursework row shows a chip', async ({ page }) => {
  await page.goto('/learnt/');
  await page.locator('details#coursework summary').click();
  const rows = page.locator('#coursework li');
  const n = await rows.count();
  expect(n).toBeGreaterThan(0);
  for (let i = 0; i < n; i++) await expect(rows.nth(i).locator('.stage-chip')).toHaveCount(1);
});

for (const path of ['/', '/about/'] as const) {
  test(`${path} shows the stage legend`, async ({ page }) => {
    await page.goto(path);
    const legend = page.locator('[data-stage-legend]');
    await expect(legend.getByRole('heading', { name: 'Four stages, no shame' })).toBeVisible();
    await expect(legend.locator('.stage-chip')).toHaveCount(4);
  });
}

for (const scheme of ['light', 'dark'] as const) {
  test(`chips pass axe contrast (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    for (const path of ['/', '/about/', '/learnt/', '/learnt/gulp-jest/', '/learnt/learnt-project/']) {
      await page.goto(path);
      if (path === '/learnt/') await page.locator('details#coursework summary').click();
      await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });
      const results = await new AxeBuilder({ page }).include('.stage-chip').analyze();
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious, path).toEqual([]);
    }
  });
}
