import { describe, expect, it } from 'vitest';
import { projectSchema, strictProjectSchema } from '../../src/data/projects';
import { makeProject } from './fixtures';

const lenient = (overrides: Parameters<typeof makeProject>[0] = {}) =>
  projectSchema.safeParse(makeProject(overrides));

const strict = (overrides: Parameters<typeof makeProject>[0] = {}) =>
  strictProjectSchema.safeParse(makeProject(overrides));

describe('structural stage rules (#39)', () => {
  it('accepts a minimal valid seed', () => {
    expect(lenient({ stage: 'seed' }).success).toBe(true);
  });

  it('rejects a sprout with died', () => {
    const result = lenient({ stage: 'sprout', died: '2024-01-02' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'died')).toBe(true);
  });

  it('rejects a sprout with causeOfDeath', () => {
    const result = lenient({ stage: 'sprout', causeOfDeath: 'abandoned' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'causeOfDeath')).toBe(true);
  });

  it('rejects a shipped project with a non-shipped cause', () => {
    const result = lenient({ stage: 'shipped', causeOfDeath: 'abandoned' });
    expect(result.success).toBe(false);
  });

  it('rejects a composted project without died', () => {
    const result = lenient({ stage: 'composted', causeOfDeath: 'course-ended' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'died')).toBe(true);
  });

  it('rejects a composted project with cause "shipped"', () => {
    const result = lenient({
      stage: 'composted',
      died: '2024-02-01',
      causeOfDeath: 'shipped',
    });
    expect(result.success).toBe(false);
  });

  it('rejects superseded without supersededBy', () => {
    const result = lenient({
      stage: 'composted',
      died: '2024-02-01',
      causeOfDeath: 'superseded',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'supersededBy')).toBe(true);
  });

  it('accepts superseded with supersededBy', () => {
    const result = lenient({
      stage: 'composted',
      died: '2024-02-01',
      causeOfDeath: 'superseded',
      supersededBy: 'test-project-v2',
    });
    expect(result.success).toBe(true);
  });

  it('rejects shipped/composted without githubUrl', () => {
    expect(lenient({ stage: 'shipped', githubUrl: undefined }).success).toBe(false);
    expect(
      lenient({ stage: 'composted', died: '2024-02-01', causeOfDeath: 'course-ended', githubUrl: undefined })
        .success,
    ).toBe(false);
  });

  it('rejects died before born', () => {
    const result = lenient({ stage: 'shipped', died: '2022-12-31', born: '2023-01-01' });
    expect(result.success).toBe(false);
  });
});

describe('strict content rules (ready for #25)', () => {
  it('rejects a composted project without causeOfDeath', () => {
    const result = strict({ stage: 'composted', died: '2024-02-01' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'causeOfDeath')).toBe(true);
  });

  it('rejects a shipped project without outcome', () => {
    const result = strict({ stage: 'shipped' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'outcome')).toBe(true);
  });

  it('accepts a shipped project with outcome', () => {
    expect(strict({ stage: 'shipped', outcome: 'Shipped a working thing.' }).success).toBe(true);
  });
});
