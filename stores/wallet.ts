import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { type Address } from 'viem';
import { sepolia } from '@reown/appkit/networks';
import type { AppKit } from '@reown/appkit/vue';

export const useWalletStore = defineStore('wallet', () => {
  // State
  const address = ref<Address | null>(null);
  const chainId = ref<number | null>(null);
  const isConnected = ref(false);
  const balance = ref<bigint>(BigInt(0));
  const ensName = ref<string | null>(null);
  const isCorrectNetwork = ref(false);
  const appKitInstance = ref<AppKit | null>(null);

  // Getters
  const truncatedAddress = computed((): string => {
    if (!address.value) return '';
    return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`;
  });

  const formattedBalance = computed((): string => {
    return (Number(balance.value) / 1e18).toFixed(4);
  });

  const networkName = computed((): string => {
    const networks: Record<number, string> = {
      11155111: 'Sepolia',
    };
    return chainId.value ? networks[chainId.value] || 'Unknown Network' : 'Not Connected';
  });

  const networkIcon = computed((): string => {
    const icons: Record<number, string> = {
      11155111: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.png',
    };
    return chainId.value ? icons[chainId.value] || 'https://placehold.co/20x20' : 'https://placehold.co/20x20';
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

  function setBalance(newBalance: bigint) {
    balance.value = newBalance;
  }

  function setEnsName(name: string | null) {
    ensName.value = name;
  }

  function setAppKitInstance(instance: AppKit) {
    appKitInstance.value = instance;
  }

  async function switchToSepolia() {
    if (!appKitInstance.value) {
      console.error('AppKit instance not initialized');
      return;
    }
    
    try {
      await appKitInstance.value.switchNetwork(sepolia);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  }

  function reset() {
    address.value = null;
    chainId.value = null;
    isConnected.value = false;
    balance.value = BigInt(0);
    ensName.value = null;
    isCorrectNetwork.value = false;
  }

  return {
    // State
    address,
    chainId,
    isConnected,
    balance,
    ensName,
    isCorrectNetwork,
    appKitInstance,

    // Getters
    truncatedAddress,
    formattedBalance,
    networkName,
    networkIcon,

    // Actions
    setAddress,
    setChainId,
    setBalance,
    setEnsName,
    setAppKitInstance,
    switchToSepolia,
    reset,
  };
}); 