export type Stage = 'seed' | 'sprout' | 'shipped' | 'composted';
export type Sort = 'newest' | 'oldest' | 'longest' | 'shortest';

import type { Project } from '../data/projects';

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

export interface ArchiveItem {
  slug: string;
  title: string;
  category: Project['category'];
  stage: Stage;
  year: number | null;
  born: string; // ISO date or ''
  died: string; // ISO date or ''
  search: string; // lowercase searchable blob
}

/** TODO(#39): replace this bridge with the real `stage` field. */
export function deriveStage(project: Pick<Project, 'status' | 'phase'>): Stage {
  if (project.status === 'planned') return 'seed';
  if (project.status === 'in-progress') return 'sprout';
  if (project.status === 'completed') {
    return project.phase === 'sunset' ? 'composted' : 'shipped';
  }
  return 'composted';
}

function startDate(project: Project): string {
  return project.dateCreated ?? project.dateStarted ?? '';
}

function endDate(project: Project): string {
  return project.dateCompleted ?? project.sunsetDate ?? project.dateSunset ?? '';
}

export function toArchiveItem(project: Project): ArchiveItem {
  const born = startDate(project);
  const died = endDate(project);
  const parsedYear = born ? new Date(born).getFullYear() : NaN;
  const search = [
    project.title,
    project.description,
    project.longDescription,
    ...project.technologies,
    ...project.tags,
    ...project.learnings,
  ]
    .join(' ')
    .toLowerCase();

  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    stage: deriveStage(project),
    year: Number.isFinite(parsedYear) ? parsedYear : null,
    born,
    died,
    search,
  };
}

/** Whole days from born to died; `null` when either date is missing. */
export function lifespanDays(item: ArchiveItem): number | null {
  if (!item.born || !item.died) return null;
  const start = Date.parse(item.born);
  const end = Date.parse(item.died);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

export function cardDataset(item: ArchiveItem): Record<string, string> {
  return {
    'data-slug': item.slug,
    'data-title': item.title,
    'data-stage': item.stage,
    'data-category': item.category,
    'data-year': item.year === null ? '' : String(item.year),
    'data-born': item.born,
    'data-died': item.died,
    'data-search': item.search,
  };
}
