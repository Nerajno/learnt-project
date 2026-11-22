import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import EndingChip from '../../src/components/EndingChip.astro';
import { makeProject } from './fixtures';

// #32: how a project ended.
let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});
const text = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const render = (props: Record<string, unknown>) => container.renderToString(EndingChip, { props });

describe('EndingChip', () => {
  it('links the successor by title', async () => {
    const project = makeProject({ stage: 'composted', died: '2025-08-20', causeOfDeath: 'superseded', supersededBy: 'learnt-project' });
    const successor = makeProject({ slug: 'learnt-project', title: 'Learnt Project' });
    const html = await render({ project, successor });
    expect(html).toContain('data-ending="successor"');
    expect(html).toContain('href="/learnt/learnt-project"');
    expect(text(html)).toBe('superseded by → Learnt Project');
  });

  it('falls back to the slug when the successor is not passed', async () => {
    const project = makeProject({ stage: 'composted', died: '2025-01-01', causeOfDeath: 'merged-into', supersededBy: 'big-app' });
    expect(text(await render({ project }))).toBe('merged into → big-app');
  });

  it('flags a missing cause with words and a marker, not colour alone', async () => {
    const html = await render({ project: makeProject({ stage: 'composted', died: '2025-01-01' }) });
    expect(html).toContain('data-ending="missing"');
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
    expect(text(html)).toBe('cause not recorded');
  });

  it('shows a plain label for shipped and other causes', async () => {
    expect(text(await render({ project: makeProject({ stage: 'shipped' }) }))).toBe('shipped and closed out');
    expect(text(await render({ project: makeProject({ stage: 'composted', died: '2025-01-01', causeOfDeath: 'course-ended' }) })))
      .toBe('course ended');
  });

  it('renders nothing for a living project', async () => {
    expect((await render({ project: makeProject({ stage: 'sprout' }) })).trim()).toBe('');
  });
});
