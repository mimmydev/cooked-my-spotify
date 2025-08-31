// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath, URL } from 'node:url';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },

  // Runtime configuration
  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.API_BASE_URL ||
        'https://6ar978foa6.execute-api.ap-southeast-1.amazonaws.com/api',
    },
  },

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
        '~': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
  },

  // TypeScript configuration
  typescript: {
    strict: false,
    typeCheck: false,
  },

  // App configuration
  app: {
    head: {
      title: 'Merdeka Day - Roast My Spotify',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            "Celebrate Malaysia's Independence Day by getting your Spotify playlist roasted with Malaysian humor!",
        },
        { name: 'keywords', content: 'spotify, playlist, roast, malaysia, merdeka, music, ai' },
        { property: 'og:title', content: 'Merdeka Day - Roast My Spotify' },
        {
          property: 'og:description',
          content: 'Get your Spotify playlist roasted with hilarious Malaysian-style humor!',
        },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // Build configuration
  build: {
    transpile: ['@headlessui/vue'],
  },

  // Development server configuration
  devServer: {
    port: 3000,
    host: '0.0.0.0',
  },

  // Nitro configuration for Cloudflare Pages
  nitro: {
    preset: 'cloudflare-pages',
  },

  // Enable SPA mode for better Cloudflare Pages compatibility
  ssr: false,

  // Auto-import composables
  imports: {
    dirs: ['composables/**'],
  },
});
