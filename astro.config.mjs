// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://your-domain.com', // Update with your actual domain
  build: {
    inlineStylesheets: 'auto',
  },
});