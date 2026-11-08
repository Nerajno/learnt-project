// Home page selectors (#45). Server-only: imports the project data.
import { projects, type Project } from '../data/projects';
import { getLifespan, type YearStats } from './projects';
import type { Stage } from './stages';

export const monthYear = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

/** The `n` most recently composted projects, newest `died` first. */
export function getRecentlyComposted(all: Project[] = projects, n = 3): Project[] {
  return all
    .filter((p) => p.stage === 'composted' && p.died)
    .sort((a, b) => b.died!.localeCompare(a.died!))
    .slice(0, n);
}

/** Sprout projects, newest `born` first. */
export function getStillGrowing(all: Project[] = projects): Project[] {
  return all.filter((p) => p.stage === 'sprout').sort((a, b) => b.born.localeCompare(a.born));
}

// Bar segments run in lifecycle order: how the year ended up, then what's still alive.
export const SEGMENT_ORDER: readonly Stage[] = ['shipped', 'composted', 'sprout', 'seed'];

export interface YearSegment {
  stage: Stage;
  count: number;
  width: number; // percent of the busiest year's total
}

export interface YearBar extends YearStats {
  width: number; // percent of the busiest year
  segments: YearSegment[];
  href: string;
}

export function toYearBars(years: YearStats[]): YearBar[] {
  const max = Math.max(0, ...years.map((y) => y.total));
  const pct = (n: number) => (max ? Math.round((n / max) * 100) : 0);
  return years.map((y) => ({
    ...y,
    width: pct(y.total),
    segments: SEGMENT_ORDER.filter((stage) => y.byStage[stage] > 0).map((stage) => ({
      stage,
      count: y.byStage[stage],
      width: pct(y.byStage[stage]),
    })),
    href: `/learnt?year=${y.year}`,
  }));
}

/** Earliest `born` year; the current year when there's nothing logged yet. */
export function firstYear(all: Project[] = projects, now: Date = new Date()): number {
  if (all.length === 0) return now.getUTCFullYear();
  return Math.min(...all.map((p) => Number(p.born.slice(0, 4))));
}

/** "Composted {Mon YYYY} · {epitaph} · It was N days old." (epitaph optional) */
export function compostLine(project: Project): string {
  const parts = [`Composted ${monthYear(project.died!)}`];
  if (project.epitaph) parts.push(project.epitaph);
  parts.push(`It was ${getLifespan(project)} days old.`);
  return parts.join(' · ');
}
