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
    born: '2024-01-01',
    tier: 'marker',
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
  it('builds a lowercase search blob and carries born/died', () => {
    const item = toArchiveItem(
      project({
        title: 'Rails Contacts',
        technologies: ['Ruby on Rails'],
        tags: ['CRUD'],
        learnings: ['MVC'],
        born: '2024-03-02',
        died: '2024-03-05',
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

  it('leaves died empty for an open project', () => {
    expect(toArchiveItem(project({ born: '2024-03-02' })).died).toBe('');
  });

  it('derives the year from the ISO born string', () => {
    expect(toArchiveItem(project({ born: '2023-01-01' })).year).toBe(2023);
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
