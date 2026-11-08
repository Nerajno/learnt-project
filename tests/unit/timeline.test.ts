import { describe, expect, it } from 'vitest';
import { endYear, getTimeline } from '../../src/lib/timeline';
import { makeProject } from './fixtures';

describe('endYear (#21)', () => {
  it('uses died for composted and shipped projects', () => {
    expect(endYear(makeProject({ stage: 'composted', born: '2022-05-01', died: '2023-02-01' }))).toBe(2023);
    expect(endYear(makeProject({ stage: 'shipped', born: '2021-05-01', died: '2022-03-01' }))).toBe(2022);
  });

  it('uses born for living projects, even when died is set', () => {
    expect(endYear(makeProject({ stage: 'sprout', born: '2024-01-10', died: '2025-01-01' }))).toBe(2024);
    expect(endYear(makeProject({ stage: 'seed', born: '2025-06-01', died: undefined }))).toBe(2025);
  });

  it('falls back to born when a finished project has no died date', () => {
    expect(endYear(makeProject({ stage: 'shipped', born: '2020-01-01', died: undefined }))).toBe(2020);
  });
});

describe('getTimeline (#21)', () => {
  const a = makeProject({ slug: 'a', title: 'Alpha', stage: 'composted', born: '2021-01-01', died: '2023-03-01' });
  const b = makeProject({ slug: 'b', title: 'Bravo', stage: 'shipped', born: '2022-01-01', died: '2023-09-01' });
  const c = makeProject({ slug: 'c', title: 'Charlie', stage: 'sprout', born: '2024-02-01', died: undefined });
  const d = makeProject({ slug: 'd', title: 'Delta', stage: 'shipped', born: '2020-01-01', died: '2023-09-01' });

  it('groups by end year, newest year first, newest project first, title on ties', () => {
    const t = getTimeline([a, b, c, d]);
    expect(t.map((y) => y.year)).toEqual([2024, 2023]);
    expect(t[0].projects.map((p) => p.slug)).toEqual(['c']);
    expect(t[1].projects.map((p) => p.slug)).toEqual(['b', 'd', 'a']);
  });

  it('returns [] for no projects', () => {
    expect(getTimeline([])).toEqual([]);
  });
});
