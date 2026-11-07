import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = new URL('../src/', import.meta.url).pathname;

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const files = walk(SRC).filter((f) => /\.(astro|css|ts)$/.test(f));

describe('token adoption', () => {
  it('has no raw hex colours under src', () => {
    const hits = files.flatMap((file) => {
      const text = readFileSync(file, 'utf8');
      return [...text.matchAll(/#[0-9a-fA-F]{3,6}\b/g)].map((m) => `${file}: ${m[0]}`);
    });
    expect(hits).toEqual([]);
  });

  it('has no primary-* utilities under src', () => {
    const hits = files.flatMap((file) => {
      const text = readFileSync(file, 'utf8');
      return text.includes('primary-') ? [file] : [];
    });
    expect(hits).toEqual([]);
  });

  it('removes the safelist and the blue scale from Tailwind', () => {
    const config = readFileSync(new URL('../tailwind.config.mjs', import.meta.url), 'utf8');
    expect(config).not.toContain('safelist');
    expect(config).not.toMatch(/\bprimary\s*:/);
  });
});
