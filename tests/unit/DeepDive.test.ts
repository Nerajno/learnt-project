import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import DeepDive from '../../src/components/project/DeepDive.astro';
import { makeProject } from './fixtures';

let container: AstroContainer;
beforeAll(async () => { container = await AstroContainer.create(); });
const headings = (h: string) => [...h.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map((m) => m[1]);

const full = {
  problem: 'Contacts lived in five places.',
  successCriteria: ['One source of truth'],
  approach: 'Rails API + SPA.',
  architectureDiagram: '/images/project-placeholder.svg',
  tradeoffs: [{ decision: 'Rails API', why: 'Fast CRUD', adrUrl: 'https://example.com/adr-1' }],
  measurableOutcome: 'Used daily for a year.',
  ai: { tools: ['Copilot'], aiDid: 'Scaffolded tests', iOwned: 'Data model', aiGotWrong: 'Invented a gem' },
  v2: ['Add search'],
  walkthroughVideo: 'https://example.com/video',
  relatedPosts: ['https://example.com/post'],
};

describe('DeepDive (#24)', () => {
  it('renders all eight sections in story order', async () => {
    const html = await container.renderToString(DeepDive, { props: { project: makeProject({ title: 'TK', deepDive: full }) } });
    expect(headings(html)).toEqual([
      'Problem', 'Success criteria', 'Approach', 'Tradeoffs', 'Measurable outcome', 'AI collaboration', "What I'd change in v2", 'Evidence',
    ]);
    expect(html).toContain('href="https://example.com/adr-1"');
    expect(html).toMatch(/alt="TK architecture diagram"/);
    expect(html).toContain('Invented a gem');
  });

  it('shows the plain sentence when no AI tools were used', async () => {
    const html = await container.renderToString(DeepDive, { props: { project: makeProject({ deepDive: { ...full, ai: 'No AI tools used' } }) } });
    expect(html).toContain('No AI tools used');
    expect(html).not.toContain('Copilot');
  });

  it('omits empty sections', async () => {
    const sparse = { problem: 'P', successCriteria: [], approach: 'A', tradeoffs: [], measurableOutcome: 'M', v2: [] };
    const html = await container.renderToString(DeepDive, { props: { project: makeProject({ deepDive: sparse }) } });
    expect(headings(html)).toEqual(['Problem', 'Approach', 'Measurable outcome']);
  });

  it('renders nothing without a deep dive', async () => {
    const html = await container.renderToString(DeepDive, { props: { project: makeProject({ deepDive: undefined }) } });
    expect(html.replace(/<[^>]+>/g, '').trim()).toBe('');
  });
});
