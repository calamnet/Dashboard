// astro.config.mjs

import 'dotenv/config';

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';


export default defineConfig({
  integrations: [tailwind()],

});