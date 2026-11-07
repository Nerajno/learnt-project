import { describe, it, expect } from 'vitest';
import { DEFAULT_FILTERS, STAGES, SORTS, parseFilters, buildQuery } from '../src/lib/archive';

describe('parseFilters', () => {
  it('returns defaults for an empty or unknown query', () => {
    expect(parseFilters('')).toEqual(DEFAULT_FILTERS);
    expect(parseFilters('?utm_source=x&foo=bar')).toEqual(DEFAULT_FILTERS);
  });

  it('parses every supported param', () => {
    expect(
      parseFilters('?q=Rails&stage=composted&category=backend&year=2024&sort=oldest'),
    ).toEqual({ q: 'Rails', stage: 'composted', category: 'backend', year: 2024, sort: 'oldest' });
  });

  it('ignores invalid stage, sort, and year values', () => {
    expect(parseFilters('?stage=dead&sort=weird&year=abc')).toEqual(DEFAULT_FILTERS);
  });

  it('trims the search term', () => {
    expect(parseFilters('?q=%20rails%20').q).toBe('rails');
  });
});

describe('buildQuery', () => {
  it('returns an empty string for defaults', () => {
    expect(buildQuery(DEFAULT_FILTERS)).toBe('');
  });

  it('emits non-default params in stable order', () => {
    expect(
      buildQuery({ q: 'rails', stage: 'composted', category: 'backend', year: 2024, sort: 'oldest' }),
    ).toBe('?q=rails&stage=composted&category=backend&year=2024&sort=oldest');
  });

  it('round-trips through parseFilters', () => {
    const filters = {
      q: 'ruby on rails',
      stage: 'shipped' as const,
      category: 'fullstack',
      year: 2023,
      sort: 'shortest' as const,
    };
    expect(parseFilters(buildQuery(filters))).toEqual(filters);
  });

  it('exposes the four stages and four sorts', () => {
    expect(STAGES.map((s) => s.value)).toEqual(['seed', 'sprout', 'shipped', 'composted']);
    expect(SORTS.map((s) => s.value)).toEqual(['newest', 'oldest', 'longest', 'shortest']);
  });
});
