export type Stage = 'seed' | 'sprout' | 'shipped' | 'composted';

export interface StageMeta {
  value: Stage;
  label: string;
  definition: string;
  icon: string;
}

export const STAGES: readonly StageMeta[] = [
  { value: 'seed', label: 'Seed', definition: 'Planned, not started', icon: '○' },
  { value: 'sprout', label: 'Sprout', definition: 'In progress', icon: '◐' },
  { value: 'shipped', label: 'Shipped', definition: 'Finished and working', icon: '●' },
  { value: 'composted', label: 'Composted', definition: 'Ended; lessons kept', icon: '✕' },
];

export const STAGE_VALUES = new Set<Stage>(STAGES.map((stage) => stage.value));
