// Dependency-free date helpers. archive.ts ships to the browser, so it may
// only import from here, never from modules that load the project data.
const DAY_MS = 86_400_000;

/** Whole days between two ISO dates; `null` when either is missing or invalid. */
export function daysBetween(born: string, died: string): number | null {
  if (!born || !died) return null;
  const start = Date.parse(born);
  const end = Date.parse(died);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return Math.max(0, Math.round((end - start) / DAY_MS));
}
