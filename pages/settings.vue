<template>
  <div class="space-y-6">
    <!-- Profile Settings -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Profile Settings</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account information and preferences
        </p>
      </div>
      <div class="p-6">
        <ProfileSettings
          v-model="profileSettings"
          @save="saveProfile"
        />
      </div>
    </div>

    <!-- Tax Settings -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Tax Preferences</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure your tax reporting preferences
        </p>
      </div>
      <div class="p-6">
        <TaxSettings
          v-model="taxSettings"
          @save="saveTaxSettings"
        />
      </div>
    </div>

    <!-- Wallet Settings -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Connected Wallets</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your connected wallets and permissions
        </p>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <!-- Connected Wallet -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <Icon name="heroicons:wallet" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ truncateAddress(connectedAddress) }}
                </div>
                <div class="text-sm text-gray-500">
                  Primary Wallet
                </div>
              </div>
            </div>
            <button
              @click="disconnect"
              class="text-sm text-red-600 hover:text-red-900 dark:hover:text-red-400"
            >
              Disconnect
            </button>
          </div>

          <!-- Connect New Wallet -->
          <button
            @click="connect"
            class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 
                   rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 
                   bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
            Connect New Wallet
          </button>
        </div>
      </div>
    </div>

    <!-- API Keys -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">API Keys</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage API keys for external integrations
        </p>
      </div>
      <div class="p-6">
        <ApiKeyManager
          :keys="apiKeys"
          @generate="generateApiKey"
          @revoke="revokeApiKey"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet';
import { useDisconnect } from 'wagmi';

definePageMeta({
  layout: 'dashboard'
});

// Profile settings
const profileSettings = ref({
  name: '',
  email: '',
  notifications: {
    email: true,
    push: false
  }
});

// Tax settings
const taxSettings = ref({
  defaultCurrency: 'USD',
  reportingPeriod: 'monthly',
  categories: [] as string[]
});

// API keys
const apiKeys = ref([]);

// Wallet connection
const wallet = useWalletStore();
const { disconnect } = useDisconnect();

const connectedAddress = computed(() => wallet.address);

// Actions
const saveProfile = async (settings: typeof profileSettings.value) => {
  // Implementation
};

const saveTaxSettings = async (settings: typeof taxSettings.value) => {
  // Implementation
};

const generateApiKey = async (name: string) => {
  // Implementation
};

const revokeApiKey = async (keyId: string) => {
  // Implementation
};

const connect = () => {
  // Implementation
};

// Helpers
const truncateAddress = (address: string | undefined) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
</script> 