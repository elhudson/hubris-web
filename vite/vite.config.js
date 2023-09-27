import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  server: {
    host:true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@elements': path.resolve(__dirname, './src/components/elements'),
      '@models': path.resolve(__dirname, './src/components/models'),
      '@sections':path.resolve(__dirname, './src/components/segments'),
      '@styles':path.resolve(__dirname, './src/styles'),
      '@pages':path.resolve(__dirname, './src/pages'),
      '@components':path.resolve(__dirname, './src/components')
    }
  },
  plugins: [react(), svgr({
    svgrOptions:{
      dimensions:false,
      icon:true
    }
  })],
  build: {
    target: 'esnext', //browsers can handle the latest ES features,
  },
  esbuild: {
    supported: {
      'top-level-await': true //browsers can handle top-level-await features
    },
  }
})
