import { defineStore } from 'pinia';
import type { Address } from 'viem';
import { sepolia } from '@wagmi/core/chains';

export const useWalletStore = defineStore('wallet', () => {
  // State
  const address = ref<Address | null>(null);
  const chainId = ref<number | null>(null);
  const isConnected = ref(false);
  const isCorrectNetwork = ref(false);

  // Getters
  const truncatedAddress = computed((): string => {
    if (!address.value) return '';
    return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`;
  });

  const networkName = computed((): string => {
    const networks: Record<number, string> = {
      [sepolia.id]: 'Sepolia',
    };
    return chainId.value ? networks[chainId.value] || 'Unknown Network' : 'Not Connected';
  });

  // Actions
  function setAddress(newAddress: Address | null) {
    address.value = newAddress;
    isConnected.value = !!newAddress;
  }

  function setChainId(newChainId: number | null) {
    chainId.value = newChainId;
    isCorrectNetwork.value = newChainId === sepolia.id;
  }

  function reset() {
    address.value = null;
    chainId.value = null;
    isConnected.value = false;
    isCorrectNetwork.value = false;
  }

  return {
    // State
    address,
    chainId,
    isConnected,
    isCorrectNetwork,

    // Getters
    truncatedAddress,
    networkName,

    // Actions
    setAddress,
    setChainId,
    reset,
  };
}); 