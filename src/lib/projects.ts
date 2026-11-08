import { projects, type CauseOfDeath, type Project, type Tier } from '../data/projects';
import type { Stage } from './stages';

import { daysBetween } from './dates';

export { daysBetween } from './dates';

/**
 * Days from born to died. Only living projects (seed, sprout) count to today;
 * a finished project without `died` has no measurable lifespan, so it is 0
 * rather than a number that keeps growing.
 */
export function getLifespan(
  project: Pick<Project, 'born' | 'died' | 'stage'>,
  now: Date = new Date(),
): number {
  if (project.died) return daysBetween(project.born, project.died) ?? 0;
  if (project.stage === 'seed' || project.stage === 'sprout') {
    return daysBetween(project.born, now.toISOString().slice(0, 10)) ?? 0;
  }
  return 0;
}

export interface Lineage {
  predecessors: Project[]; // older projects this one supersedes, oldest first
  successors: Project[]; // newer projects that supersede this one, nearest first
}

/** Walk `supersededBy` in both directions with a cycle guard. */
export function getLineage(project: Project, all: Project[] = projects): Lineage {
  const bySlug = new Map(all.map((entry) => [entry.slug, entry]));

  const successors: Project[] = [];
  const seenSuccessors = new Set([project.slug]);
  let cursor: Project | undefined = project;

  while (cursor?.supersededBy) {
    const next = bySlug.get(cursor.supersededBy);
    if (!next || seenSuccessors.has(next.slug)) break;
    seenSuccessors.add(next.slug);
    successors.push(next);
    cursor = next;
  }

  const predecessors: Project[] = [];
  const seenPredecessors = new Set([project.slug]);
  let current: Project | undefined = project;

  while (current) {
    const previous = all.find(
      (entry) => entry.supersededBy === current!.slug && !seenPredecessors.has(entry.slug),
    );
    if (!previous) break;
    seenPredecessors.add(previous.slug);
    predecessors.unshift(previous);
    current = previous;
  }

  return { predecessors, successors };
}

export interface ProjectStats {
  total: number;
  byStage: Record<Stage, number>;
  byTier: Record<Tier, number>;
  byCause: Record<CauseOfDeath, number>;
}

export function getStats(all: Project[] = projects): ProjectStats {
  const byStage: Record<Stage, number> = { seed: 0, sprout: 0, shipped: 0, composted: 0 };
  const byTier: Record<Tier, number> = { headstone: 0, marker: 0, coursework: 0 };
  const byCause: Record<CauseOfDeath, number> = {
    shipped: 0,
    superseded: 0,
    'outgrew-stack': 0,
    'course-ended': 0,
    abandoned: 0,
    'merged-into': 0,
  };

  for (const project of all) {
    byStage[project.stage] += 1;
    byTier[project.tier] += 1;
    if (project.causeOfDeath) byCause[project.causeOfDeath] += 1;
  }

  return { total: all.length, byStage, byTier, byCause };
}

export interface YearStats {
  year: number;
  total: number;
  byStage: Record<Stage, number>;
}

export function getByYear(all: Project[] = projects): YearStats[] {
  const years = new Map<number, Record<Stage, number>>();

  for (const project of all) {
    const year = Number(project.born.slice(0, 4));
    if (!Number.isInteger(year)) continue;
    const counts = years.get(year) ?? { seed: 0, sprout: 0, shipped: 0, composted: 0 };
    counts[project.stage] += 1;
    years.set(year, counts);
  }

  return [...years.entries()]
    .map(([year, byStage]) => ({
      year,
      total: Object.values(byStage).reduce((sum, count) => sum + count, 0),
      byStage,
    }))
    .sort((a, b) => b.year - a.year);
}
