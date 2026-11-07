import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PUBLIC_DIR = join(process.cwd(), 'public');

/** True when `pathname` points at a real file inside `public/`. Build-time only. */
export function publicFileExists(pathname?: string): boolean {
  if (!pathname) return false;
  const clean = pathname.split('?')[0].split('#')[0].replace(/^\//, '');
  if (!clean) return false;
  const full = join(PUBLIC_DIR, clean);
  return existsSync(full) && statSync(full).isFile();
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
