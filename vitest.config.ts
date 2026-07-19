import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      // index.ts est le point d'entrée (démarrage réseau) — couvert par les tests E2E, pas unitaires.
      exclude: [
        'src/server/index.ts',
        'src/public/**',
        'src/views/**',
        'src/db/migrations/**',
        'src/**/*.test.ts',
      ],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
