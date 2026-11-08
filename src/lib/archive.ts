import { STAGES } from './stages';
import type { Stage } from './stages';
import { daysBetween } from './projects';
import type { Project } from '../data/projects';

export { STAGES } from './stages';
export type { Stage } from './stages';

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

export function toArchiveItem(project: Project): ArchiveItem {
  const born = project.born;
  const died = project.died ?? '';
  const yearMatch = /^(\d{4})/.exec(born);
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
    stage: project.stage,
    year: yearMatch ? Number(yearMatch[1]) : null,
    born,
    died,
    search,
  };
}

/** Whole days from born to died; `null` when either date is missing. */
export function lifespanDays(item: ArchiveItem): number | null {
  return daysBetween(item.born, item.died);
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

export function matchesFilters(item: ArchiveItem, filters: ArchiveFilters): boolean {
  const q = filters.q.trim().toLowerCase();
  if (q && !item.search.includes(q)) return false;
  if (filters.stage && item.stage !== filters.stage) return false;
  if (filters.category && item.category !== filters.category) return false;
  if (filters.year !== null && item.year !== filters.year) return false;
  return true;
}

function byTitle(a: ArchiveItem, b: ArchiveItem): number {
  return a.title.localeCompare(b.title);
}

export function sortProjects(items: ArchiveItem[], sort: Sort): ArchiveItem[] {
  const copy = [...items];
  copy.sort((a, b) => {
    let primary = 0;

    if (sort === 'newest') {
      primary = a.born < b.born ? 1 : a.born > b.born ? -1 : 0;
    } else if (sort === 'oldest') {
      primary = a.born < b.born ? -1 : a.born > b.born ? 1 : 0;
    } else {
      const aDays = lifespanDays(a);
      const bDays = lifespanDays(b);
      if (aDays === null && bDays === null) primary = 0;
      else if (aDays === null) primary = 1;
      else if (bDays === null) primary = -1;
      else primary = sort === 'longest' ? bDays - aDays : aDays - bDays;
    }

    return primary || byTitle(a, b);
  });
  return copy;
}

export function filterProjects(items: ArchiveItem[], filters: ArchiveFilters): ArchiveItem[] {
  return sortProjects(
    items.filter((item) => matchesFilters(item, filters)),
    filters.sort,
  );
}

export function countByStage(items: ArchiveItem[]): Record<Stage, number> {
  const counts: Record<Stage, number> = { seed: 0, sprout: 0, shipped: 0, composted: 0 };
  for (const item of items) counts[item.stage] += 1;
  return counts;
}
