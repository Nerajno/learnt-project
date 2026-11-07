import { describe, expect, it } from 'vitest';
import { projectJsonLd, serializeJsonLd } from '../src/lib/jsonld';
import { projects } from '../src/data/projects';

describe('jsonld (#28)', () => {
  it('escapes "<" so data cannot close the script tag', () => {
    const out = serializeJsonLd({ name: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</script>');
    expect(JSON.parse(out).name).toBe('</script><script>alert(1)</script>');
  });

  it('falls back to CreativeWork without a repo', () => {
    const { githubUrl: _omit, ...noRepo } = projects[0];
    const node = projectJsonLd(noRepo, new URL('https://example.com/p/'), new URL('https://example.com/i.png'));
    expect(node['@type']).toBe('CreativeWork');
    expect(node).not.toHaveProperty('codeRepository');
  });
});
