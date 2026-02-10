// vite.config.ts
import { defineConfig } from "file:///C:/Users/david.xing/Desktop/fedex-weiliao-h5/node_modules/.pnpm/vite@5.4.11_@types+node@22.10.5_sass@1.83.1/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/david.xing/Desktop/fedex-weiliao-h5/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vi_c0e3edd949c0cd002c2b14f0805714cb/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///C:/Users/david.xing/Desktop/fedex-weiliao-h5/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_49599b4b69710be129355a76f94c9cd1/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\david.xing\\Desktop\\fedex-weiliao-h5";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [
        path.resolve(process.cwd(), "src/assets/icons/svg"),
        path.resolve(process.cwd(), "src/assets/icons/chat/svg"),
        path.resolve(process.cwd(), "src/assets/icons/admin/svg")
      ],
      symbolId: "icon-[name]",
      inject: "body-last",
      customDomId: "__svg__icons__dom__"
    })
  ],
  resolve: {
    extensions: [".vue", ".ts"],
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    host: "0.0.0.0",
    port: 3e3,
    cors: true
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
        api: "modern-compiler"
      }
    }
  }
  // build: {
  //   rollupOptions: {
  //     output: {
  //       entryFileNames: `assets/bundle-v${version}.js`,
  //       chunkFileNames: `assets/chunk-[hash]-v${version}.js`,
  //       assetFileNames: `assets/[name]-[hash]-v${version}[extname]`,
  //     },
  //   },
  // },
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkYXZpZC54aW5nXFxcXERlc2t0b3BcXFxcZmVkZXgtd2VpbGlhby1oNVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZGF2aWQueGluZ1xcXFxEZXNrdG9wXFxcXGZlZGV4LXdlaWxpYW8taDVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2RhdmlkLnhpbmcvRGVza3RvcC9mZWRleC13ZWlsaWFvLWg1L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuXHJcbmNvbnN0IHZlcnNpb24gPSA0O1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgIGljb25EaXJzOiBbXHJcbiAgICAgICAgcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvYXNzZXRzL2ljb25zL3N2ZycpLFxyXG4gICAgICAgIHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjL2Fzc2V0cy9pY29ucy9jaGF0L3N2ZycpLFxyXG4gICAgICAgIHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjL2Fzc2V0cy9pY29ucy9hZG1pbi9zdmcnKSxcclxuICAgICAgXSxcclxuICAgICAgc3ltYm9sSWQ6ICdpY29uLVtuYW1lXScsXHJcbiAgICAgIGluamVjdDogJ2JvZHktbGFzdCcsXHJcbiAgICAgIGN1c3RvbURvbUlkOiAnX19zdmdfX2ljb25zX19kb21fXycsXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGV4dGVuc2lvbnM6IFsnLnZ1ZScsICcudHMnXSxcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICBwb3J0OiAzMDAwLFxyXG4gICAgY29yczogdHJ1ZSxcclxuICAgIC8vIHByb3h5OiB7XHJcbiAgICAvLyAgICcvYXBpJzoge1xyXG4gICAgLy8gICAgIHRhcmdldDogJ2h0dHA6Ly93ZWInLFxyXG4gICAgLy8gICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9LFxyXG4gIH0sXHJcblxyXG4gIGNzczoge1xyXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICBzY3NzOiB7XHJcbiAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuXHJcbiAgLy8gYnVpbGQ6IHtcclxuICAvLyAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAvLyAgICAgb3V0cHV0OiB7XHJcbiAgLy8gICAgICAgZW50cnlGaWxlTmFtZXM6IGBhc3NldHMvYnVuZGxlLXYke3ZlcnNpb259LmpzYCxcclxuICAvLyAgICAgICBjaHVua0ZpbGVOYW1lczogYGFzc2V0cy9jaHVuay1baGFzaF0tdiR7dmVyc2lvbn0uanNgLFxyXG4gIC8vICAgICAgIGFzc2V0RmlsZU5hbWVzOiBgYXNzZXRzL1tuYW1lXS1baGFzaF0tdiR7dmVyc2lvbn1bZXh0bmFtZV1gLFxyXG4gIC8vICAgICB9LFxyXG4gIC8vICAgfSxcclxuICAvLyB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVSxTQUFTLG9CQUFvQjtBQUM3VixPQUFPLFNBQVM7QUFDaEIsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLHFCQUFxQjtBQUFBLE1BQ25CLFVBQVU7QUFBQSxRQUNSLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxzQkFBc0I7QUFBQSxRQUNsRCxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsMkJBQTJCO0FBQUEsUUFDdkQsS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFHLDRCQUE0QjtBQUFBLE1BQzFEO0FBQUEsTUFDQSxVQUFVO0FBQUEsTUFDVixRQUFRO0FBQUEsTUFDUixhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsWUFBWSxDQUFDLFFBQVEsS0FBSztBQUFBLElBQzFCLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9SO0FBQUEsRUFFQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixLQUFLO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBV0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
