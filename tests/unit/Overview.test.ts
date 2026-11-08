import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Overview from '../../src/components/project/Overview.astro';
import { makeProject } from './fixtures';

let container: AstroContainer;
beforeAll(async () => { container = await AstroContainer.create(); });
const text = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('Overview (#46 review)', () => {
  it('shows the long description, features, next steps and changelog', async () => {
    const html = await container.renderToString(Overview, {
      props: {
        project: makeProject({
          longDescription: 'A longer story.',
          features: ['Search', 'Filters'],
          nextSteps: ['Add RSS'],
          changelog: [{ date: '2025-09-15', note: 'Initial launch' }],
        }),
      },
    });
    const t = text(html);
    expect(t).toContain('About this project');
    expect(t).toContain('A longer story.');
    expect(t).toContain('Search');
    expect(t).toContain('Filters');
    expect(t).toContain('Next steps');
    expect(t).toContain('Add RSS');
    expect(t).toContain('Changelog');
    expect(html).toMatch(/<time[^>]*datetime="2025-09-15"/);
    expect(t).toContain('Initial launch');
    for (const list of html.match(/<[ou]l\b[^>]*>/g) ?? []) expect(list).toContain('role="list"');
  });

  it('hides parts with no data', async () => {
    const html = await container.renderToString(Overview, {
      props: { project: makeProject({ longDescription: 'Only this.', features: [], nextSteps: undefined, changelog: undefined }) },
    });
    const t = text(html);
    expect(t).toContain('Only this.');
    expect(t).not.toContain('Next steps');
    expect(t).not.toContain('Changelog');
    expect(html).not.toMatch(/<ul/);
  });

  it('renders nothing when there is no content', async () => {
    const html = await container.renderToString(Overview, {
      props: { project: makeProject({ longDescription: '', features: [] }) },
    });
    expect(text(html).trim()).toBe('');
  });
});
