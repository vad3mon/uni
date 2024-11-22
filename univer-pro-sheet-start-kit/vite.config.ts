import { defineConfig } from 'vite'
import { univerPlugin } from '@univerjs/vite-plugin'
export default defineConfig({
    plugins: [
        univerPlugin()
    ],
  server: {
    cors: true,
    proxy: {
      '/universer-api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  define: {
    'process.env.UNIVER_CLIENT_LICENSE': '"%%UNIVER_CLIENT_LICENSE_PLACEHOLDER%%"',
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
      },
    },
  },
})
