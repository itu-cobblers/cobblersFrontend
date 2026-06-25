import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const alias = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': alias('./src'),
      '@components': alias('./src/components'),
      '@views': alias('./src/views'),
      '@hooks': alias('./src/hooks'),
      '@lib': alias('./src/lib'),
      '@themes': alias('./src/themes'),
      '@types': alias('./src/types'),
    },
  },
  server: {
    proxy: {
      // cobblersBackend (ASP.NET Core) — run `dotnet run` in the api repo.
      // Default http profile is port 5046; adjust if your backend uses another.
      '/api': {
        target: 'http://localhost:5046',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
