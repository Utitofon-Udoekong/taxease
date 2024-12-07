<template>
  <div class="space-y-6">
    <!-- API Keys List -->
    <div class="space-y-4">
      <div
        v-for="key in keys"
        :key="key.id"
        class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              {{ key.name }}
            </h4>
            <p class="text-sm text-gray-500">
              Created on {{ formatDate(key.createdAt) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="copyApiKey(key.value)"
              class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              :title="copied === key.id ? 'Copied!' : 'Copy API Key'"
            >
              <Icon 
                :name="copied === key.id ? 'heroicons:check' : 'heroicons:clipboard'" 
                class="w-5 h-5"
              />
            </button>
            <button
              @click="confirmRevoke(key)"
              class="p-2 text-red-600 hover:text-red-700"
              title="Revoke API Key"
            >
              <Icon name="heroicons:trash" class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div class="mt-2">
          <code class="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {{ maskApiKey(key.value) }}
          </code>
        </div>
      </div>
    </div>

    <!-- Generate New Key -->
    <div>
      <button
        disabled
        title="Coming soon"
        @click="showGenerateModal = true"
        class="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
      >
        <Icon name="heroicons:plus" class="w-5 h-5" />
        Generate New API Key
      </button>
    </div>

    <!-- Generate Modal -->
    <Modal v-if="showGenerateModal" @close="showGenerateModal = false">
      <template #title>Generate New API Key</template>
      <template #content>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Key Name
            </label>
            <input
              v-model="newKeyName"
              type="text"
              class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 px-3 py-2"
              placeholder="e.g., Development Key"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="showGenerateModal = false"
            class="px-4 py-2 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            @click="generateKey"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Generate
          </button>
        </div>
      </template>
    </Modal>

    <!-- Revoke Confirmation Modal -->
    <Modal v-if="keyToRevoke" @close="keyToRevoke = null">
      <template #title>Revoke API Key</template>
      <template #content>
        <p class="text-sm text-gray-500">
          Are you sure you want to revoke this API key? This action cannot be undone.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="keyToRevoke = null"
            class="px-4 py-2 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            @click="revokeKey"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Revoke
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
interface ApiKey {
  id: string;
  name: string;
  value: string;
  createdAt: Date;
}

const props = defineProps<{
  keys: ApiKey[];
}>();

const emit = defineEmits<{
  (e: 'generate', name: string): void;
  (e: 'revoke', id: string): void;
}>();

const showGenerateModal = ref(false);
const newKeyName = ref('');
const keyToRevoke = ref<ApiKey | null>(null);
const copied = ref<string | null>(null);

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const maskApiKey = (key: string) => {
  return `${key.slice(0, 8)}...${key.slice(-8)}`;
};

const copyApiKey = async (key: string) => {
  await navigator.clipboard.writeText(key);
  copied.value = key;
  setTimeout(() => {
    copied.value = null;
  }, 2000);
};

const generateKey = () => {
  emit('generate', newKeyName.value);
  newKeyName.value = '';
  showGenerateModal.value = false;
};

const confirmRevoke = (key: ApiKey) => {
  keyToRevoke.value = key;
};

const revokeKey = () => {
  if (keyToRevoke.value) {
    emit('revoke', keyToRevoke.value.id);
    keyToRevoke.value = null;
  }
};
</script> 