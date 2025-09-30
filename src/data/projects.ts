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
  // ACTIVE PROJECTS (2025)
  {
    id: '1',
    title: 'Portfolio V3',
    short: 'Third iteration of my personal portfolio built with Astro',
    dateCreated: '2025-09-15',
    learned: [
      'Astro static site generation',
      'Component-based architecture',
      'Performance optimization techniques',
    ],
    altText: 'Screenshot of Portfolio V3',
    slug: 'portfolio-v3',
    description: 'Latest version of my portfolio showcasing projects and skills',
    longDescription: 'Built the third iteration of my portfolio using Astro for optimal performance. This version focuses on showcasing my learning journey and project documentation with modern design patterns and excellent Core Web Vitals scores.',
    technologies: ['Astro', 'TypeScript', 'Tailwind CSS', 'Markdown'],
    category: 'frontend',
    status: 'in-progress',
    difficulty: 'intermediate',
    dateStarted: '2025-08-01',
    githubUrl: 'https://github.com/Nerajno/portfolio_v3',
    phase: 'active',
    screenshot: '/images/screenshots/portfolio-v3.png',
    gallery: ['/images/screenshots/portfolio-v3.png'],
    features: [
      'Static site generation with Astro',
      'Dark mode support',
      'Project showcase with filtering',
      'Blog with MDX support',
      'Responsive design',
      'SEO optimized'
    ],
    learnings: [
      'Astro Islands architecture',
      'Static site optimization',
      'Component reusability patterns',
      'Modern CSS with Tailwind',
      'Performance best practices'
    ],
    challenges: [
      'Migrating from previous framework',
      'Implementing dark mode consistently',
      'Optimizing for Lighthouse scores',
      'Content organization strategy'
    ],
    nextSteps: [
      'Add blog section',
      'Implement analytics',
      'Add more interactive elements',
      'Create case studies for major projects'
    ],
    tags: ['astro', 'portfolio', 'tailwind', 'typescript', 'static-site'],
    featured: true,
  },
  {
    id: '2',
    title: 'Learnt Project',
    short: 'A graveyard for all my projects - documenting my learning journey',
    dateCreated: '2025-09-15',
    learned: [
      'Project lifecycle management',
      'Documentation best practices',
      'Building project archives',
      'Meta-documentation strategies',
    ],
    altText: 'Screenshot of Learnt Project',
    slug: 'learnt-project',
    description: 'Archive and documentation of all my learning projects',
    longDescription: 'Third attempt at creating a comprehensive archive of my learning projects. Inspired by "Killed by Google", this site documents every project I have built, learned from, or sunset. Features advanced filtering, search, and detailed retrospectives for each project.',
    technologies: ['Astro', 'TypeScript', 'Tailwind CSS', 'Markdown'],
    category: 'frontend',
    status: 'in-progress',
    difficulty: 'intermediate',
    dateStarted: '2025-08-01',
    githubUrl: 'https://github.com/Nerajno/learnt-project',
    liveUrl: 'https://learnt.developingdvlpr.com',
    phase: 'active',
    screenshot: '/images/screenshots/learnt.png',
    gallery: ['/images/screenshots/learnt.png'],
    features: [
      'Project timeline visualization',
      'Status tracking (active, sunset, archived)',
      '8-way filtering system',
      'Advanced search functionality',
      'Detailed project retrospectives',
      'Learning outcome documentation',
      'Tag-based organization'
    ],
    learnings: [
      'Importance of documenting learning journey',
      'Project categorization strategies',
      'Building searchable archives',
      'Astro content collections',
      'Complex filtering implementation'
    ],
    challenges: [
      'Organizing years of projects',
      'Creating meaningful categorizations',
      'Building intuitive navigation',
      'Balancing detail vs. brevity'
    ],
    nextSteps: [
      'Add timeline view',
      'Implement project relationships',
      'Add statistics dashboard',
      'Export functionality'
    ],
    tags: ['astro', 'documentation', 'archive', 'portfolio', 'meta'],
    featured: true,
    changelog: [
      { date: '2025-09-15', note: 'Initial launch with 42 projects' },
      { date: '2025-09-20', note: 'Added advanced filtering system' },
      { date: '2025-09-30', note: 'Enhanced search and tag support' }
    ],
    retrospective: 'This project itself is a meta-documentation of learning to document learning. Third time is the charm! Building this has taught me as much about reflection as it has about web development.'
  },
  {
    id: '3',
    title: 'Digital Garden',
    short: 'Personal knowledge base and note-taking system',
    dateCreated: '2025-09-16',
    learned: [
      'Digital garden concepts',
      'Knowledge management systems',
      'CSS styling and layouts',
      'Evergreen content principles',
    ],
    altText: 'Screenshot of Digital Garden',
    slug: 'digital-garden',
    description: 'A growing collection of notes, thoughts, and learning resources',
    longDescription: 'My personal digital garden where I cultivate and share knowledge. A living document that grows and evolves with my learning. Embraces the concept of learning in public and building knowledge incrementally.',
    technologies: ['CSS', 'HTML', 'JavaScript', 'Markdown'],
    category: 'frontend',
    status: 'in-progress',
    difficulty: 'beginner',
    dateStarted: '2025-09-01',
    githubUrl: 'https://github.com/Nerajno/digital_garden',
    phase: 'active',
    screenshot: '/images/screenshots/digital-garden.png',
    gallery: ['/images/screenshots/digital-garden.png'],
    features: [
      'Interconnected notes',
      'Progressive disclosure',
      'Search functionality',
      'Tags and categories',
      'Evergreen content',
      'Backlinks between notes'
    ],
    learnings: [
      'Digital garden methodology',
      'Note-taking systems (Zettelkasten)',
      'Content organization strategies',
      'Writing for learning',
      'Building connections between ideas'
    ],
    challenges: [
      'Balancing structure vs. flexibility',
      'Maintaining consistency',
      'Finding the right level of detail',
      'Building bidirectional links'
    ],
    nextSteps: [
      'Add graph visualization',
      'Implement better search',
      'Add note versioning',
      'Create topic clusters'
    ],
    tags: ['notes', 'knowledge-base', 'digital-garden', 'css', 'learning'],
    featured: true,
  },
  {
    id: '4',
    title: 'Is Nerando Done Yet',
    short: 'Status keeper tracking project completion',
    dateCreated: '2025-09-30',
    learned: [
      'Vue.js fundamentals',
      'Status tracking systems',
      'Fork and contribute workflow',
    ],
    altText: 'Screenshot of Is Nerando Done Yet',
    slug: 'is-nerando-done-yet',
    description: 'Fun status tracker for monitoring project completion',
    longDescription: 'Forked status keeper project to track my own project completion status. A playful way to keep myself accountable and share progress with the community.',
    technologies: ['Vue', 'JavaScript', 'CSS'],
    category: 'frontend',
    status: 'in-progress',
    difficulty: 'beginner',
    dateStarted: '2025-09-20',
    githubUrl: 'https://github.com/Nerajno/isnerandodoneyet-com',
    phase: 'active',
    screenshot: '/images/screenshots/status-tracker.png',
    gallery: ['/images/screenshots/status-tracker.png'],
    features: [
      'Status display',
      'Progress tracking',
      'Simple interface',
      'Shareable status page',
      'Emoji indicators'
    ],
    learnings: [
      'Vue.js basics',
      'Contributing to open source',
      'Forking workflows',
      'Customizing existing projects'
    ],
    challenges: [
      'Understanding existing codebase',
      'Maintaining fork updates',
      'Customization without breaking original functionality'
    ],
    tags: ['vue', 'status', 'tracking', 'fork', 'opensource'],
    featured: false,
  },
  {
    id: '5',
    title: 'My Digital Mausoleum',
    short: 'Archive of personal learning projects and experiments',
    dateCreated: '2024-12-01',
    learned: [
      'Project archival',
      'Documentation organization',
      'Learning reflection',
    ],
    altText: 'Digital Mausoleum',
    slug: 'digital-mausoleum',
    description: 'Collection of archived learning projects and experiments',
    longDescription: 'A meta-repository serving as a mausoleum for various learning projects. Each project represents a learning journey and exploration of new technologies or techniques. A respectful archive of code that served its purpose.',
    technologies: ['Various', 'Documentation', 'Git', 'Markdown'],
    category: 'design',
    status: 'in-progress',
    difficulty: 'beginner',
    dateStarted: '2024-11-01',
    githubUrl: 'https://github.com/NerajnoLearning/My-digital-Mausoleum',
    phase: 'active',
    screenshot: '/images/screenshots/mausoleum.png',
    gallery: ['/images/screenshots/mausoleum.png'],
    features: [
      'Project archive',
      'Learning logs',
      'Technology exploration',
      'Reflection notes',
      'Links to repositories'
    ],
    learnings: [
      'Importance of archiving',
      'Reflecting on progress',
      'Documentation value',
      'Learning journey tracking',
      'Growth mindset'
    ],
    challenges: [
      'Organizing diverse projects',
      'Writing meaningful retrospectives',
      'Maintaining consistency',
      'Balancing detail and brevity'
    ],
    tags: ['archive', 'documentation', 'learning', 'meta', 'reflection'],
    featured: true,
    retrospective: 'Every project, successful or not, teaches something valuable. This archive honors all learning experiences, celebrating the journey as much as the destination.'
  },

  // SUNSET PROJECTS (2025)
  {
    id: '6',
    title: 'Learnt V2',
    short: 'Second attempt at project graveyard - iteration and improvement',
    dateCreated: '2025-08-20',
    learned: [
      'Iterating on previous work',
      'Astro fundamentals',
      'Project scope management',
      'When to pivot',
    ],
    altText: 'Screenshot of Learnt V2',
    slug: 'learnt-v2',
    description: 'Second iteration of the Learnt project archive',
    longDescription: 'The second attempt at building a comprehensive project archive. Learned valuable lessons about scope and structure that informed the third iteration. Sometimes you need to build something twice to understand what you really need.',
    technologies: ['Astro', 'JavaScript', 'CSS'],
    category: 'frontend',
    status: 'archived',
    difficulty: 'intermediate',
    dateStarted: '2025-08-10',
    dateCompleted: '2025-08-20',
    sunsetDate: '2025-08-20',
    githubUrl: 'https://github.com/Nerajno/learnt_2',
    phase: 'sunset',
    screenshot: '/images/screenshots/learnt-v2.png',
    gallery: ['/images/screenshots/learnt-v2.png'],
    features: [
      'Basic project listing',
      'Simple filtering',
      'Markdown content',
      'Static generation'
    ],
    learnings: [
      'Sometimes you need to start over',
      'Importance of planning structure',
      'Version control best practices',
      'When to pivot vs persist'
    ],
    challenges: [
      'Unclear requirements',
      'Feature creep',
      'Technical debt accumulation'
    ],
    tags: ['astro', 'archive', 'iteration', 'learning'],
    featured: false,
    retrospective: 'V2 taught me that iteration is okay. Sometimes you need to fail forward to get it right. The lessons learned here directly informed the successful V3.'
  },
  {
    id: '7',
    title: 'Learnt V1',
    short: 'First attempt at building a project graveyard',
    dateCreated: '2025-08-16',
    learned: [
      'Starting projects',
      'Basic Astro setup',
      'Project planning importance',
    ],
    altText: 'Screenshot of Learnt V1',
    slug: 'learnt-v1',
    description: 'Initial attempt at creating a project documentation system',
    longDescription: 'The first attempt at building Learnt. While it didn\'t work out, it provided crucial learning experiences that shaped the later iterations. Every journey starts with a first step, even if it\'s in the wrong direction.',
    technologies: ['Astro', 'JavaScript', 'CSS'],
    category: 'frontend',
    status: 'archived',
    difficulty: 'beginner',
    dateStarted: '2025-08-05',
    dateCompleted: '2025-08-16',
    sunsetDate: '2025-08-16',
    githubUrl: 'https://github.com/Nerajno/learnt',
    phase: 'archived',
    screenshot: '/images/screenshots/learnt-v1.png',
    gallery: ['/images/screenshots/learnt-v1.png'],
    features: [
      'Basic project pages',
      'Static site generation',
      'Simple navigation'
    ],
    learnings: [
      'Getting started with Astro',
      'Planning is essential',
      'Don\'t be afraid to restart',
      'Learning from failure'
    ],
    challenges: [
      'Unclear vision',
      'Technical limitations',
      'Scope uncertainty'
    ],
    tags: ['astro', 'archive', 'first-attempt', 'learning'],
    featured: false,
    retrospective: 'V1 was messy, but that\'s okay. Every project starts somewhere. The important thing is starting, not being perfect from the beginning.'
  },
  {
    id: '8',
    title: 'Side Project Status Tracker',
    short: 'Vue-based tracker for managing multiple side projects',
    dateCreated: '2025-05-04',
    learned: [
      'Project management',
      'Vue state management',
      'Status visualization',
    ],
    altText: 'Side Project Status Tracker',
    slug: 'side-project-status',
    description: 'Tool for tracking status of multiple side projects',
    longDescription: 'Built a Vue application to manage and track the status of all my side projects. Helps visualize what\'s active, on hold, or completed. Eventually superseded by the Learnt project which provides more comprehensive documentation.',
    technologies: ['Vue', 'JavaScript', 'CSS'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2025-04-15',
    dateCompleted: '2025-05-04',
    sunsetDate: '2025-06-01',
    githubUrl: 'https://github.com/Nerajno/v0-Side_project_Status',
    phase: 'sunset',
    screenshot: '/images/screenshots/side-project-tracker.png',
    gallery: ['/images/screenshots/side-project-tracker.png'],
    features: [
      'Multiple project tracking',
      'Status categorization',
      'Progress visualization',
      'Filter and search',
      'Export functionality'
    ],
    learnings: [
      'Vue component composition',
      'State management patterns',
      'Data visualization',
      'Project tracking methodologies'
    ],
    challenges: [
      'Keeping data in sync',
      'Designing intuitive UI',
      'Handling multiple project states'
    ],
    tags: ['vue', 'project-management', 'tracking', 'status'],
    featured: false,
    retrospective: 'Great tool while it lasted. Eventually replaced by the Learnt project which does this and more. Sometimes good tools get superseded by better ones.'
  },

  // COMPLETED FRONTEND PROJECTS (2024-2025)
  {
    id: '9',
    title: 'Burble V1',
    short: 'React-based Netflix styled app with added features',
    dateCreated: '2024-10-29',
    learned: [
      'React component architecture',
      'API integration',
      'Netflix-style UI patterns',
      'Complex carousel implementations',
    ],
    altText: 'Screenshot of Burble',
    slug: 'burble-v1',
    description: 'Netflix-inspired streaming interface built with React',
    longDescription: 'A React application mimicking Netflix\'s interface and functionality. Built to understand streaming app architecture and modern React patterns. Features smooth carousels, hover previews, and category-based browsing.',
    technologies: ['React', 'JavaScript', 'CSS', 'REST API'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2024-09-15',
    dateCompleted: '2024-10-29',
    sunsetDate: '2024-11-15',
    githubUrl: 'https://github.com/Nerajno/Burble-V1',
    phase: 'sunset',
    screenshot: '/images/screenshots/burble.png',
    gallery: ['/images/screenshots/burble.png'],
    features: [
      'Netflix-style carousel',
      'Video playback interface',
      'Browse by category',
      'Search functionality',
      'Hover previews',
      'Responsive design'
    ],
    learnings: [
      'React hooks and state management',
      'Working with video APIs',
      'Complex UI layouts',
      'Performance optimization for media',
      'Carousel implementation patterns'
    ],
    challenges: [
      'Implementing smooth carousels',
      'Video player integration',
      'Responsive grid layouts',
      'API rate limiting',
      'Hover interaction timing'
    ],
    tags: ['react', 'streaming', 'ui-clone', 'api', 'video'],
    featured: true,
    retrospective: 'Great project for learning React patterns. The Netflix UI is deceptively complex - what looks simple on the surface requires careful attention to detail and performance optimization.'
  },
  {
    id: '10',
    title: 'FreeCodeCamp Calculator',
    short: 'Calculator project for FreeCodeCamp Front End Development certification',
    dateCreated: '2024-10-29',
    learned: [
      'TypeScript fundamentals',
      'Calculator logic implementation',
      'Event handling',
      'State machines',
    ],
    altText: 'Screenshot of FCC Calculator',
    slug: 'fcc-calculator',
    description: 'Calculator built for FreeCodeCamp certification',
    longDescription: 'A functional calculator built to meet FreeCodeCamp\'s Front End Development Library certification requirements. Implemented with TypeScript for type safety and proper calculator logic handling.',
    technologies: ['TypeScript', 'HTML', 'CSS'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'beginner',
    dateStarted: '2024-10-01',
    dateCompleted: '2024-10-29',
    githubUrl: 'https://github.com/Nerajno/Ber-kna-FCCFEDL',
    phase: 'archived',
    screenshot: '/images/screenshots/calculator.png',
    gallery: ['/images/screenshots/calculator.png'],
    features: [
      'Basic arithmetic operations',
      'Clear and reset functions',
      'Decimal support',
      'Keyboard support',
      'Order of operations',
      'Responsive design'
    ],
    learnings: [
      'TypeScript basics',
      'Calculator logic patterns',
      'State management without frameworks',
      'User input validation',
      'Floating point arithmetic handling'
    ],
    challenges: [
      'Handling edge cases',
      'Order of operations',
      'Floating point precision',
      'Keyboard accessibility',
      'TypeScript type safety'
    ],
    tags: ['typescript', 'calculator', 'freecodecamp', 'certification'],
    featured: false,
  },
  {
    id: '11',
    title: 'Drum Machine - Trumma',
    short: 'Interactive drum machine built for FreeCodeCamp certification',
    dateCreated: '2024-09-01',
    learned: [
      'Web Audio API',
      'Event handling for keyboard',
      'React component patterns',
      'Audio file management',
    ],
    altText: 'Screenshot of Trumma Drum Machine',
    slug: 'trumma-drum-machine',
    description: 'Browser-based drum machine with keyboard and click support',
    longDescription: 'Built an interactive drum machine for FreeCodeCamp\'s front-end certification. Features multiple drum pads, keyboard support, and volume control. Learned the intricacies of the Web Audio API.',
    technologies: ['React', 'JavaScript', 'Web Audio API', 'CSS'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2024-08-15',
    dateCompleted: '2024-09-01',
    githubUrl: 'https://github.com/NerajnoLearning/Trumma',
    liveUrl: 'https://drum-machine.freecodecamp.rocks/',
    phase: 'archived',
    screenshot: '/images/screenshots/drum-machine.png',
    gallery: ['/images/screenshots/drum-machine.png'],
    features: [
      '9 drum pads with unique sounds',
      'Keyboard support (Q,W,E,A,S,D,Z,X,C)',
      'Visual feedback on press',
      'Volume control',
      'Display current sound',
      'Responsive layout'
    ],
    learnings: [
      'Web Audio API usage',
      'Keyboard event handling',
      'Sound file management',
      'Interactive UI design',
      'Accessibility for audio apps',
      'Event listener cleanup'
    ],
    challenges: [
      'Audio file loading and buffering',
      'Simultaneous sound playback',
      'Keyboard event conflicts',
      'Mobile touch optimization',
      'Volume control implementation'
    ],
    tags: ['react', 'audio', 'freecodecamp', 'web-audio-api', 'interactive'],
    featured: true,
  },
  {
    id: '12',
    title: 'JavaScript30',
    short: '30 Day Vanilla JS Challenge by Wes Bos',
    dateCreated: '2024-03-30',
    learned: [
      'Vanilla JavaScript mastery',
      'DOM manipulation techniques',
      'CSS tricks and animations',
      'Working without frameworks',
      'ES6+ features',
    ],
    altText: 'Screenshot of JavaScript30 projects',
    slug: 'javascript30',
    description: 'Completed Wes Bos\'s 30 day vanilla JavaScript challenge',
    longDescription: 'Worked through Wes Bos\'s excellent JavaScript30 course, building 30 different projects in 30 days using vanilla JavaScript. No frameworks, no libraries - just pure JavaScript. Projects ranged from drum kits to video players to canvas drawing.',
    technologies: ['JavaScript', 'HTML', 'CSS', 'Canvas', 'LocalStorage'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'beginner',
    dateStarted: '2024-03-01',
    dateCompleted: '2024-03-30',
    githubUrl: 'https://github.com/Nerajno/JavaScript30',
    phase: 'archived',
    screenshot: '/images/screenshots/js30.png',
    gallery: ['/images/screenshots/js30.png'],
    features: [
      '30 unique JavaScript projects',
      'Vanilla JS only - no frameworks',
      'No compilation or transpilation',
      'Practical everyday examples',
      'Audio, video, and canvas work',
      'Geolocation and speech recognition'
    ],
    learnings: [
      'ES6+ features (arrow functions, destructuring, spread)',
      'Array methods mastery (map, filter, reduce)',
      'Working with audio/video APIs',
      'CSS variables with JavaScript',
      'LocalStorage and SessionStorage',
      'Fetch API and JSON',
      'Canvas API fundamentals',
      'Event delegation patterns'
    ],
    challenges: [
      'Completing one project per day',
      'Understanding some advanced concepts',
      'Browser compatibility issues',
      'Debugging without frameworks',
      'Maintaining consistency across 30 projects'
    ],
    tags: ['javascript', 'vanilla-js', 'course', 'dom', 'wes-bos', 'challenge'],
    featured: true,
    retrospective: 'This course solidified my vanilla JavaScript fundamentals. Highly recommend for anyone wanting to truly understand JS before jumping into frameworks. Wes Bos\'s teaching style is engaging and the projects are practical.'
  },
  {
    id: '13',
    title: 'Vue Conference Workshop',
    short: 'Proven patterns workshop materials from Vue Conf 2025',
    dateCreated: '2025-05-19',
    learned: [
      'Vue.js best practices',
      'Component design patterns',
      'Vue Composition API',
      'Advanced reactivity',
    ],
    altText: 'Vue Conf Workshop materials',
    slug: 'vue-conf-workshop',
    description: 'Workshop materials from Vue Conference 2025 on proven patterns',
    longDescription: 'Attended and worked through Ben Codezen\'s proven patterns workshop at Vue Conference 2025. Learned advanced Vue.js patterns and best practices from industry experts. Covered composition API, advanced patterns, and real-world scenarios.',
    technologies: ['TypeScript', 'Vue.js', 'Vite', 'Composition API'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'advanced',
    dateStarted: '2025-05-19',
    dateCompleted: '2025-05-19',
    githubUrl: 'https://github.com/Nerajno/vue-conf-25-proven-patterns-workshop',
    phase: 'archived',
    screenshot: '/images/screenshots/vue-workshop.png',
    gallery: ['/images/screenshots/vue-workshop.png'],
    features: [
      'Advanced Vue patterns',
      'Composition API deep dive',
      'TypeScript integration',
      'Component architecture',
      'State management patterns',
      'Performance optimization'
    ],
    learnings: [
      'Vue 3 Composition API mastery',
      'Advanced component patterns',
      'TypeScript with Vue best practices',
      'Performance optimization techniques',
      'Testing strategies for Vue',
      'Real-world pattern application'
    ],
    challenges: [
      'Understanding complex composition API patterns',
      'TypeScript type safety in Vue',
      'Advanced reactive patterns',
      'Workshop time constraints',
      'Applying patterns to real projects'
    ],
    tags: ['vue', 'typescript', 'workshop', 'conference', 'advanced', 'composition-api'],
    featured: false,
  },
  {
    id: '14',
    title: 'FCC D3 Bar Chart',
    short: 'D3.js bar chart visualization for FreeCodeCamp certification',
    dateCreated: '2024-06-01',
    learned: [
      'D3.js fundamentals',
      'SVG manipulation',
      'Data binding concepts',
      'Scales and axes',
    ],
    altText: 'D3 Bar Chart Visualization',
    slug: 'fcc-d3-bars',
    description: 'Bar chart data visualization built with D3.js',
    longDescription: 'Created an interactive bar chart using D3.js as part of FreeCodeCamp\'s Data Visualization certification. Features tooltips, smooth animations, and responsive SVG design. Visualizes economic data over time.',
    technologies: ['JavaScript', 'D3.js', 'SVG', 'HTML', 'CSS'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2024-05-20',
    dateCompleted: '2024-06-01',
    githubUrl: 'https://github.com/NerajnoLearning/FCC_D3_Bars',
    phase: 'archived',
    screenshot: '/images/screenshots/d3-bars.png',
    gallery: ['/images/screenshots/d3-bars.png'],
    features: [
      'Interactive bar chart',
      'Hover tooltips with data',
      'Responsive SVG scaling',
      'Smooth D3 transitions',
      'Data-driven rendering',
      'Axes with proper scales'
    ],
    learnings: [
      'D3.js selection API',
      'SVG coordinate systems',
      'Data binding patterns (enter-update-exit)',
      'Scales (linear, time) and axes',
      'D3 transitions and animations',
      'Responsive SVG techniques'
    ],
    challenges: [
      'Understanding D3\'s data join pattern',
      'SVG positioning and sizing',
      'Responsive chart dimensions',
      'Tooltip positioning',
      'Smooth animations without jank'
    ],
    tags: ['d3js', 'data-visualization', 'freecodecamp', 'svg', 'charts'],
    featured: false,
  },
  {
    id: '15',
    title: 'FCC D3 Story',
    short: 'Culmination of D3 data visualization projects',
    dateCreated: '2024-06-15',
    learned: [
      'Advanced D3.js techniques',
      'Data storytelling',
      'Complex visualizations',
      'Multiple chart coordination',
    ],
    altText: 'D3 Story Visualization',
    slug: 'fcc-d3-story',
    description: 'Final comprehensive D3.js visualization project',
    longDescription: 'Capstone D3.js project bringing together all learned visualization techniques. Creates an interactive data story with multiple chart types, coordinated views, and compelling narrative. Final project for FreeCodeCamp Data Visualization certification.',
    technologies: ['JavaScript', 'D3.js', 'SVG', 'HTML', 'CSS'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'advanced',
    dateStarted: '2024-06-05',
    dateCompleted: '2024-06-15',
    githubUrl: 'https://github.com/NerajnoLearning/FCC_D3_story',
    phase: 'archived',
    screenshot: '/images/screenshots/d3-story.png',
    gallery: ['/images/screenshots/d3-story.png'],
    features: [
      'Multiple visualization types',
      'Interactive data story',
      'Coordinated views',
      'Advanced transitions',
      'Responsive design',
      'Narrative flow'
    ],
    learnings: [
      'Data storytelling techniques',
      'Complex D3 patterns',
      'Coordinating multiple charts',
      'Advanced animations',
      'Performance optimization with large datasets'
    ],
    challenges: [
      'Managing multiple visualizations',
      'Coordinating interactions across charts',
      'Performance with complex data',
      'Creating compelling narrative'
    ],
    tags: ['d3js', 'data-visualization', 'freecodecamp', 'storytelling', 'advanced'],
    featured: true,
    retrospective: 'This project brought together everything I learned about D3. Data visualization is an art form that combines technical skill with storytelling ability.'
  },
  {
    id: '16',
    title: 'Vue Holiday Card Maker',
    short: 'Interactive holiday card creator built with Vue',
    dateCreated: '2024-12-01',
    learned: [
      'Vue component design',
      'User customization features',
      'Canvas API manipulation',
      'File handling',
    ],
    altText: 'Vue Holiday Card Maker',
    slug: 'vue-holiday-card',
    description: 'Create and customize holiday cards with Vue.js',
    longDescription: 'Built an interactive holiday card maker using Vue.js. Users can customize text, colors, and images to create personalized holiday cards. Features canvas rendering and image export functionality.',
    technologies: ['Vue', 'JavaScript', 'CSS', 'HTML Canvas'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2024-11-15',
    dateCompleted: '2024-12-01',
    githubUrl: 'https://github.com/NerajnoLearning/Vue_Holiday_Card_Maker',
    phase: 'archived',
    screenshot: '/images/screenshots/holiday-card.png',
    gallery: ['/images/screenshots/holiday-card.png'],
    features: [
      'Customizable text and colors',
      'Image upload',
      'Multiple card templates',
      'Export to image',
      'Share functionality',
      'Real-time preview'
    ],
    learnings: [
      'Vue reactive forms',
      'Canvas API usage',
      'File upload handling',
      'Image export functionality',
      'User customization patterns'
    ],
    challenges: [
      'Canvas rendering accuracy',
      'Image manipulation',
      'Export functionality cross-browser',
      'Maintaining aspect ratios'
    ],
    tags: ['vue', 'canvas', 'interactive', 'seasonal', 'image-processing'],
    featured: false,
  },
  {
    id: '17',
    title: 'Assaggio FCC Project',
    short: 'Front-End Development Library Certification project #1',
    dateCreated: '2023-09-16',
    learned: [
      'FreeCodeCamp certification requirements',
      'JavaScript DOM manipulation',
      'Responsive design principles',
    ],
    altText: 'Assaggio FCC Project',
    slug: 'assaggio-fcc',
    description: 'First project in FreeCodeCamp\'s Front End Development Libraries path',
    longDescription: 'Completed the first project in the FreeCodeCamp Front End Development Libraries certification track. Built a responsive web application meeting all certification requirements and user stories.',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'beginner',
    dateStarted: '2023-09-01',
    dateCompleted: '2023-09-16',
    githubUrl: 'https://github.com/Nerajno/Assaggio-1-FCC_FEDLC',
    phase: 'archived',
    screenshot: '/images/screenshots/assaggio.png',
    gallery: ['/images/screenshots/assaggio.png'],
    features: [
      'Meets all FCC requirements',
      'Responsive layout',
      'Interactive elements',
      'Clean code structure',
      'Passes automated tests'
    ],
    learnings: [
      'FCC testing suite',
      'Meeting certification criteria',
      'Code organization',
      'User story implementation',
      'Test-driven development basics'
    ],
    challenges: [
      'Understanding all requirements',
      'Passing automated tests',
      'Code quality standards',
      'Responsive design implementation'
    ],
    tags: ['javascript', 'freecodecamp', 'certification', 'frontend'],
    featured: false,
  },
  {
    id: '18',
    title: 'bRavur FCC Project',
    short: 'Front-End Development Library Certification project #4',
    dateCreated: '2024-05-01',
    learned: [
      'Advanced React patterns',
      'State management',
      'Component lifecycle',
    ],
    altText: 'bRavur FCC Project',
    slug: 'bravur-fcc',
    description: 'Fourth project in FreeCodeCamp\'s Front End certification',
    longDescription: 'Advanced FreeCodeCamp certification project demonstrating mastery of React and modern JavaScript patterns. Implements complex state management and component interactions.',
    technologies: ['React', 'JavaScript', 'CSS'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2024-04-15',
    dateCompleted: '2024-05-01',
    githubUrl: 'https://github.com/NerajnoLearning/bRavur-4-FCC_FEDLC',
    phase: 'archived',
    screenshot: '/images/screenshots/bravur.png',
    gallery: ['/images/screenshots/bravur.png'],
    features: [
      'React components',
      'Complex state management',
      'Props and data flow',
      'Event handling',
      'Conditional rendering',
      'List rendering'
    ],
    learnings: [
      'React best practices',
      'Component composition',
      'Lifting state up',
      'React hooks usage',
      'Prop drilling solutions'
    ],
    challenges: [
      'Complex state management',
      'Component communication',
      'Performance optimization',
      'Preventing unnecessary re-renders'
    ],
    tags: ['react', 'freecodecamp', 'certification', 'frontend', 'hooks'],
    featured: false,
  },
  {
    id: '19',
    title: 'Toppur FCC Project',
    short: 'Front-End Development Library Certification project #5',
    dateCreated: '2024-06-01',
    learned: [
      'Final FCC certification project',
      'Full application development',
      'Pulling everything together',
    ],
    altText: 'Toppur FCC Project',
    slug: 'toppur-fcc',
    description: 'Fifth and final FCC Front End Libraries certification project',
    longDescription: 'Capstone project for FreeCodeCamp\'s Front End Development Libraries certification. Demonstrates comprehensive understanding of modern front-end development, React, and JavaScript.',
    technologies: ['React', 'JavaScript', 'CSS', 'HTML'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2024-05-15',
    dateCompleted: '2024-06-01',
    githubUrl: 'https://github.com/NerajnoLearning/NerajnoLearning-sToppur-5-FCC_FEDLC',
    phase: 'archived',
    screenshot: '/images/screenshots/toppur.png',
    gallery: ['/images/screenshots/toppur.png'],
    features: [
      'Complete React application',
      'Multiple components',
      'State and props management',
      'User interactions',
      'Responsive design',
      'All user stories implemented'
    ],
    learnings: [
      'End-to-end React development',
      'Application architecture',
      'Component design patterns',
      'Testing user stories',
      'Certification standards'
    ],
    challenges: [
      'Meeting all requirements',
      'Complex state management',
      'Component organization',
      'Final certification standards'
    ],
    tags: ['react', 'freecodecamp', 'certification', 'capstone', 'frontend'],
    featured: true,
    retrospective: 'Completing this project earned me the FCC Front End Libraries certification. Great feeling of accomplishment and validation of my React skills!'
  },
  {
    id: '20',
    title: 'Current Portfolio 2023',
    short: 'Portfolio website iteration from 2023',
    dateCreated: '2024-03-15',
    learned: [
      'Portfolio design principles',
      'HTML and CSS best practices',
      'Responsive layouts',
    ],
    altText: 'Portfolio 2023',
    slug: 'portfolio-2023',
    description: 'Previous iteration of personal portfolio',
    longDescription: 'The 2023 version of my portfolio website. Built with vanilla HTML, CSS, and JavaScript before transitioning to modern frameworks. Served as my professional presence for over a year.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    category: 'frontend',
    status: 'archived',
    difficulty: 'beginner',
    dateStarted: '2024-02-01',
    dateCompleted: '2024-03-15',
    sunsetDate: '2024-08-01',
    githubUrl: 'https://github.com/Nerajno/Current_Portfolio_2023',
    phase: 'sunset',
    screenshot: '/images/screenshots/portfolio-2023.png',
    gallery: ['/images/screenshots/portfolio-2023.png'],
    features: [
      'Project showcase',
      'About section',
      'Contact form',
      'Responsive design',
      'Simple animations',
      'SEO optimized'
    ],
    learnings: [
      'Portfolio best practices',
      'Vanilla JS DOM manipulation',
      'CSS animations',
      'Responsive design patterns',
      'Contact form handling',
      'Personal branding'
    ],
    challenges: [
      'Making it stand out',
      'Balancing design and content',
      'Cross-browser testing',
      'Loading performance',
      'Form validation'
    ],
    tags: ['portfolio', 'html', 'css', 'javascript', 'personal'],
    featured: false,
    retrospective: 'This portfolio served me well in 2023. Eventually needed more features and better performance, leading to the Astro rebuild.'
  },
  {
    id: '21',
    title: 'Hosted Blog V3',
    short: 'Vue-based personal blog, third iteration',
    dateCreated: '2023-12-31',
    learned: [
      'Vue.js application structure',
      'Blog architecture',
      'TypeScript in Vue',
      'Content management',
    ],
    altText: 'Hosted Blog V3',
    slug: 'hosted-blog-v3',
    description: 'Third version of my personal blog built with Vue',
    longDescription: 'The third iteration of my personal blog, rebuilt with Vue.js and TypeScript. Features markdown support, tagging system, and search functionality. Evolved through multiple versions to find the right balance.',
    technologies: ['TypeScript', 'Vue', 'Markdown', 'CSS'],
    category: 'frontend',
    status: 'archived',
    difficulty: 'intermediate',
    dateStarted: '2023-12-01',
    dateCompleted: '2023-12-31',
    sunsetDate: '2024-06-01',
    githubUrl: 'https://github.com/Nerajno/hosted_Blog_v3',
    phase: 'sunset',
    screenshot: '/images/screenshots/blog-v3.png',
    gallery: ['/images/screenshots/blog-v3.png'],
    features: [
      'Markdown blog posts',
      'Tag system',
      'Search functionality',
      'Responsive design',
      'RSS feed',
      'Syntax highlighting'
    ],
    learnings: [
      'Vue Router usage',
      'Markdown processing in Vue',
      'Blog architecture patterns',
      'SEO optimization',
      'Content management strategies'
    ],
    challenges: [
      'Markdown rendering',
      'Search implementation',
      'SEO optimization',
      'Content organization',
      'RSS feed generation'
    ],
    tags: ['vue', 'blog', 'typescript', 'markdown', 'content'],
    featured: false,
  },
  {
    id: '22',
    title: 'Astro Blog',
    short: 'Blog experiment with Astro static site generator',
    dateCreated: '2024-01-27',
    learned: [
      'Astro fundamentals',
      'Static site generation',
      'Content collections',
    ],
    altText: 'Astro Blog',
    slug: 'astro-blog',
    description: 'Experimental blog built with Astro SSG',
    longDescription: 'Experimented with Astro for building a static blog. Learned about Astro\'s content collections and static site generation capabilities. This experiment led to adopting Astro for other projects.',
    technologies: ['Astro', 'Markdown', 'JavaScript', 'CSS'],
    category: 'frontend',
    status: 'archived',
    difficulty: 'beginner',
    dateStarted: '2024-01-15',
    dateCompleted: '2024-01-27',
    sunsetDate: '2024-03-01',
    githubUrl: 'https://github.com/Nerajno/blog-Astro',
    phase: 'sunset',
    screenshot: '/images/screenshots/astro-blog.png',
    gallery: ['/images/screenshots/astro-blog.png'],
    features: [
      'Static site generation',
      'Markdown blog posts',
      'Fast page loads',
      'SEO friendly',
      'RSS feed',
      'Zero JS by default'
    ],
    learnings: [
      'Astro basics and philosophy',
      'Content collections API',
      'Static generation benefits',
      'Markdown frontmatter',
      'Build optimization'
    ],
    challenges: [
      'Learning new framework',
      'Migration from Vue',
      'Content structure design',
      'Deployment setup'
    ],
    tags: ['astro', 'blog', 'static-site', 'markdown', 'ssg'],
    featured: false,
  },
  {
    id: '23',
    title: 'MDX Blog with Next.js',
    short: 'Self-hosted blog with TypeScript and MDX',
    dateCreated: '2024-01-27',
    learned: [
      'Next.js framework',
      'MDX for blog posts',
      'TypeScript configuration',
      'Server-side rendering',
    ],
    altText: 'Next.js MDX Blog',
    slug: 'nextjs-mdx-blog',
    description: 'Modern blog built with Next.js, TypeScript, and MDX',
    longDescription: 'Forked and customized a Next.js blog template using MDX for content. Features TypeScript for type safety and Tailwind CSS for styling. Explored the Next.js ecosystem and MDX capabilities.',
    technologies: ['TypeScript', 'Next.js', 'MDX', 'Tailwind CSS', 'React'],
    category: 'frontend',
    status: 'archived',
    difficulty: 'intermediate',
    dateStarted: '2024-01-15',
    dateCompleted: '2024-01-27',
    sunsetDate: '2024-04-01',
    githubUrl: 'https://github.com/Nerajno/My-Self-hosted-TypeScript-Mdx-blog',
    phase: 'sunset',
    screenshot: '/images/screenshots/nextjs-blog.png',
    gallery: ['/images/screenshots/nextjs-blog.png'],
    features: [
      'MDX blog posts',
      'TypeScript throughout',
      'Tailwind CSS styling',
      'Server-side rendering',
      'Code syntax highlighting',
      'Dark mode'
    ],
    learnings: [
      'Next.js fundamentals',
      'MDX capabilities and limitations',
      'Server-side rendering concepts',
      'TypeScript in Next.js',
      'Tailwind integration'
    ],
    challenges: [
      'MDX configuration complexity',
      'TypeScript types for MDX',
      'SSR complexities',
      'Build optimization',
      'Deployment configuration'
    ],
    tags: ['nextjs', 'typescript', 'mdx', 'blog', 'tailwind', 'react'],
    featured: false,
  },
  {
    id: '24',
    title: 'CV Website',
    short: 'Print-friendly, minimalist CV page',
    dateCreated: '2023-12-27',
    learned: [
      'Print CSS',
      'Minimalist design',
      'CV best practices',
    ],
    altText: 'CV Website',
    slug: 'cv-website',
    description: 'Minimalist CV webpage optimized for printing',
    longDescription: 'Forked and customized a minimalist CV template. Features print-optimized CSS and clean, professional design. Built with TypeScript and modern tooling for a single-page resume.',
    technologies: ['TypeScript', 'CSS', 'HTML', 'Print CSS'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'beginner',
    dateStarted: '2023-12-20',
    dateCompleted: '2023-12-27',
    githubUrl: 'https://github.com/Nerajno/cv',
    phase: 'active',
    screenshot: '/images/screenshots/cv.png',
    gallery: ['/images/screenshots/cv.png'],
    features: [
      'Print-optimized layout',
      'One-page design',
      'Professional typography',
      'Easy to update',
      'PDF export ready',
      'Clean minimalist design'
    ],
    learnings: [
      'Print CSS media queries',
      'Minimalist design principles',
      'CV content organization',
      'Typography for print',
      'Template customization'
    ],
    challenges: [
      'Print layout perfection',
      'Fitting content in one page',
      'Cross-browser print support',
      'Maintaining readability',
      'Page break control'
    ],
    tags: ['cv', 'resume', 'typescript', 'print-css', 'minimalist'],
    featured: false,
  },

  // FULLSTACK PROJECTS
  {
    id: '25',
    title: 'Trapper Keeper V1',
    short: 'Rails SPA CRUD-style address book for managing contacts',
    dateCreated: '2025-08-11',
    learned: [
      'Ruby on Rails fundamentals',
      'RESTful API design',
      'CRUD operations',
      'Single Page Application architecture',
    ],
    altText: 'Screenshot of Trapper Keeper',
    slug: 'trapper-keeper-v1',
    description: 'Contact management system built with Ruby on Rails',
    longDescription: 'A Single Page Application built with Rails for managing an address book. Implements full CRUD functionality for contact management with a clean API and responsive frontend.',
    technologies: ['Ruby', 'Ruby on Rails', 'JavaScript', 'PostgreSQL', 'Bootstrap'],
    category: 'fullstack',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2025-07-01',
    dateCompleted: '2025-08-11',
    githubUrl: 'https://github.com/Nerajno/Trapper_Keeper-v1',
    phase: 'archived',
    screenshot: '/images/screenshots/trapper-keeper.png',
    gallery: ['/images/screenshots/trapper-keeper.png'],
    features: [
      'Add, edit, delete contacts',
      'Search and filter contacts',
      'Category organization',
      'RESTful API',
      'SPA interface',
      'Data validation'
    ],
    learnings: [
      'Rails MVC architecture',
      'Building RESTful APIs',
      'Database relationships with ActiveRecord',
      'Authentication and authorization',
      'Front-end/back-end integration',
      'Rails conventions'
    ],
    challenges: [
      'Setting up Rails environment',
      'Database schema design',
      'API endpoint design',
      'State management in SPA',
      'CORS configuration'
    ],
    tags: ['ruby', 'rails', 'crud', 'api', 'fullstack', 'postgresql'],
    featured: true,
  },
  {
    id: '26',
    title: 'DevConnector 2.0',
    short: 'MERN stack social network for developers',
    dateCreated: '2023-06-08',
    learned: [
      'MERN stack development',
      'Full-stack application architecture',
      'Social media features',
      'JWT authentication',
    ],
    altText: 'DevConnector social network',
    slug: 'devconnector',
    description: 'Social networking platform for developers built with MERN stack',
    longDescription: 'Followed Brad Traversy\'s MERN stack course to build a full-featured social network for developers. Includes user profiles, posts, comments, likes, and GitHub integration. Complete authentication system with JWT.',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'Redux', 'JWT'],
    category: 'fullstack',
    status: 'completed',
    difficulty: 'advanced',
    dateStarted: '2023-05-01',
    dateCompleted: '2023-06-08',
    githubUrl: 'https://github.com/NerajnoLearning/devconnector_2.0',
    phase: 'archived',
    screenshot: '/images/screenshots/devconnector.png',
    gallery: ['/images/screenshots/devconnector.png'],
    features: [
      'User authentication and authorization',
      'Developer profiles with experience and education',
      'Posts and comments',
      'Like/unlike functionality',
      'GitHub repository integration',
      'Responsive design',
      'Private routes'
    ],
    learnings: [
      'Full MERN stack development',
      'Redux state management',
      'JWT authentication implementation',
      'RESTful API design',
      'MongoDB database design',
      'React hooks and context',
      'Express middleware'
    ],
    challenges: [
      'Managing complex application state',
      'Authentication flow implementation',
      'Database relationships',
      'Deployment configuration',
      'GitHub API integration'
    ],
    tags: ['mern', 'mongodb', 'express', 'react', 'nodejs', 'fullstack', 'redux'],
    featured: true,
    retrospective: 'This project tied together all aspects of full-stack development. Brad Traversy\'s course is excellent for learning MERN. Building a complete social network taught me about scalable architecture and real-world patterns.'
  },
  {
    id: '27',
    title: 'Frontend Final Project',
    short: 'Capstone project for Flatiron School bootcamp',
    dateCreated: '2023-03-15',
    learned: [
      'Bootcamp best practices',
      'Full application development',
      'Project presentation skills',
      'Team collaboration',
    ],
    altText: 'Frontend Final Project',
    slug: 'frontend-final-project',
    description: 'Final project for Flatiron School front-end program',
    longDescription: 'Capstone project demonstrating all skills learned during the Flatiron School bootcamp. Built a complete application from planning through deployment, presenting to instructors and peers.',
    technologies: ['JavaScript', 'React', 'CSS', 'REST API', 'Git'],
    category: 'fullstack',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2023-02-15',
    dateCompleted: '2023-03-15',
    githubUrl: 'https://github.com/Nerajno/frontend_final_project',
    phase: 'archived',
    screenshot: '/images/screenshots/frontend-final.png',
    gallery: ['/images/screenshots/frontend-final.png'],
    features: [
      'Full CRUD functionality',
      'User authentication',
      'API integration',
      'Responsive design',
      'State management',
      'Error handling'
    ],
    learnings: [
      'End-to-end development process',
      'Project planning and scoping',
      'Presentation skills',
      'Code review process',
      'Deployment strategies',
      'Professional development workflow'
    ],
    challenges: [
      'Time constraints',
      'Scope management',
      'Bug fixing under pressure',
      'Presenting technical work',
      'Meeting bootcamp standards'
    ],
    tags: ['javascript', 'react', 'bootcamp', 'capstone', 'flatiron'],
    featured: true,
  },
  {
    id: '28',
    title: 'Backend Final Project',
    short: 'Backend capstone for bootcamp certification',
    dateCreated: '2023-10-24',
    learned: [
      'Backend architecture',
      'Database design',
      'API development',
      'Authentication systems',
    ],
    altText: 'Backend Final Project',
    slug: 'backend-final-project',
    description: 'Final backend project for bootcamp completion',
    longDescription: 'Built a complete backend system with database, RESTful API, and authentication as the final project for bootcamp certification. Demonstrates mastery of server-side development.',
    technologies: ['Ruby', 'Rails', 'PostgreSQL', 'REST API', 'JWT'],
    category: 'backend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2023-10-01',
    dateCompleted: '2023-10-24',
    githubUrl: 'https://github.com/Nerajno/backend_final-project',
    phase: 'archived',
    screenshot: '/images/screenshots/backend-final.png',
    gallery: ['/images/screenshots/backend-final.png'],
    features: [
      'RESTful API',
      'Database with complex relationships',
      'User authentication and authorization',
      'Authorization rules',
      'API documentation',
      'Comprehensive test suite'
    ],
    learnings: [
      'Rails API mode',
      'Database schema design with migrations',
      'Authentication systems',
      'API versioning',
      'Testing strategies with RSpec',
      'Security best practices'
    ],
    challenges: [
      'Complex database relationships',
      'Security implementation',
      'Performance optimization',
      'Comprehensive testing',
      'API documentation'
    ],
    tags: ['ruby', 'rails', 'backend', 'api', 'bootcamp', 'postgresql'],
    featured: true,
  },
  {
    id: '29',
    title: 'Native Treats API',
    short: 'API for managing local treats and food items',
    dateCreated: '2023-09-21',
    learned: [
      'API development',
      'Data modeling',
      'Backend patterns',
      'MongoDB usage',
    ],
    altText: 'Native Treats API',
    slug: 'native-treats-api',
    description: 'RESTful API for cataloging regional treats and foods',
    longDescription: 'Built a RESTful API to catalog and manage information about regional treats and local food items. Features search, filtering, and user contributions with geographic data.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'REST API'],
    category: 'backend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2023-09-01',
    dateCompleted: '2023-09-21',
    githubUrl: 'https://github.com/Nerajno/Native_treats_api',
    phase: 'archived',
    screenshot: '/images/screenshots/native-treats.png',
    gallery: ['/images/screenshots/native-treats.png'],
    features: [
      'CRUD operations',
      'Search and filtering',
      'Geographic data handling',
      'User contributions',
      'API documentation',
      'Rate limiting'
    ],
    learnings: [
      'Express.js fundamentals',
      'MongoDB queries and aggregation',
      'API design patterns',
      'Data validation with Joi',
      'Error handling middleware',
      'API security'
    ],
    challenges: [
      'Geographic data handling',
      'Search optimization',
      'Data consistency',
      'API rate limiting',
      'Documentation maintenance'
    ],
    tags: ['nodejs', 'express', 'mongodb', 'api', 'backend'],
    featured: false,
  },
  {
    id: '30',
    title: 'JP Morgan Forage Program',
    short: 'Software engineering virtual experience program tasks',
    dateCreated: '2023-07-10',
    learned: [
      'Financial data visualization',
      'Python for finance',
      'Real-world software engineering',
      'Working with existing codebases',
    ],
    altText: 'JP Morgan Forage tasks',
    slug: 'jpmc-forage',
    description: 'Completed JP Morgan Chase Software Engineering virtual experience',
    longDescription: 'Worked through JP Morgan Chase\'s software engineering virtual experience program on Forage, completing real-world tasks involving financial data processing and visualization. Gained insight into enterprise software development.',
    technologies: ['Python', 'React', 'TypeScript', 'Financial APIs', 'Git'],
    category: 'fullstack',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2023-07-01',
    dateCompleted: '2023-07-10',
    githubUrl: 'https://github.com/Nerajno/forage-jpmc-swe-task-2',
    phase: 'archived',
    screenshot: '/images/screenshots/jpmc.png',
    gallery: ['/images/screenshots/jpmc.png'],
    features: [
      'Live data feeds',
      'Financial data processing',
      'Real-time charts',
      'Stock price monitoring',
      'Data correlation analysis',
      'Graph visualization'
    ],
    learnings: [
      'Working with financial data',
      'Real-time data processing',
      'Chart implementation',
      'Professional codebase navigation',
      'Industry coding standards',
      'Enterprise development practices'
    ],
    challenges: [
      'Understanding financial concepts',
      'Working with existing codebases',
      'Real-time data handling',
      'Meeting enterprise standards',
      'Time-series data visualization'
    ],
    tags: ['python', 'finance', 'internship', 'jpmorgan', 'forage', 'enterprise'],
    featured: false,
  },

  // EDUCATION & LEARNING PROJECTS
  {
    id: '31',
    title: 'CS50P Final Project',
    short: 'Final project for Harvard\'s CS50 Python course',
    dateCreated: '2024-08-02',
    learned: [
      'Python programming fundamentals',
      'Problem-solving with code',
      'Software engineering principles',
      'Testing methodologies',
    ],
    altText: 'CS50P Final Project',
    slug: 'cs50p-final',
    description: 'Capstone project for Harvard CS50\'s Introduction to Programming with Python',
    longDescription: 'Final project submission for Harvard\'s CS50P course. Demonstrates understanding of Python fundamentals, data structures, and problem-solving. Includes comprehensive testing and documentation.',
    technologies: ['Python', 'pytest', 'CLI'],
    category: 'backend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2024-07-01',
    dateCompleted: '2024-08-02',
    githubUrl: 'https://github.com/NerajnoLearning/CS50P-Final_Project',
    phase: 'archived',
    screenshot: '/images/screenshots/cs50p.png',
    gallery: ['/images/screenshots/cs50p.png'],
    features: [
      'Command-line interface',
      'File I/O operations',
      'Data processing',
      'Error handling',
      'Comprehensive unit tests',
      'Professional documentation'
    ],
    learnings: [
      'Python fundamentals and idioms',
      'Problem decomposition',
      'Testing methodologies with pytest',
      'Documentation practices',
      'Code organization',
      'Academic integrity'
    ],
    challenges: [
      'Meeting CS50 requirements',
      'Writing comprehensive tests',
      'Project scoping appropriately',
      'Time management',
      'Clear documentation'
    ],
    tags: ['python', 'cs50', 'harvard', 'certification', 'education'],
    featured: true,
    retrospective: 'CS50 taught me to think like a programmer. The final project brought everything together and proved I could build something from scratch. David Malan is an incredible teacher.'
  },
  {
    id: '32',
    title: '100 Days of Code Log',
    short: 'Daily log of 100 days of consistent coding practice',
    dateCreated: '2024-08-02',
    learned: [
      'Consistency and discipline',
      'Daily practice importance',
      'Public accountability',
      'Habit formation',
    ],
    altText: '100 Days of Code Log',
    slug: '100-days-of-code',
    description: 'Documentation of my 100 Days of Code challenge journey',
    longDescription: 'Committed to coding every day for 100 days and documenting the journey. Tracked progress, learnings, and challenges faced during the challenge. Public accountability drove consistency.',
    technologies: ['Various', 'Git', 'Markdown'],
    category: 'design',
    status: 'completed',
    difficulty: 'beginner',
    dateStarted: '2024-05-01',
    dateCompleted: '2024-08-02',
    githubUrl: 'https://github.com/Nerajno/100DaysOfCodeLog',
    phase: 'archived',
    screenshot: '/images/screenshots/100days.png',
    gallery: ['/images/screenshots/100days.png'],
    features: [
      'Daily log entries',
      'Progress tracking',
      'Learning highlights',
      'Resource links',
      'Reflection notes',
      'Project links'
    ],
    learnings: [
      'Power of consistency',
      'Building sustainable habits',
      'Public accountability benefits',
      'Documentation skills',
      'Perseverance and grit',
      'Learning in public'
    ],
    challenges: [
      'Maintaining daily streak',
      'Finding time every day',
      'Staying motivated',
      'Documenting consistently',
      'Balancing quality and quantity'
    ],
    tags: ['challenge', '100daysofcode', 'learning', 'documentation', 'habit'],
    featured: true,
    retrospective: 'The 100 Days of Code challenge transformed my learning approach. Consistency beats intensity every time. The public commitment kept me accountable even on tough days.'
  },
  {
    id: '33',
    title: 'FreeCodeCamp Fork',
    short: 'Personal fork of FreeCodeCamp for learning and contributions',
    dateCreated: '2024-01-01',
    learned: [
      'Open source contribution',
      'Large codebase navigation',
      'Community development',
    ],
    altText: 'FreeCodeCamp Fork',
    slug: 'freecodecamp-fork',
    description: 'Forked FreeCodeCamp repo for learning and potential contributions',
    longDescription: 'Forked the FreeCodeCamp repository to study the codebase, work through challenges, and understand how a large open-source education platform is built. Learned about community-driven development.',
    technologies: ['TypeScript', 'React', 'Node.js', 'MongoDB', 'Gatsby'],
    category: 'fullstack',
    status: 'archived',
    difficulty: 'advanced',
    dateStarted: '2023-12-01',
    dateCompleted: '2024-01-01',
    githubUrl: 'https://github.com/Nerajno/freeCodeCamp',
    phase: 'archived',
    screenshot: '/images/screenshots/fcc-fork.png',
    gallery: ['/images/screenshots/fcc-fork.png'],
    features: [
      'Complete curriculum platform',
      'Interactive challenges',
      'Certification system',
      'Community features',
      'Open source codebase'
    ],
    learnings: [
      'Large codebase navigation',
      'Open source workflows',
      'Community contribution processes',
      'Education platform architecture',
      'Code review processes',
      'Monorepo management'
    ],
    challenges: [
      'Understanding massive codebase',
      'Setting up development environment',
      'Following contribution guidelines',
      'Finding good first issues',
      'Understanding project structure'
    ],
    tags: ['opensource', 'freecodecamp', 'education', 'fork', 'learning'],
    featured: false,
  },
  {
    id: '34',
    title: 'Redux Reducer Bootcamp Exercise',
    short: 'Flatiron School Redux exercise for state management',
    dateCreated: '2023-04-12',
    learned: [
      'Redux fundamentals',
      'State management patterns',
      'Reducer composition',
      'Immutability concepts',
    ],
    altText: 'Redux Reducer Exercise',
    slug: 'redux-reducer-exercise',
    description: 'Bootcamp exercise focusing on Redux reducers and state',
    longDescription: 'Completed bootcamp exercise on Redux reducers, learning state management patterns and how to build scalable React applications with predictable state.',
    technologies: ['JavaScript', 'React', 'Redux'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2023-04-10',
    dateCompleted: '2023-04-12',
    githubUrl: 'https://github.com/Nerajno/redux-reducer-atlanta-web-060319',
    phase: 'archived',
    screenshot: '/images/screenshots/redux-exercise.png',
    gallery: ['/images/screenshots/redux-exercise.png'],
    features: [
      'Reducer functions',
      'Action creators',
      'State management',
      'Redux patterns',
      'Testing reducers'
    ],
    learnings: [
      'Redux core concepts',
      'Pure functions importance',
      'Immutable state updates',
      'Action types and creators',
      'Store configuration',
      'Redux debugging'
    ],
    challenges: [
      'Understanding Redux flow',
      'Immutability concepts',
      'Debugging state changes',
      'Testing strategies',
      'Avoiding common pitfalls'
    ],
    tags: ['redux', 'javascript', 'react', 'bootcamp', 'state-management'],
    featured: false,
  },
  {
    id: '35',
    title: 'Folkmusic Contribution',
    short: 'Open source contribution to Folkmusic.com project',
    dateCreated: '2023-06-08',
    learned: [
      'Open source contribution',
      'CSS improvements',
      'Collaborative development',
    ],
    altText: 'Folkmusic Contribution',
    slug: 'folkmusic-contribution',
    description: 'Contributed improvements to isolated parts of folkmusic.com',
    longDescription: 'Made open source contributions to the Folkmusic.com project, focusing on CSS improvements and isolated component enhancements. First significant open source contribution.',
    technologies: ['CSS', 'HTML', 'JavaScript'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'beginner',
    dateStarted: '2023-06-01',
    dateCompleted: '2023-06-08',
    githubUrl: 'https://github.com/Nerajno/folkmusic',
    phase: 'archived',
    screenshot: '/images/screenshots/folkmusic.png',
    gallery: ['/images/screenshots/folkmusic.png'],
    features: [
      'CSS improvements',
      'Component enhancements',
      'Responsive fixes',
      'Code cleanup',
      'Documentation updates'
    ],
    learnings: [
      'Contributing to existing projects',
      'Code review feedback process',
      'Git collaborative workflows',
      'CSS best practices',
      'Community collaboration etiquette'
    ],
    challenges: [
      'Understanding project structure',
      'Following project style guides',
      'Getting reviews approved',
      'Working with project maintainers',
      'Making meaningful contributions'
    ],
    tags: ['opensource', 'css', 'contribution', 'collaboration'],
    featured: false,
  },
  {
    id: '36',
    title: 'GitHub Actions for CI',
    short: 'Learning GitHub Actions for continuous integration',
    dateCreated: '2023-04-01',
    learned: [
      'GitHub Actions workflow',
      'CI/CD pipelines',
      'Automated testing',
      'DevOps basics',
    ],
    altText: 'GitHub Actions CI',
    slug: 'github-actions-ci',
    description: 'Project for learning GitHub Actions and CI/CD practices',
    longDescription: 'Explored GitHub Actions by building automated workflows for continuous integration. Learned how to set up testing, linting, and deployment pipelines.',
    technologies: ['GitHub Actions', 'YAML', 'CI/CD', 'Node.js'],
    category: 'backend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2023-03-15',
    dateCompleted: '2023-04-01',
    githubUrl: 'https://github.com/Nerajno/github-actions-for-ci',
    phase: 'archived',
    screenshot: '/images/screenshots/github-actions.png',
    gallery: ['/images/screenshots/github-actions.png'],
    features: [
      'Automated testing',
      'Lint checks',
      'Build automation',
      'Deployment workflows',
      'Status badges',
      'Matrix builds'
    ],
    learnings: [
      'GitHub Actions syntax',
      'YAML configuration',
      'CI/CD best practices',
      'Workflow triggers',
      'Secret management',
      'Action marketplace'
    ],
    challenges: [
      'Understanding workflow syntax',
      'Debugging failed actions',
      'Environment setup',
      'Managing secrets securely',
      'Optimizing build times'
    ],
    tags: ['github-actions', 'cicd', 'automation', 'devops'],
    featured: false,
  },
  {
    id: '37',
    title: 'Connect Tech 2021 Conference App',
    short: 'Conference workshop application from Connect Tech 2021',
    dateCreated: '2023-04-01',
    learned: [
      'Conference workshop patterns',
      'TypeScript in practice',
      'React best practices',
    ],
    altText: 'Connect Tech Conference App',
    slug: 'connect-tech-2021',
    description: 'Workshop app from Connect Tech 2021 conference',
    longDescription: 'Built along with workshop at Connect Tech 2021 conference. Learned modern React patterns and TypeScript best practices from industry experts in a hands-on setting.',
    technologies: ['TypeScript', 'React', 'JavaScript'],
    category: 'frontend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2023-03-25',
    dateCompleted: '2023-04-01',
    githubUrl: 'https://github.com/NerajnoLearning/conf-app-connecttech-2021',
    phase: 'archived',
    screenshot: '/images/screenshots/connect-tech.png',
    gallery: ['/images/screenshots/connect-tech.png'],
    features: [
      'Conference schedule display',
      'Session management',
      'Speaker profiles',
      'Interactive features',
      'TypeScript types',
      'Responsive design'
    ],
    learnings: [
      'Conference app patterns',
      'TypeScript advanced types',
      'React performance optimization',
      'Workshop learning techniques',
      'Industry best practices',
      'Networking at conferences'
    ],
    challenges: [
      'Following workshop pace',
      'TypeScript complexity',
      'Time constraints',
      'Keeping up with code-along',
      'Asking good questions'
    ],
    tags: ['typescript', 'react', 'conference', 'workshop'],
    featured: false,
  },
  {
    id: '38',
    title: 'TDD Big Picture',
    short: 'Learning Test-Driven Development concepts and practices',
    dateCreated: '2023-02-01',
    learned: [
      'TDD methodology',
      'Testing patterns',
      'C# fundamentals',
      'Red-Green-Refactor cycle',
    ],
    altText: 'TDD Big Picture Course',
    slug: 'tdd-big-picture',
    description: 'Pluralsight course on Test-Driven Development fundamentals',
    longDescription: 'Completed the "Test-driven Development: The Big Picture" course on Pluralsight. Learned TDD principles, red-green-refactor cycle, and testing best practices using C#.',
    technologies: ['C#', 'Testing', 'TDD', 'xUnit'],
    category: 'backend',
    status: 'completed',
    difficulty: 'intermediate',
    dateStarted: '2023-01-15',
    dateCompleted: '2023-02-01',
    githubUrl: 'https://github.com/NerajnoLearning/TDD-TheBigPicture',
    phase: 'archived',
    screenshot: '/images/screenshots/tdd-course.png',
    gallery: ['/images/screenshots/tdd-course.png'],
    features: [
      'TDD examples',
      'Unit tests',
      'Red-Green-Refactor demonstrations',
      'Testing patterns',
      'Course exercises'
    ],
    learnings: [
      'TDD methodology and benefits',
      'Writing tests first',
      'Refactoring safely with tests',
      'Test organization',
      'C# testing frameworks',
      'When to use TDD'
    ],
    challenges: [
      'Thinking test-first',
      'Learning C# syntax',
      'Understanding mocking',
      'Test coverage balance',
      'Discipline to follow TDD'
    ],
    tags: ['tdd', 'testing', 'csharp', 'pluralsight', 'course'],
    featured: false,
  },
  {
    id: '39',
    title: '.NET Tools Exploration',
    short: 'Exploring ASP.NET command line tools and utilities',
    dateCreated: '2023-01-01',
    learned: [
      '.NET ecosystem',
      'Command line tools',
      'C# development',
    ],
    altText: '.NET Tools',
    slug: 'dotnet-tools',
    description: 'Forked repo exploring various .NET command line tools',
    longDescription: 'Explored Microsoft\'s .NET command line tools collection. Learned about the .NET ecosystem, CLI utilities, and ASP.NET development workflows.',
    technologies: ['C#', '.NET', 'ASP.NET', 'CLI'],
    category: 'backend',
    status: 'archived',
    difficulty: 'beginner',
    dateStarted: '2022-12-15',
    dateCompleted: '2023-01-01',
    githubUrl: 'https://github.com/NerajnoLearning/DotNetTools',
    phase: 'archived',
    screenshot: '/images/screenshots/dotnet-tools.png',
    gallery: ['/images/screenshots/dotnet-tools.png'],
    features: [
      'CLI tools exploration',
      'Development utilities',
      'Build tools',
      'Code generators',
      'Template systems'
    ],
    learnings: [
      '.NET CLI basics',
      'Tool installation and usage',
      'Project templates',
      'NuGet package management',
      'Development workflows',
      'Cross-platform .NET'
    ],
    challenges: [
      'Understanding .NET ecosystem',
      'Windows vs cross-platform differences',
      'Tool configuration',
      'Version management',
      'Documentation navigation'
    ],
    tags: ['dotnet', 'csharp', 'cli', 'tools', 'microsoft'],
    featured: false,
  },
  {
    id: '40',
    title: 'Yup Nosey',
    short: 'Experimental project exploring curiosity-driven development',
    dateCreated: '2025-03-02',
    learned: [
      'Experimental development',
      'Rapid prototyping',
      'Curiosity-driven coding',
    ],
    altText: 'Yup Nosey Project',
    slug: 'yup-nosey',
    description: 'Curiosity-driven experimental project',
    longDescription: 'An experimental project built out of curiosity to explore new ideas and technologies. Sometimes the best learning comes from just being nosey and trying things out without a specific goal.',
    technologies: ['JavaScript', 'Experimental'],
    category: 'frontend',
    status: 'archived',
    difficulty: 'beginner',
    dateStarted: '2025-02-15',
    dateCompleted: '2025-03-02',
    sunsetDate: '2025-03-15',
    githubUrl: 'https://github.com/Nerajno/yup-nosey',
    phase: 'sunset',
    screenshot: '/images/screenshots/yup-nosey.png',
    gallery: ['/images/screenshots/yup-nosey.png'],
    features: [
      'Experimental features',
      'Rapid prototyping',
      'Quick iterations',
      'Learning by doing',
      'No strict requirements'
    ],
    learnings: [
      'Value of experimentation',
      'Learning through exploration',
      'Prototyping quickly',
      'Being comfortable with uncertainty',
      'Embracing curiosity',
      'Failure as learning'
    ],
    challenges: [
      'Lack of clear goals',
      'Scope creep',
      'Knowing when to stop',
      'Documenting chaotic exploration'
    ],
    tags: ['experimental', 'prototype', 'learning', 'curiosity'],
    featured: false,
    retrospective: 'Not every project needs a grand purpose. Sometimes you just need to be nosey and see what happens. This project taught me to embrace experimentation.'
  },
  {
    id: '41',
    title: 'Gulp Jest Plugin',
    short: 'Gulp plugin for running Jest tests in build pipeline',
    dateCreated: '2022-08-01',
    learned: [
      'Gulp task runners',
      'Plugin development',
      'Build automation',
      'Stream processing',
    ],
    altText: 'Gulp Jest Plugin',
    slug: 'gulp-jest',
    description: 'Gulp plugin integration for Jest testing framework',
    longDescription: 'Explored creating a Gulp plugin for the Jest testing library. Learned about build automation, task runners, and plugin architecture patterns.',
    technologies: ['JavaScript', 'Gulp', 'Jest', 'Node.js', 'Streams'],
    category: 'backend',
    status: 'archived',
    difficulty: 'advanced',
    dateStarted: '2022-07-15',
    dateCompleted: '2022-08-01',
    githubUrl: 'https://github.com/Nerajno/gulp-jest',
    phase: 'archived',
    screenshot: '/images/screenshots/gulp-jest.png',
    gallery: ['/images/screenshots/gulp-jest.png'],
    features: [
      'Gulp task integration',
      'Jest test runner',
      'Build pipeline integration',
      'Configuration options',
      'Error reporting',
      'Watch mode support'
    ],
    learnings: [
      'Gulp plugin architecture',
      'Stream processing in Node.js',
      'Build tool integration',
      'Testing automation',
      'Plugin development patterns',
      'NPM package publishing'
    ],
    challenges: [
      'Understanding Gulp streams',
      'Jest integration complexity',
      'Error handling in streams',
      'Configuration management',
      'Testing the plugin itself'
    ],
    tags: ['gulp', 'jest', 'testing', 'build-tools', 'plugin', 'nodejs'],
    featured: false,
  },
  {
    id: '42',
    title: 'GitHub Profile README',
    short: 'GitHub profile README with stats and info',
    dateCreated: '2025-03-23',
    learned: [
      'GitHub profile customization',
      'Markdown formatting',
      'Personal branding',
    ],
    altText: 'GitHub Profile README',
    slug: 'github-profile',
    description: 'Custom GitHub profile README with stats and links',
    longDescription: 'Created a custom GitHub profile README to showcase projects, skills, and contributions. Features stats, badges, and links to various profiles. A living document that represents my developer brand.',
    technologies: ['Markdown', 'GitHub', 'Shields.io'],
    category: 'design',
    status: 'in-progress',
    difficulty: 'beginner',
    dateStarted: '2025-03-20',
    githubUrl: 'https://github.com/Nerajno/nerajno',
    phase: 'active',
    screenshot: '/images/screenshots/github-profile.png',
    gallery: ['/images/screenshots/github-profile.png'],
    features: [
      'GitHub stats display',
      'Tech stack showcase',
      'Social links',
      'Featured projects',
      'Activity badges',
      'Visitor counter'
    ],
    learnings: [
      'GitHub profile features',
      'Markdown advanced formatting',
      'Personal branding online',
      'Stats API integration',
      'Visual presentation in markdown',
      'README best practices'
    ],
    challenges: [
      'Making it stand out',
      'Keeping it updated',
      'Balancing information density',
      'Visual design in markdown limitations',
      'Badge selection'
    ],
    tags: ['github', 'markdown', 'profile', 'personal-brand', 'readme'],
    featured: false,
  },
];

// UTILITY FUNCTIONS FOR WORKING WITH PROJECTS
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

export function getProjectsByPhase(phase: string): Project[] {
  return projects.filter(project => project.phase === phase);
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
    project.longDescription.toLowerCase().includes(lowercaseQuery) ||
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

export function getUniqueTags(): string[] {
  const allTags = projects.flatMap(project => project.tags);
  return [...new Set(allTags)].sort();
}

export function getProjectStats() {
  return {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    planned: projects.filter(p => p.status === 'planned').length,
    archived: projects.filter(p => p.status === 'archived').length,
    active: projects.filter(p => p.phase === 'active').length,
    sunset: projects.filter(p => p.phase === 'sunset').length,
    technologies: getUniqueTechnologies().length,
    categories: getUniqueCategories().length,
    tags: getUniqueTags().length,
  };
}

// Get projects by year
export function getProjectsByYear(year: number): Project[] {
  return projects.filter(project => {
    const projectYear = new Date(project.dateCreated || project.dateStarted).getFullYear();
    return projectYear === year;
  });
}

// Get all years with projects
export function getProjectYears(): number[] {
  const years = projects.map(project =>
    new Date(project.dateCreated || project.dateStarted).getFullYear()
  );
  return [...new Set(years)].sort((a, b) => b - a);
}

// Get projects by difficulty
export function getProjectsByDifficulty(difficulty: string): Project[] {
  return projects.filter(project => project.difficulty === difficulty);
}

// Get recent projects (last n projects)
export function getRecentProjects(count: number = 5): Project[] {
  return [...projects]
    .sort((a, b) => {
      const dateA = new Date(a.dateCreated || a.dateStarted).getTime();
      const dateB = new Date(b.dateCreated || b.dateStarted).getTime();
      return dateB - dateA;
    })
    .slice(0, count);
}

// Get projects by tag
export function getProjectsByTag(tag: string): Project[] {
  return projects.filter(project =>
    project.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

// Get related projects (by shared tags)
export function getRelatedProjects(projectId: string, limit: number = 3): Project[] {
  const project = projects.find(p => p.id === projectId);
  if (!project) return [];

  return projects
    .filter(p => p.id !== projectId)
    .map(p => ({
      project: p,
      score: p.tags.filter(tag => project.tags.includes(tag)).length
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.project);
}
