// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  experimental: {
    clientNodeCompat: true,
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'nuxt-headlessui',
    '@nuxt/icon'
  ],
  runtimeConfig: {
    public: {
      walletConnectProjectId: process.env.NUXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
    }
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  colorMode: {
    classSuffix: '',
    fallback: 'dark',
    preference: 'dark'
  },
  tailwindcss: {
    config: {
      darkMode: 'class'
    }
  },
  vite: {
    define: {
      global: 'globalThis',
    },
  }
})