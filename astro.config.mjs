import 'dotenv/config';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'http://localhost:3000',
  integrations: [
    tailwind(), // Tailwind CSS
    react(),    // Enables React/TSX components
  ],
});
