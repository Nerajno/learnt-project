// #29: RSS feed of burials. Retiring a project (setting `died`) publishes an item.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { projects } from '../data/projects';
import { site } from '../data/site';

export function GET(context: APIContext) {
  const buried = projects
    .filter((p) => p.died)
    .sort((a, b) => b.died!.localeCompare(a.died!));

  return rss({
    title: `Learnt · ${site.name}`,
    description: 'New burials in the proof-of-work archive: projects that shipped or were composted.',
    site: context.site!,
    items: buried.map((p) => ({
      title: p.title,
      link: `/learnt/${p.slug}/`,
      pubDate: new Date(`${p.died}T00:00:00Z`),
      description: p.epitaph ?? p.description,
      categories: [p.stage, ...(p.causeOfDeath ? [p.causeOfDeath] : [])],
    })),
  });
}
