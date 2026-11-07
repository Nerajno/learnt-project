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
      return [...text.matchAll(/#[0-9a-fA-F]{3,8}(?![\w-])/g)].map((m) => `${file}: ${m[0]}`);
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
    expect(config).not.toMatch(/["']?primary["']?\s*:/);
  });
});

// ---------------------------------------------------------------------------
// Contrast: the spine guarantees every text token and the accent reach 4.5:1
// on all three grounds, and --border-strong reaches 3:1, in both themes.

function evalCalc(value: string): string {
  return value.replace(/calc\(([^()]+)\)/g, (_, inner: string) => {
    const match = inner.match(/^\s*([\d.]+)\s*([+*-])\s*([\d.]+)\s*$/);
    if (!match) throw new Error(`Unsupported calc: ${inner}`);
    const a = Number(match[1]);
    const b = Number(match[3]);
    const result = match[2] === '+' ? a + b : match[2] === '*' ? a * b : a - b;
    return String(result);
  });
}

function oklchToSrgb(L: number, C: number, hDeg: number): [number, number, number] {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  const red = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const green = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const blue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const toSrgb = (v: number) => {
    const x = Math.max(0, Math.min(1, v));
    return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
  };
  return [toSrgb(red), toSrgb(green), toSrgb(blue)];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: [number, number, number], b: [number, number, number]): number {
  const [high, low] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

describe('learn token contrast', () => {
  const css = readFileSync(
    new URL('../node_modules/@nerajno/dialects/tokens.css', import.meta.url),
    'utf8',
  );
  const learnBlock = css.match(/:root\[data-surface="learn"\]\s*\{([^}]*)\}/)?.[1];
  if (!learnBlock) throw new Error('learn surface block not found');
  const dial = (name: string) =>
    Number(new RegExp(`--dial-${name}:\\s*([\\d.]+)`).exec(learnBlock)?.[1]);

  const blocks = (selector: RegExp) =>
    [...css.matchAll(selector)]
      .map((match) => match[1])
      .filter((block) => block.includes('--bg:'));

  const lightBlock = blocks(/:root\s*\{([^}]*)\}/g)[0];
  const darkBlock = blocks(/\.dark\s*\{([^}]*)\}/g)[0];
  if (!lightBlock || !darkBlock) throw new Error('light/dark token blocks not found');

  const resolve = (value: string) =>
    evalCalc(
      value
        .replace(/var\(--dial-accent-hue\)/g, String(dial('accent-hue')))
        .replace(/var\(--dial-accent-chroma\)/g, String(dial('accent-chroma')))
        .replace(/var\(--dial-accent-light\)/g, String(dial('accent-light'))),
    );

  const tokensIn = (block: string) =>
    Object.fromEntries(
      [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
    );

  const color = (value: string): [number, number, number] => {
    const resolved = resolve(value);
    const match = /oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/.exec(resolved);
    if (!match) throw new Error(`Unsupported colour value: ${value}`);
    return oklchToSrgb(Number(match[1]), Number(match[2]), Number(match[3]));
  };

  for (const [mode, block] of [
    ['light', lightBlock],
    ['dark', darkBlock],
  ] as const) {
    const tokens = tokensIn(block);
    const grounds = ['bg', 'bg-alt', 'bg-card'] as const;
    const texts = ['text-strong', 'text-body', 'text-soft', 'text-muted', 'accent'] as const;

    for (const ground of grounds) {
      for (const text of texts) {
        it(`${mode}: --${text} reaches 4.5:1 on --${ground}`, () => {
          expect(contrast(color(tokens[text]), color(tokens[ground]))).toBeGreaterThanOrEqual(4.5);
        });
      }

      it(`${mode}: --border-strong reaches 3:1 on --${ground}`, () => {
        expect(contrast(color(tokens['border-strong']), color(tokens[ground]))).toBeGreaterThanOrEqual(3);
      });
    }
  }
});
