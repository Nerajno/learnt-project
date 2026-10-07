// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import clarity from '@kbyte-tech/astro-clarity';
import partytown from '@astrojs/partytown';

export default defineConfig({
  integrations: [
    tailwind(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
     clarity({
      enabled: true,
      projectId: 'surxnzd38u',
    }),
  ],
  site: 'https://learnt.developingdvlpr.com',
  build: {
    inlineStylesheets: 'auto',
  },
});
