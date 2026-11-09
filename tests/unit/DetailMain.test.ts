import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import DetailMain from '../../src/components/project/DetailMain.astro';
import { makeProject } from './fixtures';

let container: AstroContainer;
beforeAll(async () => { container = await AstroContainer.create(); });
const render = (o: Parameters<typeof makeProject>[0]) =>
  container.renderToString(DetailMain, { props: { project: makeProject(o) } });

const deepDive = {
  problem: 'Contacts lived in five places.',
  successCriteria: [],
  approach: 'Rails API + SPA.',
  tradeoffs: [],
  measurableOutcome: 'Used daily.',
  ai: 'No AI tools used' as const,
  v2: [],
};

describe('DetailMain (#24)', () => {
  it('headstone with deepDive renders the deep dive instead of the overview', async () => {
    const html = await render({ tier: 'headstone', deepDive });
    expect(html).toContain('id="dd-problem"');
    expect(html).not.toContain('id="about-h"');
  });

  it('headstone without deepDive falls back to the marker layout', async () => {
    const html = await render({ tier: 'headstone', deepDive: undefined });
    expect(html).not.toContain('id="dd-problem"');
    expect(html).toContain('id="about-h"');
  });

  it('marker never renders the deep dive, even with deepDive data', async () => {
    const html = await render({ tier: 'marker', deepDive });
    expect(html).not.toContain('id="dd-problem"');
  });
});
