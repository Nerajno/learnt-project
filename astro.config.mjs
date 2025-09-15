// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import clarity from '@kbyte-tech/astro-clarity';

export default defineConfig({
  integrations: [
    tailwind(),
     clarity({
      enabled: true,
      projectId: 'surxnzd38u',
    }),
  ],
  site: 'learnt.developingdvlpr.com', // Update with your actual domain
  build: {
    inlineStylesheets: 'auto',
  },
});