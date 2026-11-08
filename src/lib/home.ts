// Home page selectors (#45). Server-only: imports the project data.
import { projects, type Project } from '../data/projects';
import { getLifespan, type YearStats } from './projects';

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

export interface YearBar extends YearStats {
  width: number; // percent of the busiest year
  href: string;
}

export function toYearBars(years: YearStats[]): YearBar[] {
  const max = Math.max(0, ...years.map((y) => y.total));
  return years.map((y) => ({
    ...y,
    width: max ? Math.round((y.total / max) * 100) : 0,
    href: `/learnt?year=${y.year}`,
  }));
}

/** "Composted {Mon YYYY} · {epitaph} · It was N days old." (epitaph optional) */
export function compostLine(project: Project): string {
  const parts = [`Composted ${monthYear(project.died!)}`];
  if (project.epitaph) parts.push(project.epitaph);
  parts.push(`It was ${getLifespan(project)} days old.`);
  return parts.join(' · ');
}
