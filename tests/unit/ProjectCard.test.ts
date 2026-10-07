import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ProjectCard from '../../src/components/ProjectCard.astro';
import type { Project } from '../../src/data/projects';
import { makeProject } from './fixtures';

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (project: Project) =>
  container.renderToString(ProjectCard, { props: { project } });

describe('ProjectCard', () => {
  it('renders the title as a link to the detail page', async () => {
    const html = await render(makeProject({ title: 'Burble V1', slug: 'burble-v1' }));
    expect(html).toContain('href="/learnt/burble-v1"');
    expect(html).toContain('Burble V1');
  });

  it('shows no progress value for in-progress projects (#10)', async () => {
    const html = await render(makeProject({ status: 'in-progress' }));
    expect(html).not.toContain('width: 75%');
    expect(html).not.toContain('>75%<');
  });

  it('renders no live or source links when the urls are missing', async () => {
    const html = await render(makeProject({ liveUrl: undefined, githubUrl: undefined }));
    expect(html).not.toContain('href="undefined"');
    expect(html).not.toContain('live demo');
    expect(html).not.toContain('source code');
  });

  it('renders links when the urls are present', async () => {
    const html = await render(
      makeProject({ liveUrl: 'https://example.com', githubUrl: 'https://github.com/Nerajno/x' }),
    );
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('href="https://github.com/Nerajno/x"');
  });

  it('renders with an empty technologies list', async () => {
    const html = await render(makeProject({ technologies: [] }));
    expect(html).toContain('Test Project');
    expect(html).not.toMatch(/\+-?\d+ more/);
  });

  it('collapses more than four technologies into a "+N more" chip', async () => {
    const html = await render(makeProject({ technologies: ['A', 'B', 'C', 'D', 'E', 'F'] }));
    expect(html).toMatch(/\+2\s*more/);
  });
});
