import { describe, expect, it } from 'vitest';
import { getFeaturedProjects, projects } from '../../src/data/projects';

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
