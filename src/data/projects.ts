export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'design' | 'api';
  status: 'completed' | 'in-progress' | 'planned' | 'archived';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  phase: 'active' | 'sunset' | 'archived';
  dateStarted: string;
  dateCompleted?: string;
  dateCreated?: string;
  sunsetDate?: string;
  short?: string;
  learned?: string[];
  altText?: string;
  dateSunset?: string;
  githubUrl?: string;
  liveUrl?: string;
  screenshot: string;
  gallery?: string[];
  youtubeId?: string;
  notesUrl?: string;
  features: string[];
  learnings: string[];
  challenges: string[];
  nextSteps?: string[];
  tags: string[];
  featured: boolean;
  changelog?: { date: string; note: string }[];
  retrospective?: string;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Todo App V1',
    short: 'A simple todo app to learn JS DOM and state.',
    dateCreated: '2024-01-15',
    sunsetDate: '2024-02-01',
    learned: [
      'How to manage state in vanilla JS',
      'Importance of UI feedback',
    ],
    altText: 'Screenshot of Todo App V1',
    slug: 'todo-app-v1',
    description: 'A simple todo application with local storage persistence',
    longDescription: 'My first dive into JavaScript DOM manipulation and local storage. Built a clean, functional todo app that taught me the fundamentals of state management and user interaction.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Local Storage'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'beginner',
    dateStarted: '2024-01-15',
    dateCompleted: '2024-01-18',
    githubUrl: 'https://github.com/yourusername/todo-v1',
    liveUrl: 'https://your-todo-v1.netlify.app',
  screenshot: '/images/screenshots/todo-v1.png',
  gallery: ['/images/screenshots/todo-v1.png'],
  youtubeId: 'dQw4w9WgXcQ',
  notesUrl: 'https://example.com/todo-notes',
    features: [
      'Add, edit, and delete todos',
      'Mark todos as complete',
      'Filter by status (all, active, completed)',
      'Local storage persistence',
      'Responsive design'
    ],
    learnings: [
      'DOM manipulation with vanilla JavaScript',
      'Event handling and delegation',
      'Local storage API usage',
      'CSS Grid and Flexbox layouts',
      'Mobile-first responsive design'
    ],
    challenges: [
      'Understanding event bubbling and capturing',
      'Managing state without a framework',
      'Implementing smooth animations with CSS'
    ],
    phase: 'active',
    nextSteps: [
      'Add drag and drop functionality',
      'Implement categories/tags',
      'Add due dates and reminders'
    ],
    tags: ['vanilla-js', 'dom', 'local-storage', 'crud'],
    featured: true,
    changelog: [
      { date: '2024-01-18', note: 'Initial release.' },
      { date: '2024-01-25', note: 'Added drag-and-drop support.' }
    ],
    retrospective: 'Building this app taught me the value of simple UI and the importance of state management.'
  },
  {
    id: '2',
    title: 'Weather Dashboard',
    short: 'Real-time weather dashboard with charts and API.',
    dateCreated: '2024-02-01',
    sunsetDate: '2024-03-01',
    learned: [
      'API integration and error handling',
      'Data visualization with Chart.js',
    ],
    altText: 'Screenshot of Weather Dashboard',
    slug: 'weather-dashboard',
    description: 'Real-time weather application using OpenWeatherMap API',
    longDescription: 'Built my first API-consuming application with real-time weather data, location services, and interactive charts. This project taught me asynchronous JavaScript and working with external APIs.',
    technologies: ['JavaScript', 'Chart.js', 'OpenWeatherMap API', 'Geolocation', 'CSS3'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2024-02-01',
    dateCompleted: '2024-02-08',
    githubUrl: 'https://github.com/yourusername/weather-dashboard',
    liveUrl: 'https://your-weather-app.netlify.app',
  screenshot: '/images/screenshots/weather-dashboard.png',
  gallery: ['/images/screenshots/weather-dashboard.png'],
  youtubeId: 'dQw4w9WgXcQ',
  notesUrl: 'https://example.com/weather-notes',
    features: [
      'Current weather conditions',
      '5-day weather forecast',
      'Location-based weather detection',
      'Search weather by city',
      'Interactive temperature charts',
      'Weather alerts and warnings'
    ],
    learnings: [
      'Fetch API and async/await patterns',
      'Working with REST APIs',
      'Error handling and loading states',
      'Chart.js for data visualization',
      'Geolocation API usage',
      'CSS animations and transitions'
    ],
    challenges: [
      'Handling API rate limits',
      'Managing multiple asynchronous requests',
      'Creating responsive chart layouts',
      'Implementing proper error boundaries'
    ],
    phase: 'sunset',
    tags: ['api', 'async', 'charts', 'geolocation'],
    featured: true,
    changelog: [
      { date: '2024-02-08', note: 'Launched MVP.' },
      { date: '2024-02-15', note: 'Improved error handling and chart UX.' }
    ],
    retrospective: 'API integration was challenging but rewarding. Visual feedback is key for user trust.'
  },
  {
    id: '3',
    title: 'Recipe API',
    short: 'RESTful API for recipes with authentication.',
    dateCreated: '2024-03-01',
    sunsetDate: '2024-04-01',
    learned: [
      'JWT authentication',
      'API documentation with Swagger',
    ],
    altText: 'Screenshot of Recipe API',
    slug: 'recipe-api',
    description: 'RESTful API for recipe management with user authentication',
    longDescription: 'My first backend project using Node.js and Express. Built a complete REST API with authentication, database integration, and comprehensive testing.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Jest', 'Postman'],
    category: 'backend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2024-03-01',
    dateCompleted: '2024-03-15',
    githubUrl: 'https://github.com/yourusername/recipe-api',
  screenshot: '/images/screenshots/recipe-api.png',
  gallery: ['/images/screenshots/recipe-api.png'],
  youtubeId: 'dQw4w9WgXcQ',
  notesUrl: 'https://example.com/recipe-notes',
    features: [
      'User registration and authentication',
      'CRUD operations for recipes',
      'Recipe search and filtering',
      'Image upload for recipes',
      'User recipe collections',
      'API documentation with Swagger'
    ],
    learnings: [
      'RESTful API design principles',
      'JWT authentication implementation',
      'MongoDB schema design',
      'Middleware creation and usage',
      'API testing with Jest and Supertest',
      'Error handling and validation'
    ],
    challenges: [
      'Implementing secure authentication',
      'Designing efficient database schemas',
      'Writing comprehensive tests',
      'Handling file uploads securely'
    ],
    phase: 'archived',
    tags: ['nodejs', 'express', 'mongodb', 'jwt', 'rest-api'],
    featured: true,
    changelog: [
      { date: '2024-03-15', note: 'API v1 complete.' },
      { date: '2024-03-20', note: 'Added Swagger docs.' }
    ],
    retrospective: 'Testing and documentation are as important as code. Security is a journey.'
  },
  // Add more projects as needed...
];

// Utility functions for working with projects
export function getAllProjects(): Project[] {
  return [...projects];
}

export function filterProjects(filters: Partial<Project>): Project[] {
  return projects.filter(project => {
    return Object.entries(filters).every(([key, value]) => {
      if (Array.isArray(project[key as keyof Project])) {
        return (project[key as keyof Project] as unknown[]).some(item => 
          String(item).toLowerCase().includes(String(value).toLowerCase())
        );
      }
      return String(project[key as keyof Project]).toLowerCase().includes(String(value).toLowerCase());
    });
  });
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug);
}

export function getProjectsByCategory(category: string): Project[] {
  return projects.filter(project => project.category === category);
}

export function getProjectsByStatus(status: string): Project[] {
  return projects.filter(project => project.status === status);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(project => project.featured);
}

export function getProjectsByTechnology(tech: string): Project[] {
  return projects.filter(project => 
    project.technologies.some(technology => 
      technology.toLowerCase().includes(tech.toLowerCase())
    )
  );
}

export function searchProjects(query: string): Project[] {
  const lowercaseQuery = query.toLowerCase();
  return projects.filter(project => 
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery)) ||
    project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function getUniqueCategories(): string[] {
  return [...new Set(projects.map(project => project.category))];
}

export function getUniqueTechnologies(): string[] {
  const allTech = projects.flatMap(project => project.technologies);
  return [...new Set(allTech)].sort();
}

export function getProjectStats() {
  return {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    planned: projects.filter(p => p.status === 'planned').length,
    technologies: getUniqueTechnologies().length,
    categories: getUniqueCategories().length
  };
}