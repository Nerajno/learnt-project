import type { Project } from '../../src/data/projects';

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'test-1',
    title: 'Test Project',
    slug: 'test-project',
    description: 'Short description',
    longDescription: 'Long description',
    technologies: ['Astro', 'TypeScript'],
    category: 'frontend',
    stage: 'shipped',
    difficulty: 'beginner',
    born: '2023-01-15',
    tier: 'marker',
    githubUrl: 'https://github.com/Nerajno/test-project',
    screenshot: '/images/project-placeholder.svg',
    features: [],
    learnings: [],
    challenges: [],
    tags: ['astro'],
    featured: false,
    ...overrides,
  };
}
