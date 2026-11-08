import { afterEach, describe, expect, it, vi } from 'vitest';
import { projects } from '../../src/data/projects';
import {
  daysBetween,
  getByYear,
  getLifespan,
  getLineage,
  getStats,
} from '../../src/lib/projects';
import { makeProject } from './fixtures';

afterEach(() => {
  vi.useRealTimers();
});

describe('daysBetween', () => {
  it('counts whole days', () => {
    expect(daysBetween('2024-01-01', '2024-01-31')).toBe(30);
  });

  it('returns 0 for the same day', () => {
    expect(daysBetween('2024-01-01', '2024-01-01')).toBe(0);
  });

  it('handles leap years', () => {
    expect(daysBetween('2024-02-28', '2024-03-01')).toBe(2);
  });

  it('clamps an inverted range to zero', () => {
    expect(daysBetween('2024-02-01', '2024-01-01')).toBe(0);
  });

  it('returns null for missing or invalid dates', () => {
    expect(daysBetween('', '2024-01-01')).toBeNull();
    expect(daysBetween('2024-01-01', 'not-a-date')).toBeNull();
  });
});

describe('getLifespan', () => {
  it('uses died when present', () => {
    expect(getLifespan({ born: '2024-01-01', died: '2024-01-11', stage: 'shipped' })).toBe(10);
  });

  it('uses today when died is absent', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-31T00:00:00Z'));
    expect(getLifespan({ born: '2024-01-01', stage: 'sprout' })).toBe(30);
  });

  it('never counts to today for a finished project without died (#39)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-31T00:00:00Z'));
    expect(getLifespan({ born: '2024-01-01', stage: 'shipped' })).toBe(0);
    expect(getLifespan({ born: '2024-01-01', stage: 'composted' })).toBe(0);
  });

  it('a shipped lifespan does not grow a year later', () => {
    vi.useFakeTimers();
    const shipped = { born: '2024-01-01', died: '2024-03-01', stage: 'shipped' as const };
    vi.setSystemTime(new Date('2024-06-01T00:00:00Z'));
    const before = getLifespan(shipped);
    vi.setSystemTime(new Date('2025-06-01T00:00:00Z'));
    expect(getLifespan(shipped)).toBe(before);
  });
});

describe('getLineage', () => {
  const a = makeProject({ slug: 'learnt-v1', title: 'Learnt V1', supersededBy: 'learnt-v2' });
  const b = makeProject({ slug: 'learnt-v2', title: 'Learnt V2', supersededBy: 'learnt-project' });
  const c = makeProject({ slug: 'learnt-project', title: 'Learnt Project' });
  const all = [a, b, c];

  it('walks successors through supersededBy', () => {
    expect(getLineage(b, all).successors.map((p) => p.slug)).toEqual(['learnt-project']);
    expect(getLineage(a, all).successors.map((p) => p.slug)).toEqual(['learnt-v2', 'learnt-project']);
  });

  it('walks predecessors in both directions', () => {
    expect(getLineage(b, all).predecessors.map((p) => p.slug)).toEqual(['learnt-v1']);
    expect(getLineage(c, all).predecessors.map((p) => p.slug)).toEqual(['learnt-v1', 'learnt-v2']);
  });

  it('guards against cycles', () => {
    const x = makeProject({ slug: 'x', supersededBy: 'y' });
    const y = makeProject({ slug: 'y', supersededBy: 'x' });
    expect(getLineage(x, [x, y]).successors.map((p) => p.slug)).toEqual(['y']);
    expect(getLineage(x, [x, y]).predecessors.map((p) => p.slug)).toEqual(['y']);
  });
});

describe('getStats', () => {
  const sample = [
    makeProject({ slug: 'a', stage: 'shipped', tier: 'marker', causeOfDeath: 'shipped' }),
    makeProject({
      slug: 'b',
      stage: 'composted',
      tier: 'headstone',
      died: '2024-02-01',
      causeOfDeath: 'course-ended',
    }),
    makeProject({ slug: 'c', stage: 'sprout', tier: 'coursework' }),
  ];

  it('counts by stage, tier, and cause', () => {
    const stats = getStats(sample);
    expect(stats.total).toBe(3);
    expect(stats.byStage).toEqual({ seed: 0, sprout: 1, shipped: 1, composted: 1 });
    expect(stats.byTier).toEqual({ headstone: 1, marker: 1, coursework: 1 });
    expect(stats.byCause).toMatchObject({ shipped: 1, 'course-ended': 1, abandoned: 0 });
  });

  it('totals the real data', () => {
    const stats = getStats();
    expect(stats.total).toBe(projects.length);
    expect(Object.values(stats.byStage).reduce((sum, count) => sum + count, 0)).toBe(projects.length);
    expect(Object.values(stats.byTier).reduce((sum, count) => sum + count, 0)).toBe(projects.length);
  });
});

describe('getByYear', () => {
  const sample = [
    makeProject({ slug: 'a', born: '2023-01-01', stage: 'shipped' }),
    makeProject({
      slug: 'b',
      born: '2023-06-01',
      stage: 'composted',
      died: '2023-07-01',
      causeOfDeath: 'course-ended',
    }),
    makeProject({ slug: 'c', born: '2024-01-01', stage: 'sprout' }),
  ];

  it('splits counts by year and stage, newest first', () => {
    const years = getByYear(sample);
    expect(years.map((year) => year.year)).toEqual([2024, 2023]);
    expect(years[1]).toEqual({
      year: 2023,
      total: 2,
      byStage: { seed: 0, sprout: 0, shipped: 1, composted: 1 },
    });
  });

  it('totals the real data', () => {
    const years = getByYear();
    expect(years.reduce((sum, year) => sum + year.total, 0)).toBe(projects.length);
  });
});
