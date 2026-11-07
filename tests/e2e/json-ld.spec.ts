import { readFileSync } from 'node:fs';
import { test, expect } from './test';

// #28: structured data per project, plus Person + WebSite on the home page.
const slugs: string[] = JSON.parse(
  readFileSync(new URL('./fixtures/slugs.json', import.meta.url), 'utf8'),
);

type Node = Record<string, any>;

async function jsonLd(request: import('@playwright/test').APIRequestContext, path: string) {
  const html = await (await request.get(path)).text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  const nodes: Node[] = blocks.flatMap((m) => {
    const parsed = JSON.parse(m[1]);
    return Array.isArray(parsed) ? parsed : [parsed];
  });
  return { html, blocks: blocks.length, nodes };
}

test.describe('JSON-LD (#28)', () => {
  test.beforeEach(() => {
    test.skip(test.info().project.name !== 'desktop', 'static HTML check; one viewport is enough');
  });

  test('every detail page has one SoftwareSourceCode block with real metadata', async ({ request }) => {
    for (const slug of slugs) {
      const { html, blocks, nodes } = await jsonLd(request, `/learnt/${slug}/`);
      expect(blocks, `${slug} JSON-LD block count`).toBe(1);
      expect(html, `${slug} placeholder author`).not.toContain('Your Name');

      const node = nodes[0];
      expect(node['@context']).toBe('https://schema.org');
      expect(node['@type'], slug).toBe('SoftwareSourceCode');
      expect(node.name, slug).toBeTruthy();
      expect(node.dateCreated, slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(node.author, slug).toMatchObject({ '@type': 'Person', name: 'Nerando Johnson' });
      expect(node.codeRepository, slug).toMatch(/^https:\/\/github\.com\//);
      expect(node.keywords, slug).toBeTruthy();
      expect(node.url, slug).toBe(`https://learnt.developingdvlpr.com/learnt/${slug}/`);
    }
  });

  test('home page has Person and WebSite', async ({ request }) => {
    const { nodes } = await jsonLd(request, '/');
    const person = nodes.find((n) => n['@type'] === 'Person');
    const website = nodes.find((n) => n['@type'] === 'WebSite');

    expect(person).toMatchObject({ '@context': 'https://schema.org', name: 'Nerando Johnson' });
    expect(person?.sameAs).toEqual(
      expect.arrayContaining([
        'https://github.com/Nerajno',
        'https://www.linkedin.com/in/nerando-johnson/',
        'https://x.com/nerajno',
      ]),
    );
    expect(website).toMatchObject({
      '@context': 'https://schema.org',
      url: 'https://learnt.developingdvlpr.com/',
    });
    expect(website?.name).toBeTruthy();
  });
});
