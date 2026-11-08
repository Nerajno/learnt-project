import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// #39 review: src/lib/archive.ts ships to the browser via archive-filter.ts.
// A runtime import of the project data pulls all 42 projects (and zod) into
// that bundle, so only type imports of it are allowed.
const source = readFileSync(fileURLToPath(new URL('../src/lib/archive.ts', import.meta.url)), 'utf8');

describe('archive client bundle', () => {
  it('has no runtime import of project data modules', () => {
    const runtimeImports = [...source.matchAll(/^import\s+(?!type\b)[^;]*?from\s+['"]([^'"]+)['"]/gm)].map((m) => m[1]);
    expect(runtimeImports.filter((from) => /(^|\/)projects$/.test(from))).toEqual([]);
  });
});
