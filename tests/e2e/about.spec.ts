import AxeBuilder from '@axe-core/playwright';
import { projects } from '../../src/data/projects';
import { site } from '../../src/data/site';
import { STAGES } from '../../src/lib/stages';
import { test, expect } from './test';

const living = projects.filter((p) => p.stage === 'seed' || p.stage === 'sprout');

test('About lists every living project under "Currently building" (#14)', async ({ page }) => {
  await page.goto('/about/');
  const list = page.getByTestId('about-ledger');
  await expect(list).toBeVisible();
  for (const project of living) {
    await expect(list.getByRole('link', { name: project.title, exact: true })).toHaveAttribute(
      'href',
      `/learnt/${project.slug}`,
    );
  }
});

test('About has one h1 and no prose classes (#85)', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.prose')).toHaveCount(0);
});

test('each ledger row has a stage chip; live links only when liveUrl is set (#85)', async ({ page }) => {
  await page.goto('/about/');
  const rows = page.getByTestId('about-ledger').locator(':scope > li');
  await expect(rows).toHaveCount(living.length);
  for (const [i, project] of living.entries()) {
    const row = rows.nth(i);
    await expect(row.locator('.stage-chip')).toHaveCount(1);
    await expect(row.locator('.stage-chip')).toHaveAttribute('data-stage', project.stage);
    const live = row.getByRole('link', { name: `${project.title} live site (opens in new tab)` });
    if (project.liveUrl) {
      await expect(live).toHaveAttribute('href', project.liveUrl);
      await expect(live).toHaveAttribute('rel', 'noopener noreferrer');
    } else {
      await expect(live).toHaveCount(0);
    }
  }
});

test('main-portfolio link is above the fold at 1280px (#85)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/about/');
  const link = page.getByRole('link', { name: 'Curated work lives here: open the main portfolio (developingdvlpr.com)' });
  await expect(link).toHaveAttribute('href', 'https://developingdvlpr.com');
  await expect(link).toBeInViewport();
});

for (const width of [360, 768, 1280]) {
  test(`About has no horizontal scroll at ${width}px (#85)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/about/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

for (const scheme of ['light', 'dark'] as const) {
  test(`no serious axe violations on /about/ (${scheme}) (#85)`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/about/');
    await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });
    const results = await new AxeBuilder({ page }).include('main').analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => v.id)).toEqual([]);
  });
}

test('About copy sections render in order (#31)', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.locator('h1')).toHaveText('Killed by Google, but every headstone says what it taught me.');
  await expect(page.locator('main h2')).toHaveText([
    'The proof-of-work standard',
    'Why not seedling, budding, evergreen?',
    'Four stages, no shame',
    'Where everything else lives',
    'Still alive, so not composted yet',
  ]);
  await expect(page.getByTestId('pow-standard').locator('li')).toHaveCount(8);
  await expect(page.locator('main')).toContainText('Vets Who Code');
});

test('stage copy comes from STAGES, not hand-written (#31)', async ({ page }) => {
  await page.goto('/about/');
  for (const { definition } of STAGES) {
    await expect(page.locator('[data-stage-legend]')).toContainText(definition);
  }
});

test('Where everything else lives links match site config (#31)', async ({ page }) => {
  await page.goto('/about/');
  const cards = page.getByTestId('elsewhere');
  await expect(cards.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute('href', site.blog);
  await expect(cards.getByRole('link', { name: 'Garden', exact: true })).toHaveAttribute('href', site.garden);
  await expect(cards.getByRole('link', { name: 'Tracker', exact: true })).toHaveAttribute('href', 'https://isnerandodoneyet.com');
  await expect(page.getByRole('link', { name: 'Twitter/X' })).toHaveAttribute('href', site.social.x.url);
});

test('About has no unfilled [placeholders] (#31)', async ({ page }) => {
  await page.goto('/about/');
  expect(await page.locator('main').innerText()).not.toContain('[');
});
