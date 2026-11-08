// Detail-page selectors (#46). Server-only: imports the project data.
import { projects, type Project } from '../data/projects';

/** Up to `n` projects sharing the most technologies; ties keep collection order. */
export function getRelated(project: Project, all: Project[] = projects, n = 3): Project[] {
  const mine = new Set(project.technologies.map((t) => t.toLowerCase()));
  return all
    .filter((p) => p.slug !== project.slug)
    .map((p) => ({ p, shared: p.technologies.filter((t) => mine.has(t.toLowerCase())).length }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, n)
    .map(({ p }) => p);
}

/** Previous and next project in collection order. */
export function getNeighbours(project: Project, all: Project[] = projects) {
  const i = all.findIndex((p) => p.slug === project.slug);
  return { prev: i > 0 ? all[i - 1] : undefined, next: i >= 0 ? all[i + 1] : undefined };
}
