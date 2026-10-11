import { describe, expect, it } from 'vitest';
import { getFeaturedProjects, projects } from '../../src/data/projects';

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
