import { describe, expect, it } from 'vitest';
import { STAGES, STAGE_VALUES } from '../../src/lib/stages';

describe('stage vocabulary (#39)', () => {
  it('defines exactly the four stages in lifecycle order', () => {
    expect(STAGES.map((stage) => stage.value)).toEqual(['seed', 'sprout', 'shipped', 'composted']);
    expect([...STAGE_VALUES]).toEqual(['seed', 'sprout', 'shipped', 'composted']);
  });

  it('labels every stage', () => {
    for (const stage of STAGES) {
      expect(stage.label.trim().length).toBeGreaterThan(0);
    }
  });

  it('defines a one-line definition for every stage', () => {
    for (const stage of STAGES) {
      expect(stage.definition.trim().length).toBeGreaterThan(0);
    }
  });
});
