import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Everything under test here is pure — no DOM, so no jsdom.
        environment: 'node',
        include: ['src/**/*.test.ts'],
    },
});
