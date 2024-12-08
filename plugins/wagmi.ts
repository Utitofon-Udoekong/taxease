import { VueQueryPlugin } from '@tanstack/vue-query'
import { http, createConfig, WagmiPlugin } from '@wagmi/vue';
import { sepolia } from '@wagmi/vue/chains';
import { walletConnect } from '@wagmi/vue/connectors'

// TODO: Move to @wagmi/vue/nuxt nitro plugin
export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig()
    const projectId = runtimeConfig.public.walletConnectProjectId;
    const config = createConfig({
        chains: [sepolia],
        connectors: [walletConnect({ projectId })],
        transports: {
            [sepolia.id]: http(),
        },
    });

    nuxtApp.vueApp.use(WagmiPlugin, { config })
    nuxtApp.vueApp.use(VueQueryPlugin, {})
})
