import { describe, expect, it } from 'vitest';
import { projects } from '../src/data/projects';

// #49: cards count `learnings` and detail pages render it, so there must be
// exactly one learnings list per project.
describe('learnings data (#49)', () => {
  it('no project carries the retired `learned` list', () => {
    const withLearned = projects.filter((p) => 'learned' in p).map((p) => p.slug);
    expect(withLearned).toEqual([]);
  });

  it('every project has at least one learning', () => {
    const empty = projects.filter((p) => p.learnings.length === 0).map((p) => p.slug);
    expect(empty).toEqual([]);
  });
});
