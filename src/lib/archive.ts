export type Stage = 'seed' | 'sprout' | 'shipped' | 'composted';
export type Sort = 'newest' | 'oldest' | 'longest' | 'shortest';

export interface ArchiveFilters {
  q: string;
  stage: Stage | '';
  category: string;
  year: number | null;
  sort: Sort;
}

export const DEFAULT_FILTERS: ArchiveFilters = {
  q: '',
  stage: '',
  category: '',
  year: null,
  sort: 'newest',
};

export const STAGES: ReadonlyArray<{ value: Stage; label: string }> = [
  { value: 'seed', label: 'Seed' },
  { value: 'sprout', label: 'Sprout' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'composted', label: 'Composted' },
];

export const SORTS: ReadonlyArray<{ value: Sort; label: string }> = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'longest', label: 'Longest lived' },
  { value: 'shortest', label: 'Shortest lived' },
];

const STAGE_VALUES = new Set<string>(STAGES.map((s) => s.value));
const SORT_VALUES = new Set<string>(SORTS.map((s) => s.value));

/** Parse `?q=&stage=&category=&year=&sort=`; unknown or invalid values fall back. */
export function parseFilters(search: string): ArchiveFilters {
  const params = new URLSearchParams(search);
  const rawYear = params.get('year');
  const year = rawYear && Number.isInteger(Number(rawYear)) ? Number(rawYear) : null;
  const rawStage = params.get('stage') ?? '';
  const rawSort = params.get('sort') ?? '';

  return {
    q: (params.get('q') ?? '').trim(),
    stage: STAGE_VALUES.has(rawStage) ? (rawStage as Stage) : '',
    category: (params.get('category') ?? '').trim(),
    year,
    sort: SORT_VALUES.has(rawSort) ? (rawSort as Sort) : 'newest',
  };
}

/** Serialise non-default filters in a stable order; `''` when everything is default. */
export function buildQuery(filters: ArchiveFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.stage) params.set('stage', filters.stage);
  if (filters.category) params.set('category', filters.category);
  if (filters.year !== null) params.set('year', String(filters.year));
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set('sort', filters.sort);
  const query = params.toString();
  return query ? `?${query}` : '';
}
