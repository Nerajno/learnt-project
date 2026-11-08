import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './test';
import { projects } from '../../src/data/projects';

// #20: tutorial/course projects are honest history, not headline cards.
const coursework = projects.filter((p) => p.tier === 'coursework');
const cardCount = projects.length - coursework.length;

test('no coursework project renders as a full archive card', async ({ page }) => {
  await page.goto('/learnt/');
  await expect(page.locator('#project-list article[data-slug]')).toHaveCount(cardCount);
  for (const p of coursework) {
    await expect(page.locator(`#project-list article[data-slug="${p.slug}"]`)).toHaveCount(0);
  }
});

test('coursework sits in a collapsed list at the bottom of the archive', async ({ page }) => {
  await page.goto('/learnt/');
  const section = page.locator('details#coursework');
  await expect(section).toHaveCount(1);
  await expect(section).not.toHaveAttribute('open', /.*/);
  await expect(section.locator('summary')).toContainText(`Coursework (${coursework.length})`);
  await expect(section.locator('summary h2')).toHaveText(`Coursework (${coursework.length})`);

  await section.locator('summary').click();
  await expect(section).toHaveAttribute('open', '');
  const rows = section.locator('li');
  await expect(rows).toHaveCount(coursework.length);
  for (const p of coursework) {
    const row = section.locator('li', { has: page.locator(`a[href="/learnt/${p.slug}"]`) });
    await expect(row).toHaveCount(1);
    await expect(row.locator(`time[datetime="${p.born}"]`)).toHaveCount(1);
    if (p.githubUrl) await expect(row.locator(`a[href="${p.githubUrl}"]`)).toHaveCount(1);
  }
});

test('the page names the archive and coursework split', async ({ page }) => {
  await page.goto('/learnt/');
  await expect(page.locator('#archive-result')).toContainText(
    `Showing ${cardCount} of ${cardCount} archive cards`,
  );
  await expect(page.getByText(`${coursework.length} coursework`)).toBeVisible();
  await expect(page.getByText('All Projects')).toBeVisible();
});

test('coursework list opens from the keyboard', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'keyboard check on desktop');
  await page.goto('/learnt/');
  const summary = page.locator('details#coursework summary');
  // Reach the summary by real keyboard navigation: back one stop from the next link.
  await page.getByRole('link', { name: 'Learn More About Me' }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('details#coursework')).toHaveAttribute('open', '');
});

test('home never headlines coursework', async ({ page }) => {
  await page.goto('/');
  const main = page.locator('main');
  await expect(main.locator('a[href^="/learnt/"]').first()).toBeVisible();
  for (const p of coursework) {
    await expect(main.locator(`a[href="/learnt/${p.slug}"]`)).toHaveCount(0);
  }
});

for (const scheme of ['light', 'dark'] as const) {
  test(`open coursework list has no serious axe violations (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/learnt/');
    await page.locator('details#coursework summary').click();
    await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });
    const results = await new AxeBuilder({ page }).include('#coursework').analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious).toEqual([]);
  });
}
