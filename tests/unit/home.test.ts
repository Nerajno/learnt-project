import { describe, expect, it } from 'vitest';
import { getRecentlyComposted, getStillGrowing, toYearBars, compostLine, firstYear } from '../../src/lib/home';
import { makeProject } from './fixtures';

// #45 Home selectors.
const c = (slug: string, died: string, extra = {}) =>
  makeProject({ slug, stage: 'composted', born: '2020-01-01', died, ...extra });

describe('getRecentlyComposted', () => {
  it('returns the 3 newest composted projects by died', () => {
    const list = [c('a', '2023-01-01'), c('b', '2025-01-01'), c('c', '2024-01-01'), c('d', '2022-01-01'),
      makeProject({ slug: 'shipped', stage: 'shipped', died: '2026-01-01' })];
    expect(getRecentlyComposted(list).map((p) => p.slug)).toEqual(['b', 'c', 'a']);
  });

  it('handles fewer than 3', () => {
    expect(getRecentlyComposted([c('a', '2023-01-01')]).map((p) => p.slug)).toEqual(['a']);
    expect(getRecentlyComposted([])).toEqual([]);
  });
});

describe('getStillGrowing', () => {
  it('contains only sprout projects, newest born first', () => {
    const list = [
      makeProject({ slug: 'old', stage: 'sprout', born: '2023-01-01' }),
      makeProject({ slug: 'seed', stage: 'seed', born: '2025-01-01' }),
      makeProject({ slug: 'new', stage: 'sprout', born: '2025-06-01' }),
      makeProject({ slug: 'done', stage: 'shipped', born: '2025-07-01' }),
    ];
    expect(getStillGrowing(list).map((p) => p.slug)).toEqual(['new', 'old']);
  });
});

describe('toYearBars', () => {
  it('scales widths so the largest year is 100%', () => {
    const bars = toYearBars([
      { year: 2025, total: 4, byStage: { seed: 0, sprout: 4, shipped: 0, composted: 0 } },
      { year: 2024, total: 8, byStage: { seed: 0, sprout: 0, shipped: 6, composted: 2 } },
      { year: 2023, total: 2, byStage: { seed: 0, sprout: 0, shipped: 2, composted: 0 } },
    ]);
    expect(bars.map((b) => [b.year, b.width])).toEqual([[2025, 50], [2024, 100], [2023, 25]]);
    expect(bars[0].href).toBe('/learnt?year=2025');
  });

  it('splits each bar into stage segments sized against the busiest year', () => {
    const [, y2024] = toYearBars([
      { year: 2025, total: 4, byStage: { seed: 0, sprout: 4, shipped: 0, composted: 0 } },
      { year: 2024, total: 8, byStage: { seed: 0, sprout: 0, shipped: 6, composted: 2 } },
    ]);
    expect(y2024.segments).toEqual([
      { stage: 'shipped', count: 6, width: 75 },
      { stage: 'composted', count: 2, width: 25 },
    ]);
  });

  it('is empty for no years', () => {
    expect(toYearBars([])).toEqual([]);
  });
});

describe('firstYear', () => {
  it('is the earliest born year', () => {
    expect(firstYear([makeProject({ born: '2024-05-01' }), makeProject({ born: '2021-02-01' })])).toBe(2021);
  });

  it('falls back to the current year for an empty collection', () => {
    expect(firstYear([], new Date('2026-03-01T00:00:00Z'))).toBe(2026);
  });
});

describe('compostLine', () => {
  it('reads "Composted {Mon YYYY} · {epitaph} · It was N days old."', () => {
    const p = c('x', '2025-06-01', { born: '2025-05-04', epitaph: 'Outgrown by its successor.' });
    expect(compostLine(p)).toBe('Composted Jun 2025 · Outgrown by its successor. · It was 28 days old.');
  });

  it('skips the epitaph segment when there is none', () => {
    expect(compostLine(c('x', '2025-06-01', { born: '2025-05-04' }))).toBe('Composted Jun 2025 · It was 28 days old.');
  });
});
