// #21 timeline: projects grouped by the year they ended. Server-only (imports the data).
import { getCardProjects, type Project } from '../data/projects';

export interface TimelineYear {
  year: number;
  projects: Project[];
}

const isFinished = (p: Project) => (p.stage === 'shipped' || p.stage === 'composted') && Boolean(p.died);

/** The date a project is placed by: when it ended if finished, else when it started. */
const endDate = (p: Project): string => (isFinished(p) ? p.died! : p.born);

export const endYear = (p: Project): number => Number(endDate(p).slice(0, 4));

/** Years newest first; within a year, newest end date first, then title. */
export function getTimeline(all: Project[] = getCardProjects()): TimelineYear[] {
  const sorted = [...all].sort(
    (a, b) => endDate(b).localeCompare(endDate(a)) || a.title.localeCompare(b.title),
  );
  const years = new Map<number, Project[]>();
  for (const p of sorted) {
    const year = endYear(p);
    years.set(year, [...(years.get(year) ?? []), p]);
  }
  return [...years].map(([year, projects]) => ({ year, projects }));
}
