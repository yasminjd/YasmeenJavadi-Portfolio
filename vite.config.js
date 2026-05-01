import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        projects: resolve(__dirname, 'projects.html'),
        skills: resolve(__dirname, 'skills.html'),
        experience: resolve(__dirname, 'experience.html'),
        certificates: resolve(__dirname, 'certificates.html'),
      },
    },
    copyPublicDir: true,
  },
  // Copy additional assets to build
  assetsInclude: ['**/*.pdf'],
})