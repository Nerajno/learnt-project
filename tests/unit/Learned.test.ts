import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Learned from '../../src/components/project/Learned.astro';
import { makeProject } from './fixtures';

let container: AstroContainer;
beforeAll(async () => { container = await AstroContainer.create(); });
const text = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('Learned (#46 Task 5)', () => {
  it('shows what was hard, what I learned, and the retrospective', async () => {
    const html = await container.renderToString(Learned, {
      props: { project: makeProject({ challenges: ['CORS'], learnings: ['Rails', 'REST'], retrospective: 'Would split earlier.' }) },
    });
    const t = text(html);
    expect(t).toContain('What was hard');
    expect(t).toContain('CORS');
    expect(t).toContain('What I learned');
    expect(html).toContain('data-testid="learnings-list"');
    expect(html.match(/<li/g)?.length).toBe(3);
    expect(html).toMatch(/<blockquote[^>]*>[\s\S]*Would split earlier\./);
  });

  it('hides each section that has no data', async () => {
    const html = await container.renderToString(Learned, { props: { project: makeProject({ learnings: ['One'] }) } });
    const t = text(html);
    expect(t).not.toContain('What was hard');
    expect(t).not.toContain('Retrospective');
    expect(t).toContain('What I learned');
  });

  it('renders nothing when all three are empty', async () => {
    const html = await container.renderToString(Learned, { props: { project: makeProject() } });
    expect(html.trim()).toBe('');
  });
});
