// schema.org structured data (#28). Layout renders whatever a page passes as `jsonLd`.
import { site } from '../data/site';
import type { Project } from '../data/projects';

export type JsonLd = Record<string, unknown>;

const author = { '@type': 'Person', name: site.name, url: site.portfolio } as const;

export function projectJsonLd(project: Project, url: URL, image: URL): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': project.githubUrl ? 'SoftwareSourceCode' : 'CreativeWork',
    name: project.title,
    description: project.description,
    url: url.toString(),
    image: image.toString(),
    dateCreated: project.born,
    ...(project.died ? { dateModified: project.died } : {}),
    author,
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
    keywords: project.tags.join(', '),
  };
}

export function homeJsonLd(siteUrl: URL): JsonLd[] {
  const { github, linkedin, x } = site.social;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: site.name,
      url: site.portfolio,
      sameAs: [site.portfolio, github.url, linkedin.url, x.url],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Learnt',
      url: siteUrl.toString(),
      author,
    },
  ];
}

// JSON inside <script> must not be able to close the tag.
export const serializeJsonLd = (data: JsonLd | JsonLd[]) =>
  JSON.stringify(data).replace(/</g, '\\u003c');
