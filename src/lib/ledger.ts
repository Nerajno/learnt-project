// Garden ledger helpers (#32): headstones, how a project ended, and how much
// proof-of-work evidence it carries. Pure functions; callers pass the data.
import type { CauseOfDeath, Project } from '../data/projects';

/** Finished headstones (shipped or composted), most recently ended first. */
export function getHeadstones(all: Project[], n = 3): Project[] {
  return all
    .filter((p) => p.tier === 'headstone' && (p.stage === 'shipped' || p.stage === 'composted'))
    .sort((a, b) => (b.died ?? b.born).localeCompare(a.died ?? a.born))
    .slice(0, n);
}

export type Ending =
  | { kind: 'living' }
  | { kind: 'shipped' }
  | { kind: 'successor'; verb: 'superseded by' | 'merged into'; slug: string }
  | { kind: 'cause'; label: string }
  | { kind: 'missing' };

const CAUSE_LABEL: Record<Exclude<CauseOfDeath, 'superseded' | 'merged-into'>, string> = {
  shipped: 'shipped',
  'outgrew-stack': 'outgrew the stack',
  'course-ended': 'course ended',
  abandoned: 'abandoned',
};

/**
 * How a project ended. A composted project with no `causeOfDeath` is reported
 * as `missing` so the gap stays visible instead of being quietly filled in.
 */
export function getEnding(project: Project): Ending {
  if (project.stage === 'seed' || project.stage === 'sprout') return { kind: 'living' };
  const cause = project.causeOfDeath;
  if ((cause === 'superseded' || cause === 'merged-into') && project.supersededBy) {
    return {
      kind: 'successor',
      verb: cause === 'superseded' ? 'superseded by' : 'merged into',
      slug: project.supersededBy,
    };
  }
  if (project.stage === 'shipped' && (!cause || cause === 'shipped')) return { kind: 'shipped' };
  if (cause && cause !== 'superseded' && cause !== 'merged-into') {
    return { kind: 'cause', label: CAUSE_LABEL[cause] };
  }
  return { kind: 'missing' };
}

export interface Evidence {
  filled: string[];
  missing: string[];
  total: number;
  percent: number;
}

/**
 * Proof-of-work evidence (VWC §3, plus the §4 deep dive for headstones).
 * Counts only fields that are actually set; nothing is estimated.
 */
export function getEvidence(project: Project): Evidence {
  const proof = project.proof ?? {};
  const fields: [string, boolean][] = [
    ['Repo', Boolean(project.githubUrl)],
    ['Demo', Boolean(project.liveUrl || project.demoVideo)],
    ['Outcome', Boolean(project.outcome)],
    ['Impact', Boolean(project.impact)],
    ['Epitaph', Boolean(project.epitaph)],
    ['Tests', Boolean(proof.tests)],
    ['CI', proof.ci !== undefined],
    ['Last deploy', Boolean(proof.lastDeploy)],
    ['Lighthouse', proof.lighthouse !== undefined],
  ];
  if (project.tier === 'headstone') fields.push(['Deep dive', Boolean(project.deepDive)]);

  const filled = fields.filter(([, ok]) => ok).map(([label]) => label);
  const missing = fields.filter(([, ok]) => !ok).map(([label]) => label);
  const total = fields.length;
  return { filled, missing, total, percent: Math.round((filled.length / total) * 100) };
}
