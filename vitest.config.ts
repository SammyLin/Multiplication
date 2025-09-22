import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(
  mergeConfig(viteConfig, {
    test: {
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      css: true,
      globals: true,
      maxConcurrency: 1,
      pool: 'threads',
      poolOptions: {
        threads: {
          minThreads: 1,
          maxThreads: 1,
        },
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
      },
    },
  }),
)
