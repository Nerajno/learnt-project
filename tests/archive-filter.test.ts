import { describe, it, expect } from 'vitest';
import {
  countByStage,
  filterProjects,
  matchesFilters,
  sortProjects,
  DEFAULT_FILTERS,
  type ArchiveItem,
} from '../src/lib/archive';

function item(overrides: Partial<ArchiveItem> = {}): ArchiveItem {
  return {
    slug: 'a', title: 'Alpha', category: 'backend', stage: 'shipped', year: 2024,
    born: '2024-01-01', died: '2024-01-11', search: 'alpha rails', ...overrides,
  };
}

const items = [
  item(),
  item({ slug: 'b', title: 'Beta', category: 'frontend', stage: 'composted', year: 2023, born: '2023-01-01', died: '2023-01-02', search: 'beta vue' }),
  item({ slug: 'c', title: 'Gamma', category: 'backend', stage: 'sprout', year: 2024, born: '2024-02-01', died: '', search: 'gamma rails' }),
];

describe('matchesFilters', () => {
  it('matches search case-insensitively', () => {
    expect(items.filter((i) => matchesFilters(i, { ...DEFAULT_FILTERS, q: 'RAILS' })).map((i) => i.slug)).toEqual(['a', 'c']);
  });

  it('combines filters with AND', () => {
    expect(
      items.filter((i) => matchesFilters(i, { ...DEFAULT_FILTERS, q: 'rails', stage: 'shipped' })).map((i) => i.slug),
    ).toEqual(['a']);
  });

  it('filters by category and year', () => {
    expect(items.filter((i) => matchesFilters(i, { ...DEFAULT_FILTERS, category: 'frontend' })).map((i) => i.slug)).toEqual(['b']);
    expect(items.filter((i) => matchesFilters(i, { ...DEFAULT_FILTERS, year: 2024 })).map((i) => i.slug)).toEqual(['a', 'c']);
  });

  it('matches everything with defaults', () => {
    expect(items.filter((i) => matchesFilters(i, DEFAULT_FILTERS))).toHaveLength(3);
  });
});

describe('sortProjects', () => {
  it('sorts newest and oldest by born date', () => {
    expect(sortProjects(items, 'newest').map((i) => i.slug)).toEqual(['c', 'a', 'b']);
    expect(sortProjects(items, 'oldest').map((i) => i.slug)).toEqual(['b', 'a', 'c']);
  });

  it('sorts longest and shortest with open-ended items last', () => {
    expect(sortProjects(items, 'longest').map((i) => i.slug)).toEqual(['a', 'b', 'c']);
    expect(sortProjects(items, 'shortest').map((i) => i.slug)).toEqual(['b', 'a', 'c']);
  });

  it('breaks ties by title and does not mutate the input', () => {
    const tied = [item({ slug: 'z', title: 'Zulu' }), item({ slug: 'y', title: 'Yankee' })];
    expect(sortProjects(tied, 'newest').map((i) => i.title)).toEqual(['Yankee', 'Zulu']);
    expect(tied.map((i) => i.slug)).toEqual(['z', 'y']);
  });
});

describe('filterProjects', () => {
  it('filters then sorts', () => {
    expect(filterProjects(items, { ...DEFAULT_FILTERS, q: 'rails', sort: 'oldest' }).map((i) => i.slug)).toEqual(['a', 'c']);
  });
});

describe('countByStage', () => {
  it('counts every stage, including empty ones', () => {
    expect(countByStage(items)).toEqual({ seed: 0, sprout: 1, shipped: 1, composted: 1 });
  });
});
