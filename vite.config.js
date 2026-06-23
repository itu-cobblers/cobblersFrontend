import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
})
