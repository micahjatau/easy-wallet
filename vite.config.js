import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('firebase')) return 'firebase'
          if (id.includes('recharts')) return 'recharts'
          if (id.includes('react-window')) return 'react-window'
          return 'vendor'
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react-window'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: [
        'src/hooks/useSync.js',
        'src/hooks/useVersioningSyncActions.js',
        'src/hooks/useImportExportActions.js',
        'src/hooks/useDataManagementActions.js',
        'src/hooks/useActivityData.js',
      ],
      exclude: [
        'src/test/**',
        'src/**/*.test.{js,jsx}',
      ],
      thresholds: {
        lines: 50,
        branches: 45,
        functions: 50,
        statements: 50,
      },
    },
  },
})
