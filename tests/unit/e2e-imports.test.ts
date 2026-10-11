import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Specs must use the shared fixture, which blocks analytics hosts.
const dir = new URL('../e2e/', import.meta.url);
const specs = readdirSync(dir).filter((f) => f.endsWith('.spec.ts'));

describe('e2e specs', () => {
  it('exist', () => {
    expect(specs.length).toBeGreaterThan(0);
  });

  for (const file of specs) {
    it(`${file} imports test from ./test`, () => {
      const src = readFileSync(new URL(file, dir), 'utf8');
      expect(src).not.toMatch(/from ['"]@playwright\/test['"]/);
      expect(src).toMatch(/from ['"]\.\/test['"]/);
    });
  }
});
