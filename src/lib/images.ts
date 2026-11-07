import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';

const PUBLIC_DIR = join(process.cwd(), 'public');

/** True when `pathname` points at a real file inside `public/`. Build-time only. */
export function publicFileExists(pathname?: string): boolean {
  if (!pathname) return false;
  const clean = pathname.split('?')[0].split('#')[0].replace(/^\//, '');
  if (!clean) return false;
  const full = resolve(PUBLIC_DIR, clean);
  if (!full.startsWith(PUBLIC_DIR + sep)) return false;
  if (!existsSync(full) || !statSync(full).isFile()) return false;
  // macOS is case-insensitive; Linux hosting is not. Verify every path segment
  // matches the on-disk entry exactly, directories included.
  const segments = full.slice(PUBLIC_DIR.length + sep.length).split(sep);
  let current = PUBLIC_DIR;
  for (const segment of segments) {
    if (!readdirSync(current).includes(segment)) return false;
    current = join(current, segment);
  }
  return true;
}

/** `https://github.com/Nerajno/foo` -> `Nerajno/foo`; otherwise the slug. */
export function repoLabel(githubUrl: string | undefined, slug: string): string {
  if (!githubUrl) return slug;
  try {
    const parts = new URL(githubUrl).pathname.split('/').filter(Boolean);
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : slug;
  } catch {
    return slug;
  }
}
