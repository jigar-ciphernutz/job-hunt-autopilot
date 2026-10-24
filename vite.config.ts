import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // node environment is fine for our pure function tests
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
});
