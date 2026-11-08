import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import CompostCard from '../../src/components/home/CompostCard.astro';
import { makeProject } from './fixtures';

// #45: a recently composted card.
let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});
const text = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');

describe('CompostCard', () => {
  const dead = makeProject({ slug: 'old', title: 'Old Thing', stage: 'composted', born: '2025-05-04', died: '2025-06-01' });

  it('links the title and shows the compost line', async () => {
    const html = await container.renderToString(CompostCard, { props: { project: dead } });
    expect(html).toContain('href="/learnt/old"');
    expect(text(html)).toContain('Composted Jun 2025 · It was 28 days old.');
  });

  it('shows "Superseded by → {title}" when a successor exists', async () => {
    const successor = makeProject({ slug: 'new', title: 'New Thing' });
    const html = await container.renderToString(CompostCard, { props: { project: { ...dead, supersededBy: 'new' }, successor } });
    expect(text(html)).toContain('Superseded by → New Thing');
    expect(html).toContain('href="/learnt/new"');
  });

  it('has no successor line without one', async () => {
    const html = await container.renderToString(CompostCard, { props: { project: dead } });
    expect(html).not.toContain('Superseded by');
  });
});
