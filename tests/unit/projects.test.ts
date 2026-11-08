import { describe, expect, it } from 'vitest';
import {
  getCardProjects,
  getCourseworkProjects,
  getFeaturedProjects,
  getProjectYears,
  getUniqueCategories,
  getProjectsByYear,
  getRecentProjects,
  projects,
} from '../../src/data/projects';

describe('date helpers use born (#15)', () => {
  it('getRecentProjects is ordered by born descending', () => {
    const born = getRecentProjects(5).map((p) => p.born);
    expect([...born].sort().reverse()).toEqual(born);
  });

  it('getProjectsByYear buckets by the born year, timezone-stable', () => {
    const expected = projects
      .filter((p) => p.born.startsWith('2023'))
      .map((p) => p.slug)
      .sort();
    expect(getProjectsByYear(2023).map((p) => p.slug).sort()).toEqual(expected);
  });

  it('getProjectYears returns the born years, newest first', () => {
    const expected = [...new Set(projects.map((p) => Number(p.born.slice(0, 4))))].sort((a, b) => b - a);
    expect(getProjectYears()).toEqual(expected);
  });
});

describe('graveyard dates (#15)', () => {
  const ISO = /^\d{4}-\d{2}-\d{2}$/;
  const legacy = ['dateStarted', 'dateCreated', 'dateCompleted', 'sunsetDate', 'dateSunset'];

  it('every project has a born date', () => {
    for (const project of projects) {
      expect(project.born).toMatch(ISO);
    }
  });

  it('keeps no legacy date fields', () => {
    for (const project of projects) {
      for (const key of legacy) {
        expect(key in project).toBe(false);
      }
    }
  });

  it('died is absent or a valid date on or after born', () => {
    for (const project of projects) {
      if (project.died === undefined) continue;
      expect(project.died).toMatch(ISO);
      expect(project.died >= project.born).toBe(true);
    }
  });

  it('keeps all 42 projects', () => {
    expect(projects).toHaveLength(42);
  });
});

describe('getFeaturedProjects', () => {
  it('never returns active projects (#14)', () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThan(0);
    for (const project of featured) {
      expect(project.featured).toBe(true);
      expect(project.phase).not.toBe('active');
    }
  });

  it('returns every featured non-active project in data order', () => {
    const expected = projects
      .filter((p) => p.featured && p.phase !== 'active' && p.tier !== 'coursework')
      .map((p) => p.slug);
    expect(getFeaturedProjects().map((p) => p.slug)).toEqual(expected);
  });
});

describe('coursework plot (#20)', () => {
  it('Featured never includes coursework', () => {
    expect(getFeaturedProjects().filter((p) => p.tier === 'coursework')).toEqual([]);
  });

  it('cards and the coursework list split every project exactly once', () => {
    const cards = getCardProjects().map((p) => p.slug);
    const coursework = getCourseworkProjects().map((p) => p.slug);
    expect(getCardProjects().every((p) => p.tier !== 'coursework')).toBe(true);
    expect(getCourseworkProjects().every((p) => p.tier === 'coursework')).toBe(true);
    expect([...cards, ...coursework].sort()).toEqual(projects.map((p) => p.slug).sort());
  });

  it('archive option helpers can be scoped to a project list', () => {
    const [one] = getCardProjects();
    const only = [{ ...one, born: '1999-01-01', category: 'mobile' as const }];
    expect(getProjectYears(only)).toEqual([1999]);
    expect(getUniqueCategories(only)).toEqual(['mobile']);
  });

  it('lists coursework newest first by born', () => {
    const born = getCourseworkProjects().map((p) => p.born);
    expect(born).toEqual([...born].sort().reverse());
  });
});

describe('tiers (#16)', () => {
  const tierValues = ['headstone', 'marker', 'coursework'] as const;

  it('every project has an explicit valid tier', () => {
    for (const project of projects) {
      expect(tierValues).toContain(project.tier);
    }
  });

  it('tier counts sum to every project', () => {
    const total = tierValues
      .map((tier) => projects.filter((p) => p.tier === tier).length)
      .reduce((sum, count) => sum + count, 0);
    expect(total).toBe(projects.length);
  });

  it('has the agreed 5 headstone / 9 coursework / 28 marker split', () => {
    expect(projects.filter((p) => p.tier === 'headstone')).toHaveLength(5);
    expect(projects.filter((p) => p.tier === 'coursework')).toHaveLength(9);
    expect(projects.filter((p) => p.tier === 'marker')).toHaveLength(28);
  });

  it('treats fcc-d3-story as exactly one headstone', () => {
    const matches = projects.filter((p) => p.slug === 'fcc-d3-story');
    expect(matches).toHaveLength(1);
    expect(matches[0].tier).toBe('headstone');
  });
});
