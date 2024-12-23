export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'nuxt-headlessui',
    '@nuxt/icon',
    'nuxt-security',
    '@wagmi/vue/nuxt'
  ],
  runtimeConfig: {
    public: {
      walletConnectProjectId: process.env.NUXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
    }
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
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
  },
  // alias: {
  //   'string_decoder': 'string_decoder/',
  // },
})
