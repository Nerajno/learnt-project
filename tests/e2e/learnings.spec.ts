import { readFileSync } from 'node:fs';
import { test, expect } from './test';

const slugs: string[] = JSON.parse(
  readFileSync(new URL('./fixtures/slugs.json', import.meta.url), 'utf8'),
);

// #49: what a card says about a project must match its detail page.
const card = (page: import('@playwright/test').Page, slug: string) =>
  page.locator('article', { has: page.locator(`a[href="/learnt/${slug}"]`) }).first();

for (const slug of ['trumma-drum-machine', 'trapper-keeper-v1']) {
  test(`${slug}: rendered learnings equal the card count`, async ({ page }) => {
    await page.goto('/learnt/');
    const countText = await card(page, slug).getByTestId('learnings-count').textContent();
    const count = Number(countText?.match(/\d+/)?.[0]);

    expect(count, 'card shows a learnings count').toBeGreaterThan(0);

    await page.goto(`/learnt/${slug}/`);
    await expect(page.getByTestId('learnings-list')).toHaveCount(1);
    await expect(page.getByTestId('learnings-list').locator('li')).toHaveCount(count);
  });
}

test('every card matches its detail page on date and learnings count', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'data check; one viewport is enough');
  await page.goto('/learnt/');
  const fromCards = new Map<string, { born: string | null; count: number }>();
  for (const slug of slugs) {
    const c = card(page, slug);
    fromCards.set(slug, {
      born: await c.locator('time').first().getAttribute('datetime'),
      count: Number((await c.getByTestId('learnings-count').textContent())?.match(/\d+/)?.[0]),
    });
  }

  for (const slug of slugs) {
    const html = await (await page.request.get(`/learnt/${slug}/`)).text();
    const list = html.match(/data-testid="learnings-list"[^>]*>([\s\S]*?)<\/ul>/)?.[1] ?? '';
    const rendered = (list.match(/<li\b/g) ?? []).length;
    const want = fromCards.get(slug)!;
    expect(want.count, `${slug} card count`).toBeGreaterThan(0);
    expect(html, `${slug} learnings list`).toContain('data-testid="learnings-list"');
    expect(rendered, `${slug} learnings`).toBe(want.count);
    expect(html, `${slug} born date`).toContain(`datetime="${want.born}"`);
  }
});
