<template>
  <div class="wallet-container relative">
    <!-- Connect button -->
    <button 
      v-if="!isConnected" 
      @click="handleConnect"
      class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-4 rounded-md font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 w-full"
    >
      Connect Wallet
    </button>

    <!-- Connected state with dropdown -->
    <Menu as="div" class="relative inline-block text-left w-full" v-else>
      <MenuButton
        class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-between px-4 py-2 rounded-md font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 w-full"
      >
        <div class="flex items-center gap-2">
          <NuxtImg 
            :src="getNetworkIcon" 
            :alt="networkData.chainId?.toString()"
            class="w-4 h-4 rounded-full"
          />
          <span class="font-mono">{{ truncateAddress }}</span>
        </div>
        <ChevronUpIcon class="h-4 w-4" />
      </MenuButton>

      <MenuItems
        class="absolute bottom-full left-0 right-0 mb-2 w-full origin-bottom rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-700"
      >
        <div class="py-1">
          <!-- Account Details -->
          <MenuItem v-slot="{ active }">
            <button
              @click="openAccountModal"
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                'flex w-full items-center px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <UserCircleIcon class="mr-3 h-5 w-5" />
              Account Details
            </button>
          </MenuItem>

          <!-- Network Switcher -->
          <MenuItem v-slot="{ active }">
            <button
              @click="openNetworkModal"
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                'flex w-full items-center px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <ArrowsRightLeftIcon class="mr-3 h-5 w-5" />
              Switch Network
            </button>
          </MenuItem>

          <div class="border-t border-gray-200 dark:border-gray-700"></div>

          <!-- Disconnect -->
          <MenuItem v-slot="{ active }">
            <button
              @click="handleDisconnect"
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-700 text-red-400 dark:text-red-500' : 'text-red-500 dark:text-red-400',
                'flex w-full items-center px-4 py-2 text-sm hover:text-red-400 dark:hover:text-red-500'
              ]"
            >
              <ArrowLeftStartOnRectangleIcon class="mr-3 h-5 w-5" />
              Disconnect
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  </div>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { 
  UserCircleIcon, 
  ArrowsRightLeftIcon,
  ArrowLeftStartOnRectangleIcon,
  ChevronUpIcon
} from '@heroicons/vue/24/outline';
import { createAppKit, useAppKit, useAppKitAccount, useAppKitNetwork, useDisconnect } from '@reown/appkit/vue';
import { sepolia, type AppKitNetwork } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import type { Address } from 'viem';

const config = useRuntimeConfig();
const projectId = config.public.walletConnectProjectId;
// Create metadata object
const metadata = {
  name: 'TaxEase',
  description: 'Crypto Tax Reporting Made Easy',
  url: 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

// Set networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia];

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: projectId as string
});

// Create modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: sepolia,
  projectId: projectId as string,
  metadata,
  features: {
    analytics: true
  }
});

// Save AppKit instance to store

// Use composables
const { open } = useAppKit();
const appKitAccount = useAppKitAccount();
const networkData = useAppKitNetwork();
const { disconnect } = useDisconnect();

const wallet = useWalletStore();
wallet.setAppKitInstance(modal);

// Replace the existing watchers with:
watch(() => appKitAccount.value.isConnected, (newValue) => {
  if (!newValue) {
    wallet.reset();
  }
});

watch(() => appKitAccount.value.address, (newValue) => {
  wallet.setAddress(newValue as Address || null);
});

watch(() => networkData.value.chainId, (newValue) => {
  wallet.setChainId(newValue as number || null);
  
  // Check network and prompt switch if needed
  if (wallet.isConnected && !wallet.isCorrectNetwork) {
    wallet.switchToSepolia();
  }
});

// // Add balance watcher
// const { data: balance } = useBalance({
//   address: computed(() => wallet.address as Address),
//   watch: true,
// });

// watch(balance, (newBalance) => {
//   if (newBalance?.value) {
//     wallet.setBalance(newBalance.value);
//   }
// });

// Update the template section to use the store:
const truncateAddress = computed(() => wallet.truncatedAddress);
const getNetworkIcon = computed(() => wallet.networkIcon);
const isConnected = computed(() => wallet.isConnected);

// Network icons mapping
const networkIcons = {
  1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002',
  137: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  8453: 'https://raw.githubusercontent.com/base-org/brand-kit/main/logo/in-product/Base_Network_Logo.svg',
  56: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
};

// Action handlers
const handleConnect = () => {
  open({ view: 'Connect' });
};

const handleDisconnect = async () => {
  await disconnect();
};

const openAccountModal = () => {
  open({ view: 'Account' });
};

const openNetworkModal = () => {
  open({ view: 'Networks' });
};
</script>
