<template>
  
  <!-- Not Connected State -->
  <div v-if="!isConnected">
    <button
      @click="showConnectors = true"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg 
             text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <Icon name="heroicons:wallet" class="w-5 h-5" />
      Connect Wallet
    </button>

    <!-- Connector Selection Modal -->
    <Dialog :open="showConnectors" @close="showConnectors = false" class="relative z-50">
      <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="w-full max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6">
          <DialogTitle class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Connect Wallet
          </DialogTitle>

          <div class="space-y-2">
            <button
              v-for="connector in connectors"
              :key="connector.id"
              @click="connect({ connector, chainId })"
              class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 
                     dark:hover:bg-gray-700 transition-colors"
            >
              <span class="font-medium text-gray-900 dark:text-white">{{ connector.name }}</span>
              <Icon name="heroicons:arrow-right" class="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div v-if="error" class="mt-4 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            {{ error.message }}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </div>

  <Menu as="div" class="relative" v-else>
    <MenuButton
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg 
             text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <span>{{ truncatedAddress }}</span>
      <Icon name="heroicons:chevron-down" class="w-4 h-4" aria-hidden="true" />
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 
               ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700"
      >
        <div class="p-3">
          <div class="text-sm text-gray-500 dark:text-gray-400">Balance</div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ formattedBalance }} ETH
          </div>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button
              @click="disconnectWallet"
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                'w-full flex items-center px-4 py-2 text-sm text-red-600'
              ]"
            >
              <Icon name="heroicons:power" class="w-4 h-4 mr-2" />
              Disconnect
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { useChainId, useConnect, useDisconnect, useAccount, useBalance, useReconnect } from '@wagmi/vue';
import { formatEther } from 'viem';
const chainId = useChainId();
const { connect, connectors, error, status } = useConnect();
const { data: reconnectData } = useReconnect();
const { disconnect } = useDisconnect();
const { address, isConnected } = useAccount();
const { data: balance } = useBalance({ address });
const walletStore = useWalletStore();

// Watch for address changes
watch(address, (newAddress) => {
  walletStore.setAddress(newAddress ?? null);
});

// Watch for chain changes
watch(chainId, (newChainId) => {
  walletStore.setChainId(newChainId);
});

const showConnectors = ref(false);

const truncatedAddress = computed(() => {
  return walletStore.truncatedAddress;
});

const formattedBalance = computed(() => {
  if (!balance.value) return '0.00';
  return (+formatEther(balance.value.value)).toFixed(4);
});

const disconnectWallet = () => {
  disconnect();
  walletStore.reset();
};

// Close modal on successful connection
watchEffect(() => {
  if (isConnected.value) {
    showConnectors.value = false;
  }

  console.log(status),
  console.log(error)
});

onMounted(() => {
  if (reconnectData.value) {
    console.log(reconnectData.value)
    connect({ connector: reconnectData.value[0].connector, chainId: reconnectData.value[0].chainId });
  }else{
    disconnectWallet()
  }
})
</script>
