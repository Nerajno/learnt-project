import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './test';
import { getCardProjects } from '../../src/data/projects';
import { DEFAULT_FILTERS, filterProjects, toArchiveItem } from '../../src/lib/archive';
import { getTimeline } from '../../src/lib/timeline';

// #21: timeline view on the archive.
type Page = import('@playwright/test').Page;

const timeline = (page: Page) => page.locator('#project-timeline');
const visibleRows = (page: Page) => page.locator('#project-timeline li[data-slug]:visible');
const visibleSlugs = async (page: Page) =>
  visibleRows(page).evaluateAll((els) => els.map((el) => (el as HTMLElement).dataset.slug));

test('the toggle switches to the timeline and records it in the URL', async ({ page }) => {
  await page.goto('/learnt/');
  await expect(timeline(page)).toBeHidden();
  await page.getByRole('button', { name: 'Timeline' }).click();
  await expect(page).toHaveURL(/\?view=timeline$/);
  await expect(timeline(page)).toBeVisible();
  await expect(page.locator('#project-list')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Timeline' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'false');
});

test('groups follow getTimeline(): year headings and row order', async ({ page }) => {
  await page.goto('/learnt/?view=timeline');
  const expected = getTimeline();
  await expect(timeline(page).locator('h3')).toHaveText(expected.map((y) => String(y.year)));
  for (const y of expected) {
    const slugs = await page
      .locator(`[data-year-group="${y.year}"] li[data-slug]`)
      .evaluateAll((els) => els.map((el) => (el as HTMLElement).dataset.slug));
    expect(slugs, String(y.year)).toEqual(y.projects.map((p) => p.slug));
  }
});

test('filters carry over and empty years are hidden', async ({ page }) => {
  await page.goto('/learnt/?stage=composted&view=timeline');
  const composted = getCardProjects().filter((p) => p.stage === 'composted').map((p) => p.slug);
  expect((await visibleSlugs(page)).sort()).toEqual([...composted].sort());
  await expect(page.locator('#archive-count')).toHaveText(String(composted.length));
  for (const group of await page.locator('[data-year-group]:visible').all()) {
    await expect(group.locator('li[data-slug]:visible').first()).toBeVisible();
  }
});

test('a deep link with a year filter opens the filtered timeline', async ({ page }) => {
  await page.goto('/learnt/?view=timeline&year=2024');
  await expect(timeline(page)).toBeVisible();
  const want = filterProjects(getCardProjects().map(toArchiveItem), { ...DEFAULT_FILTERS, year: 2024 }).map((i) => i.slug);
  expect((await visibleSlugs(page)).sort()).toEqual([...want].sort());
});

test('no matches: empty state shows and no year headings remain', async ({ page }) => {
  await page.goto('/learnt/?view=timeline&q=zzzz-no-match');
  await expect(page.locator('#archive-empty')).toBeVisible();
  await expect(page.locator('[data-year-group]:visible')).toHaveCount(0);
});

test('clear all keeps the timeline view', async ({ page }) => {
  await page.goto('/learnt/?view=timeline&q=zzzz-no-match');
  await page.locator('#archive-empty-clear').click();
  await expect(timeline(page)).toBeVisible();
  await expect(visibleRows(page)).toHaveCount(getCardProjects().length);
});

test('back returns to the grid', async ({ page }) => {
  await page.goto('/learnt/');
  await page.getByRole('button', { name: 'Timeline' }).click();
  await expect(timeline(page)).toBeVisible();
  await page.goBack();
  await expect(page.locator('#project-list')).toBeVisible();
  await expect(timeline(page)).toBeHidden();
});

test('reduced motion: nothing in the timeline animates', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/learnt/?view=timeline');
  const moving = await timeline(page).locator('*').evaluateAll((els) =>
    els.filter((el) => {
      const s = getComputedStyle(el);
      const secs = (v: string) => Math.max(...v.split(',').map((x) => parseFloat(x) || 0));
      return secs(s.transitionDuration) > 0 || secs(s.animationDuration) > 0;
    }).length,
  );
  expect(moving).toBe(0);
});

test('no horizontal scroll at 360px in the timeline', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/learnt/?view=timeline');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

for (const scheme of ['light', 'dark'] as const) {
  test(`timeline has no serious axe violations (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/learnt/?view=timeline');
    await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });
    const results = await new AxeBuilder({ page }).include('main').analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious).toEqual([]);
  });
}
