// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteYaml from '@modyfi/vite-plugin-yaml';

// Icons
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

// Utilities
import { defineConfig, UserConfigExport } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
const config:UserConfigExport = {
  plugins: [
    Components({
      resolvers: [
        IconsResolver(),
      ],
    }),
    Icons(),
    vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },

    }),
    ViteYaml(),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3111,
  },
}

export default defineConfig(config)
