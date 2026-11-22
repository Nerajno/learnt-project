import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ArchiveTimeline from '../../src/components/ArchiveTimeline.astro';
import { makeProject } from './fixtures';

let container: AstroContainer;
beforeAll(async () => { container = await AstroContainer.create(); });

const shipped = makeProject({ slug: 'drum', title: 'Drum', stage: 'shipped', born: '2024-01-01', died: '2024-09-01' });
const sprout = makeProject({ slug: 'gh', title: 'GH', stage: 'sprout', born: '2023-02-01', died: undefined });
const years = [
  { year: 2024, projects: [shipped] },
  { year: 2023, projects: [sprout] },
];

describe('ArchiveTimeline (#21)', () => {
  it('renders one group per year, in the order given', async () => {
    const html = await container.renderToString(ArchiveTimeline, { props: { years } });
    expect([...html.matchAll(/data-year-group="(\d+)"/g)].map((m) => m[1])).toEqual(['2024', '2023']);
    expect(html).toMatch(/<h3[^>]*>2024<\/h3>/);
  });

  it('is hidden until the script shows it, so no-JS users get only the grid', async () => {
    const html = await container.renderToString(ArchiveTimeline, { props: { years } });
    expect(html).toMatch(/<section[^>]*id="project-timeline"[^>]*hidden/);
    expect(html).toMatch(/<h2[^>]*id="timeline-h"[^>]*>Timeline<\/h2>/);
  });

  it('rows link to the project, carry a stage chip and dates', async () => {
    const html = await container.renderToString(ArchiveTimeline, { props: { years } });
    expect(html).toMatch(/<li[^>]*data-slug="drum"/);
    expect(html).toContain('href="/learnt/drum"');
    expect(html).toMatch(/class="[^"]*stage-chip[^"]*"[^>]*data-stage="shipped"|data-stage="shipped"[^>]*class="[^"]*stage-chip/);
    expect(html).toContain('datetime="2024-09-01"');
  });

  it('a living project shows no end date', async () => {
    const html = await container.renderToString(ArchiveTimeline, { props: { years: [{ year: 2023, projects: [sprout] }] } });
    expect(html).toContain('datetime="2023-02-01"');
    expect(html.match(/<time/g)?.length).toBe(1);
  });

  it('renders the section with no groups when empty', async () => {
    const html = await container.renderToString(ArchiveTimeline, { props: { years: [] } });
    expect(html).toContain('id="project-timeline"');
    expect(html).not.toContain('data-year-group');
  });

  it('#32: a superseded row names its successor once, in an ending chip', async () => {
    const old = makeProject({
      slug: 'learnt-v2', title: 'Learnt V2', stage: 'composted', born: '2025-08-10', died: '2025-08-20',
      causeOfDeath: 'superseded', supersededBy: 'learnt-project',
    });
    const html = await container.renderToString(ArchiveTimeline, { props: { years: [{ year: 2025, projects: [old] }] } });
    expect(html).toContain('data-ending="successor"');
    expect(html).toContain('href="/learnt/learnt-project"');
    expect(html).not.toContain('stage-chip__cause');
  });

  it('#32: a composted row with no cause shows the gap', async () => {
    const gap = makeProject({ slug: 'nosey', stage: 'composted', born: '2025-02-15', died: '2025-03-15' });
    const html = await container.renderToString(ArchiveTimeline, { props: { years: [{ year: 2025, projects: [gap] }] } });
    expect(html).toContain('data-ending="missing"');
  });

  it('#32: shipped rows and plain causes get no extra chip', async () => {
    const ended = makeProject({ slug: 'course', stage: 'composted', born: '2024-01-01', died: '2024-02-01', causeOfDeath: 'course-ended' });
    const html = await container.renderToString(ArchiveTimeline, { props: { years: [{ year: 2024, projects: [shipped, ended] }] } });
    expect(html).not.toContain('data-ending');
    expect(html).toContain('stage-chip__cause');
  });
});
