import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import SameSoil from '../../src/components/project/SameSoil.astro';
import { makeProject } from './fixtures';

let container: AstroContainer;
beforeAll(async () => { container = await AstroContainer.create(); });
const text = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const p = (slug: string) => makeProject({ slug, title: slug.toUpperCase() });

describe('SameSoil (#46 Task 7)', () => {
  it('lists related projects and prev/next links', async () => {
    const html = await container.renderToString(SameSoil, {
      props: { related: [p('a'), p('b')], prev: p('older'), next: p('newer') },
    });
    expect(text(html)).toContain('Same soil');
    for (const s of ['a', 'b', 'older', 'newer']) expect(html).toContain(`href="/learnt/${s}"`);
    expect(html).toMatch(/<nav[^>]*aria-label="Project navigation"/);
  });

  it('hides Same soil without related projects and handles a missing neighbour', async () => {
    const html = await container.renderToString(SameSoil, { props: { related: [], next: p('newer') } });
    expect(text(html)).not.toContain('Same soil');
    expect(text(html)).not.toMatch(/Previous/);
    expect(html).toContain('href="/learnt/newer"');
  });
});
