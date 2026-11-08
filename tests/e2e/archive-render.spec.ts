import { getCardProjects } from '../../src/data/projects';
import { toArchiveItem } from '../../src/lib/archive';
import { test, expect } from './test';

const cardProjects = getCardProjects();

test('renders every card project with filter metadata and stage counts', async ({ page }) => {
  await page.goto('/learnt/');

  await expect(page.locator('#project-list article[data-slug]')).toHaveCount(cardProjects.length);
  await expect(page.locator('#archive-count')).toHaveText(String(cardProjects.length));

  const items = cardProjects.map(toArchiveItem);
  for (const stage of ['seed', 'sprout', 'shipped', 'composted'] as const) {
    const expected = items.filter((i) => i.stage === stage).length;
    await expect(page.locator(`[data-stage-filter="${stage}"]`)).toContainText(String(expected));
  }

  const first = page.locator('#project-list article[data-slug]').first();
  for (const attr of ['data-stage', 'data-category', 'data-year', 'data-search']) {
    await expect(first).toHaveAttribute(attr, /.+/);
  }
});
