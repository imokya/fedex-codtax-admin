import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

const version = 37;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [
        path.resolve(process.cwd(), 'src/assets/icons/svg'),
        path.resolve(process.cwd(), 'src/assets/icons/chat/svg'),
        path.resolve(process.cwd(), 'src/assets/icons/admin/svg'),
      ],
      symbolId: 'icon-[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
    }),
  ],
  resolve: {
    extensions: ['.vue', '.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    cors: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://web',
    //     changeOrigin: true
    //   }
    // },
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/bundle-v${version}.js`,
        chunkFileNames: `assets/chunk-[hash]-v${version}.js`,
        assetFileNames: `assets/[name]-[hash]-v${version}[extname]`,
      },
    },
  },
});
