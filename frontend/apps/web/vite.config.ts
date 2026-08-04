import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const alias = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@watch-it/domain': alias('../../packages/domain/src'),
      '@watch-it/application': alias('../../packages/application/src'),
      '@watch-it/infrastructure': alias('../../packages/infrastructure/src'),
      '@watch-it/ui': alias('../../packages/ui/src'),
      '@watch-it/design-system': alias('../../packages/design-system/src'),
      '@watch-it/shared': alias('../../packages/shared/src'),
    },
  },
  server: {
    port: 5173,
  },
});
