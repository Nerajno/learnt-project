import { test, expect } from './test';

// #39 review follow-ups.
test('archive stat cards agree with the card grid', async ({ page }) => {
  await page.goto('/learnt/');
  const cards = page.locator('#project-list article[data-slug]');
  const stat = async (key: string) => Number((await page.locator(`[data-stat="${key}"]`).textContent())?.trim());
  expect(await stat('total')).toBe(await cards.count());
  for (const stage of ['shipped', 'composted'] as const) {
    expect(await stat(stage), stage).toBe(await page.locator(`#project-list article[data-stage="${stage}"]`).count());
  }
  const growing = await page.locator('#project-list article[data-stage="seed"], #project-list article[data-stage="sprout"]').count();
  expect(await stat('growing')).toBe(growing);
});

test('composted banner does not claim the learning goals were met', async ({ page }) => {
  await page.goto('/learnt/gulp-jest/');
  await expect(page.getByText('achieved its learning objectives')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Composted' })).toBeVisible();
});
