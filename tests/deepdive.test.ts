import { describe, expect, it } from 'vitest';
import { projects, type DeepDive } from '../src/data/projects';

// #17: the deepDive block covers VWC §4 for headstone projects only.
const full: DeepDive = {
  problem: 'Students lost track of assignments across tools.',
  successCriteria: ['Create, edit and delete notes', 'Works as a single page'],
  approach: 'Rails API with a vanilla JS single-page front end.',
  tradeoffs: [{ decision: 'Rails API over full-stack Rails', why: 'Keep the SPA separate', adrUrl: 'https://example.com/adr/1' }],
  measurableOutcome: 'Shipped as a Flatiron portfolio project.',
  v2: ['Add authentication'],
  walkthroughVideo: 'https://youtu.be/example',
  ai: { tools: ['Copilot'], aiDid: 'Boilerplate', iOwned: 'Schema design', aiGotWrong: 'CORS config' },
  architectureDiagram: '/images/diagrams/tk.svg',
  dataModel: 'Notebook has many notes',
  relatedPosts: ['https://developingdvlpr.com/blog/example'],
};

const preAi: DeepDive = { ...full, ai: 'No AI tools used' };

describe('deepDive schema (#17)', () => {
  it('accepts a full block and the "No AI tools used" form', () => {
    expect(full.tradeoffs[0].decision).toBeTruthy();
    expect(preAi.ai).toBe('No AI tools used');
  });

  it('only headstone projects carry a deepDive', () => {
    const offenders = projects.filter((p) => p.deepDive && p.tier !== 'headstone').map((p) => p.slug);
    expect(offenders).toEqual([]);
  });

  it('headstones keep their v2 ideas in deepDive.v2, not nextSteps', () => {
    const offenders = projects.filter((p) => p.tier === 'headstone' && p.nextSteps?.length).map((p) => p.slug);
    expect(offenders).toEqual([]);
  });
});
