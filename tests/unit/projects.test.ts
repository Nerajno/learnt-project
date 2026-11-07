import { describe, expect, it } from 'vitest';
import {
  getFeaturedProjects,
  getProjectYears,
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
      .filter((p) => p.featured && p.phase !== 'active')
      .map((p) => p.slug);
    expect(getFeaturedProjects().map((p) => p.slug)).toEqual(expected);
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

  it('has three to five headstones', () => {
    const headstones = projects.filter((p) => p.tier === 'headstone').length;
    expect(headstones).toBeGreaterThanOrEqual(3);
    expect(headstones).toBeLessThanOrEqual(5);
  });
});
