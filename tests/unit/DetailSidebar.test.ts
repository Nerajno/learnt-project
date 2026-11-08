import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import DetailSidebar from '../../src/components/project/DetailSidebar.astro';
import { makeProject } from './fixtures';

let container: AstroContainer;
beforeAll(async () => { container = await AstroContainer.create(); });
const text = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const none = { predecessors: [], successors: [] };

describe('DetailSidebar (#46 Task 6)', () => {
  const p = makeProject({ born: '2025-05-04', died: '2025-06-01', technologies: ['Rails', 'JS'] });

  it('shows born, died, lifespan, stack and View code', async () => {
    const t = text(await container.renderToString(DetailSidebar, { props: { project: p, lineage: none } }));
    for (const s of ['May 4, 2025', 'June 1, 2025', '28 days', 'Rails', 'JS', 'View code']) expect(t).toContain(s);
  });

  it('shows the lineage card only when there is lineage', async () => {
    const without = await container.renderToString(DetailSidebar, { props: { project: p, lineage: none } });
    expect(text(without)).not.toContain('Lineage');
    const html = await container.renderToString(DetailSidebar, {
      props: {
        project: p,
        lineage: { predecessors: [makeProject({ slug: 'v1', title: 'V1' })], successors: [makeProject({ slug: 'v3', title: 'V3' })] },
      },
    });
    expect(text(html)).toContain('Lineage');
    expect(html).toContain('href="/learnt/v1"');
    expect(html).toContain('href="/learnt/v3"');
  });

  it('omits died and View code when missing', async () => {
    const t = text(await container.renderToString(DetailSidebar, {
      props: { project: makeProject({ stage: 'sprout', died: undefined, githubUrl: undefined }), lineage: none },
    }));
    expect(t).not.toContain('Died');
    expect(t).not.toContain('View code');
  });
});
