import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import DetailHeader from '../../src/components/project/DetailHeader.astro';
import { makeProject } from './fixtures';

// #46 Task 2: detail header.
let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('DetailHeader', () => {
  const composted = makeProject({
    slug: 'side-project-status', title: 'Side Project', short: 'A tracker.', category: 'frontend', tier: 'marker',
    stage: 'composted', causeOfDeath: 'superseded', born: '2025-05-04', died: '2025-06-01',
  });

  it('has a breadcrumb nav: learnt / archive / slug', async () => {
    const html = await container.renderToString(DetailHeader, { props: { project: composted } });
    expect(html).toMatch(/<nav[^>]*aria-label="Breadcrumb"/);
    expect(html).toContain('href="/learnt"');
    expect(text(html)).toMatch(/learnt \/ archive \/ side-project-status/);
  });

  it('shows stage (with cause), category and tier chips, H1 and description', async () => {
    const html = await container.renderToString(DetailHeader, { props: { project: composted } });
    expect(html).toContain('data-stage="composted"');
    expect(text(html)).toContain('Composted · superseded');
    expect(text(html)).toContain('frontend');
    expect(text(html)).toContain('marker');
    expect(html).toMatch(/<h1[^>]*>\s*Side Project\s*<\/h1>/);
    expect(text(html)).toContain('A tracker.');
  });

  it('reads "Born … · Composted … · It was N days old." in amber when composted', async () => {
    const html = await container.renderToString(DetailHeader, { props: { project: composted } });
    expect(text(html)).toContain('Born May 4, 2025 · Composted June 1, 2025 · It was 28 days old.');
    expect(html).toMatch(/class="[^"]*lifeline--composted/);
  });

  it('a living project reads "Born … · Still growing"', async () => {
    const html = await container.renderToString(DetailHeader, {
      props: { project: makeProject({ stage: 'sprout', born: '2025-05-04', died: undefined }) },
    });
    expect(text(html)).toContain('Born May 4, 2025 · Still growing');
    expect(html).not.toContain('lifeline--composted');
  });
});
