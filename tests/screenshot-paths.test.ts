import { describe, it, expect } from 'vitest';
import { projects } from '../src/data/projects';
import { publicFileExists } from '../src/lib/images';

describe('project screenshots', () => {
  it('every declared screenshot resolves to a real file', () => {
    const missing = projects
      .filter((p) => p.screenshot && !publicFileExists(p.screenshot))
      .map((p) => `${p.slug}: ${p.screenshot}`);
    expect(missing).toEqual([]);
  });

  it('every gallery image resolves to a real file', () => {
    const missing = projects.flatMap((p) =>
      (p.gallery ?? [])
        .filter((src) => !publicFileExists(src))
        .map((src) => `${p.slug}: ${src}`)
    );
    expect(missing).toEqual([]);
  });
});
