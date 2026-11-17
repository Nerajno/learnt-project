import { projects } from '../../src/data/projects';
import { test, expect } from './test';

type Page = import('@playwright/test').Page;
type Locator = import('@playwright/test').Locator;

// #47 (docs/qa.md "Keyboard only"): the core journeys with no mouse.
test.skip(({ isMobile }) => isMobile, 'keyboard journeys run on desktop');

async function tabTo(page: Page, target: Locator, max = 150) {
  for (let i = 0; i < max; i++) {
    if (await target.evaluate((el) => el === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error(`could not Tab to ${target}`);
}

test('archive: filter to Composted + 2024, switch to timeline and back, open a project', async ({ page }) => {
  await page.goto('/learnt/');
  await page.waitForSelector('[data-view-toggle]:not([hidden])');

  await tabTo(page, page.locator('[data-stage-filter="composted"]'));
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-stage-filter="composted"]')).toHaveAttribute('aria-pressed', 'true');

  await tabTo(page, page.locator('#archive-year'));
  await page.keyboard.type('2024');
  await page.keyboard.press('Tab');
  await expect(page).toHaveURL(/stage=composted/);
  await expect(page).toHaveURL(/year=2024/);

  const composted = new Set(projects.filter((p) => p.stage === 'composted').map((p) => p.slug));
  const visible = page.locator('article[data-slug]:visible');
  await expect(visible.first()).toBeVisible();
  for (const slug of await visible.evaluateAll((els) => els.map((e) => e.getAttribute('data-slug')))) {
    expect(composted.has(slug!), `${slug} is composted`).toBe(true);
  }

  const timeline = page.locator('[data-view="timeline"]');
  await tabTo(page, timeline);
  await page.keyboard.press('Enter');
  await expect(timeline).toHaveAttribute('aria-pressed', 'true');
  const grid = page.locator('[data-view="grid"]');
  await page.keyboard.press('Shift+Tab');
  await expect(grid).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(grid).toHaveAttribute('aria-pressed', 'true');

  const firstLink = visible.first().locator('a[href^="/learnt/"]').first();
  const href = await firstLink.getAttribute('href');
  await tabTo(page, firstLink);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`${href!.replace(/\/$/, '')}/?$`));
  await expect(page.locator('h1')).toBeVisible();
});

test('contact: fill and send a note, focus lands on the confirmation', async ({ page }) => {
  await page.route('**/contact/thanks**', (route) =>
    route.request().method() === 'POST' ? route.fulfill({ status: 200, body: 'ok' }) : route.continue(),
  );
  await page.goto('/contact');

  await tabTo(page, page.locator('input[name="topic"]').first());
  await page.keyboard.press('ArrowRight'); // Collaboration
  await expect(page.getByRole('radio', { name: 'Collaboration' })).toBeChecked();

  await tabTo(page, page.locator('#name'));
  await page.keyboard.type('Ada');
  await page.keyboard.press('Tab');
  await page.keyboard.type('ada@example.com');
  await tabTo(page, page.locator('#message'));
  await page.keyboard.type('Hello from the keyboard.');
  await tabTo(page, page.locator('#contact-form button[type="submit"]'));
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/contact\/thanks/);
  await expect(page.locator('#thanks-heading')).toBeFocused();
});
