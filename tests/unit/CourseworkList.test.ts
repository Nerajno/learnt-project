import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import CourseworkList from '../../src/components/CourseworkList.astro';
import { makeProject } from './fixtures';

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe('CourseworkList', () => {
  it('renders nothing when there is no coursework', async () => {
    const html = await container.renderToString(CourseworkList, { props: { projects: [] } });
    expect(html).not.toContain('id="coursework"');
  });

  it('renders a collapsed list with title, date, repo, and epitaph', async () => {
    const html = await container.renderToString(CourseworkList, {
      props: {
        projects: [
          makeProject({
            title: 'Tutorial',
            slug: 'tutorial',
            born: '2024-03-01',
            githubUrl: 'https://github.com/Nerajno/x',
            epitaph: 'Learned loops',
          }),
        ],
      },
    });
    expect(html).toContain('id="coursework"');
    expect(html).not.toMatch(/<details[^>]*\sopen/);
    expect(html).toContain('Coursework (1)');
    expect(html).toContain('href="/learnt/tutorial"');
    expect(html).toContain('datetime="2024-03-01"');
    expect(html).toContain('href="https://github.com/Nerajno/x"');
    expect(html).toContain('aria-label="Repo: Tutorial"');
    expect(html).toContain('Learned loops');
  });
});
