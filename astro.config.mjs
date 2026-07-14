// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // User/organization GitHub Pages site (jotanavarrete.github.io) => base '/'.
  // If this were a project repo, base would be '/<repo-name>'.
  site: 'https://jotanavarrete.github.io',
  base: '/',

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      // Both locales are prefixed: /es/... and /en/...
      prefixDefaultLocale: true,
    },
  },

  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
