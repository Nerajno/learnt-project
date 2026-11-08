import { describe, expect, it } from 'vitest';
import { getNeighbours, getRelated } from '../../src/lib/detail';
import { makeProject } from './fixtures';

// #46 detail-page selectors.
const p = (slug: string, technologies: string[]) => makeProject({ slug, technologies });

describe('getRelated', () => {
  const me = p('me', ['Astro', 'TypeScript', 'CSS']);
  const all = [me, p('one', ['CSS']), p('three', ['Astro', 'TypeScript', 'CSS']), p('none', ['Go']),
    p('two', ['Astro', 'CSS']), p('one-b', ['TypeScript'])];

  it('returns at most 3, never itself, ordered by shared technologies', () => {
    expect(getRelated(me, all).map((x) => x.slug)).toEqual(['three', 'two', 'one']);
  });

  it('skips projects that share nothing', () => {
    expect(getRelated(me, [me, p('none', ['Go'])])).toEqual([]);
  });
});

describe('getNeighbours', () => {
  const all = [p('a', []), p('b', []), p('c', [])];
  it('gives prev and next in collection order', () => {
    const { prev, next } = getNeighbours(all[1], all);
    expect([prev?.slug, next?.slug]).toEqual(['a', 'c']);
  });
  it('handles the first and last project', () => {
    expect(getNeighbours(all[0], all).prev).toBeUndefined();
    expect(getNeighbours(all[2], all).next).toBeUndefined();
  });
});
