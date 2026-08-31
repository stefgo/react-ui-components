import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Components are tested against the DOM; the pure logic under src/data/
        // does not need it but runs fine in the same environment.
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.test.{ts,tsx}'],
    },
});
