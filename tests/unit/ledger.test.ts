import { describe, expect, it } from 'vitest';
import { getEnding, getEvidence, getHeadstones } from '../../src/lib/ledger';
import { makeProject } from './fixtures';

// #32 Garden ledger helpers.
describe('getHeadstones', () => {
  it('keeps finished headstones only, most recently ended first', () => {
    const list = [
      makeProject({ slug: 'old', tier: 'headstone', stage: 'shipped', died: '2023-06-08' }),
      makeProject({ slug: 'marker', tier: 'marker', stage: 'shipped', died: '2025-01-01' }),
      makeProject({ slug: 'new', tier: 'headstone', stage: 'composted', died: '2025-08-11' }),
      makeProject({ slug: 'growing', tier: 'headstone', stage: 'sprout' }),
      makeProject({ slug: 'mid', tier: 'headstone', stage: 'shipped', died: '2024-08-02' }),
    ];
    expect(getHeadstones(list).map((p) => p.slug)).toEqual(['new', 'mid', 'old']);
    expect(getHeadstones(list, 1).map((p) => p.slug)).toEqual(['new']);
  });

  it('is empty when there are none', () => {
    expect(getHeadstones([makeProject()])).toEqual([]);
  });
});

describe('getEnding', () => {
  it('living projects have no ending', () => {
    expect(getEnding(makeProject({ stage: 'sprout' }))).toEqual({ kind: 'living' });
    expect(getEnding(makeProject({ stage: 'seed' }))).toEqual({ kind: 'living' });
  });

  it('shipped reads as shipped, with or without the shipped cause', () => {
    expect(getEnding(makeProject({ stage: 'shipped' }))).toEqual({ kind: 'shipped' });
    expect(getEnding(makeProject({ stage: 'shipped', causeOfDeath: 'shipped' }))).toEqual({ kind: 'shipped' });
  });

  it('names the successor for superseded and merged-into', () => {
    expect(getEnding(makeProject({ stage: 'composted', causeOfDeath: 'superseded', supersededBy: 'v3' })))
      .toEqual({ kind: 'successor', verb: 'superseded by', slug: 'v3' });
    expect(getEnding(makeProject({ stage: 'composted', causeOfDeath: 'merged-into', supersededBy: 'big' })))
      .toEqual({ kind: 'successor', verb: 'merged into', slug: 'big' });
  });

  it('turns other causes into readable labels', () => {
    expect(getEnding(makeProject({ stage: 'composted', causeOfDeath: 'outgrew-stack' })))
      .toEqual({ kind: 'cause', label: 'outgrew the stack' });
    expect(getEnding(makeProject({ stage: 'composted', causeOfDeath: 'abandoned' })))
      .toEqual({ kind: 'cause', label: 'abandoned' });
  });

  it('reports a composted project with no cause as missing, never guessed', () => {
    expect(getEnding(makeProject({ stage: 'composted', died: '2025-01-01' }))).toEqual({ kind: 'missing' });
  });
});

describe('getEvidence', () => {
  it('counts nine fields for a marker and only what is set', () => {
    const e = getEvidence(makeProject({ outcome: 'Did it.', proof: { tests: '12 passing', ci: false } }));
    expect(e.total).toBe(9);
    expect(e.filled).toEqual(['Repo', 'Outcome', 'Tests', 'CI']);
    expect(e.missing).toEqual(['Demo', 'Impact', 'Epitaph', 'Last deploy', 'Lighthouse']);
    expect(e.percent).toBe(44);
  });

  it('adds the deep dive for headstones', () => {
    const e = getEvidence(makeProject({ tier: 'headstone' }));
    expect(e.total).toBe(10);
    expect(e.missing).toContain('Deep dive');
  });

  it('counts a Lighthouse score of 0 as set', () => {
    expect(getEvidence(makeProject({ proof: { lighthouse: 0 } })).filled).toContain('Lighthouse');
  });

  it('accepts a demo video in place of a live URL', () => {
    expect(getEvidence(makeProject({ demoVideo: 'https://youtu.be/x' })).filled).toContain('Demo');
  });
});
