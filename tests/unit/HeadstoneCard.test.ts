import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import HeadstoneCard from '../../src/components/home/HeadstoneCard.astro';
import { makeProject } from './fixtures';

// #32: a headstone card on Home.
let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

const stone = makeProject({
  slug: 'trapper-keeper-v1',
  title: 'Trapper Keeper V1',
  tier: 'headstone',
  stage: 'shipped',
  born: '2025-07-01',
  died: '2025-08-11',
  tags: ['ruby', 'rails', 'crud'],
  learnings: ['Rails fundamentals', 'RESTful API design', 'CRUD operations', 'SPA architecture'],
});

describe('HeadstoneCard', () => {
  it('shows dates, lifespan, title link, stage and the first two tags', async () => {
    const html = await container.renderToString(HeadstoneCard, { props: { project: stone } });
    const t = text(html);
    expect(html).toContain('datetime="2025-07-01"');
    expect(html).toContain('datetime="2025-08-11"');
    expect(t).toContain('41 days');
    expect(html).toMatch(/<h3[^>]*>\s*<a[^>]*href="\/learnt\/trapper-keeper-v1"/);
    expect(html).toContain('data-stage="shipped"');
    expect(t).toContain('ruby');
    expect(t).toContain('rails');
    expect(t).not.toContain('crud');
  });

  it('lists at most three learnings', async () => {
    const t = text(await container.renderToString(HeadstoneCard, { props: { project: stone } }));
    expect(t).toContain('Rails fundamentals · RESTful API design · CRUD operations');
    expect(t).not.toContain('SPA architecture');
  });

  it('quotes the epitaph when there is one, else falls back to the short line', async () => {
    const withEpitaph = text(await container.renderToString(HeadstoneCard, {
      props: { project: { ...stone, epitaph: 'Rails finally clicked.' } },
    }));
    expect(withEpitaph).toContain('“Rails finally clicked.”');

    const without = text(await container.renderToString(HeadstoneCard, {
      props: { project: { ...stone, short: 'A Rails address book' } },
    }));
    expect(without).toContain('A Rails address book');
  });

  it('links the deep dive and the repo with names screen readers can tell apart', async () => {
    const html = await container.renderToString(HeadstoneCard, { props: { project: stone } });
    const t = text(html);
    expect(t).toContain('into Trapper Keeper V1');
    expect(t).toContain('for Trapper Keeper V1');
    expect(html).toContain('href="https://github.com/Nerajno/test-project"');
  });

  it('drops the repo link when there is no repo', async () => {
    const html = await container.renderToString(HeadstoneCard, { props: { project: { ...stone, githubUrl: undefined } } });
    expect(html).not.toContain('github.com');
  });
});
