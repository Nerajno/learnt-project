import { describe, it, expect } from 'vitest';
import type { Project } from '../src/data/projects';
import { deriveStage, lifespanDays, toArchiveItem, cardDataset } from '../src/lib/archive';

function project(overrides: Partial<Project> = {}): Project {
  return {
    id: 'x',
    title: 'Thing',
    slug: 'thing',
    description: 'A thing',
    longDescription: 'A longer thing',
    technologies: ['Rails'],
    category: 'backend',
    status: 'completed',
    difficulty: 'beginner',
    phase: 'active',
    dateStarted: '2024-01-01',
    dateCreated: '2024-01-01',
    features: [],
    learnings: ['Learned something'],
    challenges: [],
    tags: ['api'],
    featured: false,
    ...overrides,
  };
}

describe('deriveStage', () => {
  it.each([
    ['planned', 'active', 'seed'],
    ['in-progress', 'active', 'sprout'],
    ['completed', 'active', 'shipped'],
    ['completed', 'archived', 'shipped'],
    ['completed', 'sunset', 'composted'],
    ['archived', 'any', 'composted'],
  ] as const)('%s + %s -> %s', (status, phase, expected) => {
    expect(deriveStage(project({ status, phase: phase === 'any' ? 'archived' : phase }))).toBe(expected);
  });
});

describe('lifespanDays', () => {
  const item = (born: string, died: string) =>
    ({ slug: 's', title: 'T', category: 'backend', stage: 'shipped', year: 2024, born, died, search: '' }) as const;

  it('counts whole days from born to died', () => {
    expect(lifespanDays({ ...item('2024-01-01', '2024-01-31') })).toBe(30);
  });

  it('returns null when the project has no end date', () => {
    expect(lifespanDays({ ...item('2024-01-01', '') })).toBeNull();
  });

  it('returns null without a start date', () => {
    expect(lifespanDays({ ...item('', '2024-01-31') })).toBeNull();
  });

  it('clamps an inverted range to zero', () => {
    expect(lifespanDays({ ...item('2024-02-01', '2024-01-01') })).toBe(0);
  });
});

describe('toArchiveItem', () => {
  it('builds a lowercase search blob and normalised dates', () => {
    const item = toArchiveItem(
      project({
        title: 'Rails Contacts',
        technologies: ['Ruby on Rails'],
        tags: ['CRUD'],
        learnings: ['MVC'],
        dateCreated: '2024-03-02',
        dateCompleted: '2024-03-05',
      }),
    );
    expect(item).toMatchObject({
      slug: 'thing',
      title: 'Rails Contacts',
      category: 'backend',
      stage: 'shipped',
      year: 2024,
      born: '2024-03-02',
      died: '2024-03-05',
    });
    for (const needle of ['rails contacts', 'ruby on rails', 'crud', 'mvc']) {
      expect(item.search).toContain(needle);
    }
    expect(item.search).toBe(item.search.toLowerCase());
  });

  it('falls back to dateStarted when dateCreated is absent', () => {
    const item = toArchiveItem(project({ dateCreated: undefined, dateStarted: '2023-07-04' }));
    expect(item.year).toBe(2023);
    expect(item.born).toBe('2023-07-04');
  });

  it('prefers dateCompleted, then sunsetDate, then dateSunset', () => {
    expect(toArchiveItem(project({ dateCompleted: '2024-01-02' })).died).toBe('2024-01-02');
    expect(
      toArchiveItem(project({ dateCompleted: undefined, sunsetDate: '2024-02-03' })).died,
    ).toBe('2024-02-03');
    expect(
      toArchiveItem(project({ dateCompleted: undefined, sunsetDate: undefined, dateSunset: '2024-03-04' })).died,
    ).toBe('2024-03-04');
  });
});

describe('cardDataset', () => {
  it('emits the data attributes the page and script rely on', () => {
    const dataset = cardDataset({
      slug: 'thing',
      title: 'Thing',
      category: 'backend',
      stage: 'composted',
      year: 2023,
      born: '2023-01-01',
      died: '2023-02-01',
      search: 'thing rails',
    });
    expect(dataset).toEqual({
      'data-slug': 'thing',
      'data-title': 'Thing',
      'data-stage': 'composted',
      'data-category': 'backend',
      'data-year': '2023',
      'data-born': '2023-01-01',
      'data-died': '2023-02-01',
      'data-search': 'thing rails',
    });
  });

  it('emits an empty year when the date is unusable', () => {
    const dataset = cardDataset({
      slug: 's', title: 'S', category: 'api', stage: 'seed', year: null,
      born: '', died: '', search: '',
    });
    expect(dataset['data-year']).toBe('');
  });
});
