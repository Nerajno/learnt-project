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
    status: 'completed',
    difficulty: 'beginner',
    phase: 'archived',
    dateStarted: '2023-01-15',
    screenshot: '/images/project-placeholder.svg',
    features: [],
    learnings: [],
    challenges: [],
    tags: ['astro'],
    featured: false,
    ...overrides,
  };
}
