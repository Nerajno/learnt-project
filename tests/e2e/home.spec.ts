import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './test';
import { projects, getCardProjects, getUniqueTechnologies } from '../../src/data/projects';
import { getByYear, getStats } from '../../src/lib/projects';
import { compostLine, getRecentlyComposted, getStillGrowing } from '../../src/lib/home';

// #45: Home is built entirely from the collection.
const stats = getStats();
const firstYear = Math.min(...projects.map((p) => Number(p.born.slice(0, 4))));

test('hero: eyebrow, H1 and the two CTAs', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.eyebrow')).toHaveText(`The proof-of-work archive · ${firstYear} → now`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    "Every project I've shipped, sunset or buried — and what each one taught me.",
  );
  await expect(page.getByRole('link', { name: 'Browse the archive' })).toHaveAttribute('href', '/learnt');
  await expect(page.getByRole('link', { name: 'How the stages work' })).toHaveAttribute('href', '#stages');
  await expect(page.locator('#stages [data-stage-legend]')).toHaveCount(1);
});

test('stats match getStats()', async ({ page }) => {
  await page.goto('/');
  const stat = (k: string) => page.locator(`[data-stat="${k}"]`);
  await expect(stat('total')).toHaveText(String(stats.total));
  await expect(stat('shipped')).toHaveText(String(stats.byStage.shipped));
  await expect(stat('growing')).toHaveText(String(stats.byStage.sprout));
  await expect(stat('technologies')).toHaveText(String(getUniqueTechnologies().length));
});

test('recently composted shows the 3 newest with their compost line', async ({ page }) => {
  await page.goto('/');
  const expected = getRecentlyComposted();
  const cards = page.locator('[data-section="composted"] article');
  await expect(cards).toHaveCount(expected.length);
  for (const [i, p] of expected.entries()) {
    const card = cards.nth(i);
    await expect(card.getByRole('link', { name: p.title })).toHaveAttribute('href', `/learnt/${p.slug}`);
    await expect(card).toContainText(compostLine(p));
    await expect(card.locator('.stage-chip[data-stage="composted"]')).toHaveCount(1);
  }
});

test('still growing lists every sprout with chip, title and start month', async ({ page }) => {
  await page.goto('/');
  const sprouts = getStillGrowing();
  const rows = page.locator('[data-section="growing"] li');
  await expect(rows).toHaveCount(sprouts.length);
  for (const [i, p] of sprouts.entries()) {
    await expect(rows.nth(i).locator('.stage-chip[data-stage="sprout"]')).toHaveCount(1);
    await expect(rows.nth(i).getByRole('link', { name: p.title })).toHaveAttribute('href', `/learnt/${p.slug}`);
    await expect(rows.nth(i).locator(`time[datetime="${p.born}"]`)).toHaveCount(1);
  }
});

test('year trail: one labelled row per year, linking to the archive filter', async ({ page }) => {
  await page.goto('/');
  // The trail counts card projects, matching what /learnt?year= shows.
  const years = getByYear(getCardProjects());
  const rows = page.locator('[data-section="trail"] a');
  await expect(rows).toHaveCount(years.length);
  for (const [i, y] of years.entries()) {
    await expect(rows.nth(i)).toHaveAttribute('href', `/learnt?year=${y.year}`);
    await expect(rows.nth(i)).toContainText(String(y.year));
    await expect(rows.nth(i)).toContainText(`${y.total} project${y.total === 1 ? '' : 's'}`);
  }
});

test('a year row opens the archive with that year filtered', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('[data-section="trail"] a').first();
  const year = (await first.getAttribute('href'))!.split('year=')[1];
  const label = (await first.locator('.trail-count').textContent())!;
  await first.click();
  await expect(page).toHaveURL(new RegExp(`/learnt/?\\?year=${year}`));
  await expect(page.locator('#archive-year')).toHaveValue(year);
  await expect(page.locator('#archive-count')).toHaveText(label.match(/\d+/)![0]);
});

test('no card shows a made-up progress value (#10)', async ({ page }) => {
  await page.goto('/');
  expect(await page.content()).not.toContain('width: 75%');
});

test('headings descend without skipping levels', async ({ page }) => {
  await page.goto('/');
  const levels = await page.locator('main h1, main h2, main h3, main h4').evaluateAll((els) =>
    els.map((el) => Number(el.tagName[1])),
  );
  expect(levels[0]).toBe(1);
  for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
});

test('composted cards stack in one column below 860px', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await page.goto('/');
  const lefts = await page.locator('[data-section="composted"] article').evaluateAll((els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().left)),
  );
  expect(new Set(lefts).size).toBe(1);
});

test('no horizontal scroll at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

for (const scheme of ['light', 'dark'] as const) {
  test(`home has no serious axe violations (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/');
    await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });
    const results = await new AxeBuilder({ page }).include('main').analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious).toEqual([]);
  });
}
