// #47: sitemap, built from the routes and the project data. No extra dependency.
import type { APIContext } from 'astro';
import { projects } from '../data/projects';

const PAGES = ['/', '/learnt/', '/about/', '/contact/'];

export function GET(context: APIContext) {
  const base = context.site ?? new URL(context.url.origin);
  const urls = [...PAGES, ...projects.map((p) => `/learnt/${p.slug}/`)].map(
    (path) => `  <url><loc>${new URL(path, base).href}</loc></url>`,
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
