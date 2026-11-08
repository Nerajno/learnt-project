import { describe, expect, it } from 'vitest';
import { STAGES, STAGE_LABELS, STAGE_VALUES, stageLabel } from '../../src/lib/stages';

describe('stage vocabulary (#39)', () => {
  it('defines exactly the four stages in lifecycle order', () => {
    expect(STAGES.map((stage) => stage.value)).toEqual(['seed', 'sprout', 'shipped', 'composted']);
    expect([...STAGE_VALUES]).toEqual(['seed', 'sprout', 'shipped', 'composted']);
  });

  it('labels every stage', () => {
    for (const stage of STAGES) {
      expect(stageLabel(stage.value)).toBe(stage.label);
      expect(STAGE_LABELS[stage.value]).toBe(stage.label);
    }
  });

  it('defines a one-line definition for every stage', () => {
    for (const stage of STAGES) {
      expect(stage.definition.trim().length).toBeGreaterThan(0);
    }
  });
});
