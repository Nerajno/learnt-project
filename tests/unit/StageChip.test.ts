import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import StageChip from '../../src/components/StageChip.astro';
import StageLegend from '../../src/components/StageLegend.astro';
import { STAGES } from '../../src/lib/stages';

// #40: one chip for every stage surface, plus a legend for Home and About.
let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

const ICONS = { seed: '○', sprout: '◐', shipped: '●', composted: '✕' } as const;
const causes = ['shipped', 'superseded', 'outgrew-stack', 'course-ended', 'abandoned', 'merged-into'] as const;

describe('StageChip', () => {
  for (const { value, label } of STAGES) {
    it(`renders ${value} with its label, data-stage and a hidden icon`, async () => {
      const html = await container.renderToString(StageChip, { props: { stage: value } });
      expect(html).toContain(`data-stage="${value}"`);
      expect(html).toMatch(new RegExp(`<span[^>]*aria-hidden="true"[^>]*>${ICONS[value]}</span>`));
      expect(html.replace(/<[^>]+>/g, '')).toContain(label);
    });
  }

  for (const cause of causes) {
    it(`shows the cause sub-label for composted · ${cause}`, async () => {
      const html = await container.renderToString(StageChip, { props: { stage: 'composted', cause } });
      expect(html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ')).toContain(`Composted · ${cause.replace(/-/g, ' ')}`);
    });
  }

  it('ignores a cause on stages other than composted', async () => {
    const html = await container.renderToString(StageChip, { props: { stage: 'shipped', cause: 'superseded' } });
    expect(html).not.toContain('superseded');
  });
});

describe('StageLegend', () => {
  it('shows all four stages with their definitions under "Four stages, no shame"', async () => {
    const html = await container.renderToString(StageLegend);
    expect(html).toContain('Four stages, no shame');
    for (const { value, definition } of STAGES) {
      expect(html).toContain(`data-stage="${value}"`);
      expect(html).toContain(definition);
    }
  });
});

describe('chip markup lives only in StageChip', () => {
  it('no .astro file uses the retired stage badge helpers or classes', () => {
    const src = fileURLToPath(new URL('../../src', import.meta.url));
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        return statSync(path).isDirectory() ? walk(path) : [path];
      });
    const offenders = walk(src)
      .filter((path) => path.endsWith('.astro') && !path.endsWith('StageChip.astro'))
      .filter((path) => /stageLabel\(|getStageClass|stageStyles|stage-(seed|sprout|shipped|composted)\b/.test(readFileSync(path, 'utf8')));
    expect(offenders.map((p) => p.slice(src.length + 1))).toEqual([]);
  });
});
