import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import SuccessorBanner from '../../src/components/project/SuccessorBanner.astro';
import { makeProject } from './fixtures';

let container: AstroContainer;
beforeAll(async () => { container = await AstroContainer.create(); });
const text = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('SuccessorBanner (#46 Task 3)', () => {
  it('names the successor and links to it', async () => {
    const html = await container.renderToString(SuccessorBanner, { props: { successor: makeProject({ slug: 'next', title: 'Next One' }) } });
    expect(text(html)).toContain('Superseded by Next One');
    expect(html).toMatch(/<strong[^>]*>Next One<\/strong>/);
    expect(html).toContain('href="/learnt/next"');
    expect(text(html)).toContain('Open the successor →');
  });

  it('renders nothing without a successor', async () => {
    const html = await container.renderToString(SuccessorBanner, { props: {} });
    expect(html.trim()).toBe('');
  });
});
