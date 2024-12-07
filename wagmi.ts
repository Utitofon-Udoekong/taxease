import { http, cookieStorage, createConfig, createStorage } from '@wagmi/vue';
import { sepolia } from '@wagmi/vue/chains';
import { injected, metaMask, walletConnect } from '@wagmi/vue/connectors'
const projectId = '00eeef778447415dff4bfa73a5a055b2';
console.log(projectId);
export const config = createConfig({
  chains: [sepolia],
  connectors: [injected(), metaMask(), walletConnect({ projectId })],
  transports: {
    [sepolia.id]: http(),
  },
});

declare module '@wagmi/vue' {
  interface Register {
    config: typeof config;
  }
}
