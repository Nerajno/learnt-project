import { describe, it, expect } from 'vitest';
import { publicFileExists, repoLabel } from '../src/lib/images';

describe('publicFileExists', () => {
  it('returns true for an existing public asset', () => {
    expect(publicFileExists('/images/placeholder.png')).toBe(true);
  });

  it('returns false for a missing screenshot', () => {
    expect(publicFileExists('/images/screenshots/does-not-exist.png')).toBe(false);
  });

  it('returns false for undefined or empty input', () => {
    expect(publicFileExists(undefined)).toBe(false);
    expect(publicFileExists('')).toBe(false);
  });

  it('ignores query strings and hashes', () => {
    expect(publicFileExists('/images/placeholder.png?v=2#top')).toBe(true);
  });

  it('returns false for a directory', () => {
    expect(publicFileExists('/images')).toBe(false);
  });

  it('rejects a path whose case does not match the file on disk', () => {
    expect(publicFileExists('/images/PLACEHOLDER.png')).toBe(false);
    expect(publicFileExists('/Images/placeholder.png')).toBe(false);
  });

  it('never escapes the public directory', () => {
    expect(publicFileExists('../package.json')).toBe(false);
    expect(publicFileExists('/../package.json')).toBe(false);
    expect(publicFileExists('images/../package.json')).toBe(false);
  });
});

describe('repoLabel', () => {
  it('returns owner/repo from a GitHub URL', () => {
    expect(repoLabel('https://github.com/Nerajno/learnt-project', 'x')).toBe('Nerajno/learnt-project');
  });

  it('falls back to the slug', () => {
    expect(repoLabel(undefined, 'trumma-drum-machine')).toBe('trumma-drum-machine');
  });
});
