import { describe, expect, it } from 'vitest';
import { projects, strictProjectSchema } from '../../src/data/projects';

// #25: every project carries the triage fields the strict schema requires.
describe('#25 triage applied', () => {
  it.each(projects.map((p) => [p.slug, p] as const))('%s passes the strict schema', (_slug, project) => {
    const result = strictProjectSchema.safeParse(project);
    expect(result.success ? [] : result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)).toEqual([]);
  });

  it('every project has an epitaph', () => {
    expect(projects.filter((p) => !p.epitaph).map((p) => p.slug)).toEqual([]);
  });

  it('headstones and markers have an impact line', () => {
    expect(projects.filter((p) => p.tier !== 'coursework' && !p.impact).map((p) => p.slug)).toEqual([]);
  });

  it('supersededBy points at an existing project that started after this one', () => {
    for (const p of projects.filter((x) => x.supersededBy)) {
      const next = projects.find((x) => x.slug === p.supersededBy);
      expect(next, `${p.slug} → ${p.supersededBy}`).toBeDefined();
      expect(next!.born >= p.born, `${p.slug} → ${p.supersededBy}`).toBe(true);
    }
  });
});
