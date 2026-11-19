import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Library build: React stays a peer dependency; the two small logo files are inlined so apps need no asset setup.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: () => 'index.js', cssFileName: 'style' },
    assetsInlineLimit: 64 * 1024,
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
    sourcemap: true,
  },
  test: { environment: 'jsdom', include: ['tests/**/*.test.ts?(x)'] },
} as never);
