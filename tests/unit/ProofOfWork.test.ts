import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ProofOfWork from '../../src/components/project/ProofOfWork.astro';
import { makeProject } from './fixtures';

let container: AstroContainer;
beforeAll(async () => { container = await AstroContainer.create(); });
const text = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('ProofOfWork (#46 Task 4)', () => {
  it('shows outcome, impact, epitaph, repo, demo and only the proof keys that are set', async () => {
    const html = await container.renderToString(ProofOfWork, {
      props: {
        project: makeProject({
          outcome: 'Did the thing.', impact: 'Helped people.', epitaph: 'Taught me X.',
          liveUrl: 'https://demo.example', proof: { tests: '42 passing', ci: true },
        }),
      },
    });
    const t = text(html);
    expect(html).toMatch(/<h2[^>]*>\s*Proof of work\s*<\/h2>/);
    for (const s of ['Did the thing.', 'Helped people.', 'Taught me X.', '42 passing']) expect(t).toContain(s);
    expect(html).toContain('href="https://github.com/Nerajno/test-project"');
    expect(html).toContain('href="https://demo.example"');
    expect(t).toMatch(/CI\b/);
    expect(t).not.toMatch(/Lighthouse|Last deploy/);
  });

  it('prefers the demo video when there is no live demo', async () => {
    const html = await container.renderToString(ProofOfWork, {
      props: { project: makeProject({ demoVideo: 'https://youtu.be/x' }) },
    });
    expect(html).toContain('href="https://youtu.be/x"');
    expect(text(html)).toContain('Demo video');
  });

  it('hides rows that have no data and never invents a metric', async () => {
    const html = await container.renderToString(ProofOfWork, { props: { project: makeProject() } });
    const t = text(html);
    expect(t).not.toMatch(/Outcome|Impact|Epitaph|Tests|Lighthouse|Last deploy|\bCI\b/);
    expect(html).toContain('href="https://github.com/Nerajno/test-project"');
  });

  it('renders nothing when there is no evidence at all', async () => {
    const html = await container.renderToString(ProofOfWork, { props: { project: makeProject({ githubUrl: undefined }) } });
    expect(html.trim()).toBe('');
  });
});
