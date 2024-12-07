<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Default Currency -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Default Currency
      </label>
      <select
        v-model="defaultCurrency"
        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
               bg-white dark:bg-gray-800 px-3 py-2"
      >
        <option value="USD">USD - US Dollar</option>
        <option value="EUR">EUR - Euro</option>
        <option value="GBP">GBP - British Pound</option>
        <option value="ETH">ETH - Ethereum</option>
      </select>
    </div>

    <!-- Reporting Period -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Default Reporting Period
      </label>
      <select
        v-model="reportingPeriod"
        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
               bg-white dark:bg-gray-800 px-3 py-2"
      >
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="yearly">Yearly</option>
      </select>
    </div>

    <!-- Transaction Categories -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Custom Transaction Categories
      </label>
      <div class="space-y-2">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="flex items-center gap-2"
        >
          <input
            type="text"
            v-model="categories[index]"
            class="flex-1 rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
                   bg-white dark:bg-gray-800 px-3 py-2"
          />
          <button
            type="button"
            @click="removeCategory(index)"
            class="p-2 text-red-600 hover:text-red-700"
          >
            <Icon name="heroicons:trash" class="w-5 h-5" />
          </button>
        </div>
      </div>
      <button
        type="button"
        @click="addCategory"
        class="mt-2 text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
      >
        <Icon name="heroicons:plus" class="w-4 h-4" />
        Add Category
      </button>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Save Preferences
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const defaultCurrency = defineModel<string>('defaultCurrency');
const reportingPeriod = defineModel<'monthly' | 'quarterly' | 'yearly'>('reportingPeriod');
const categories = defineModel<string[]>('categories',{default: []});

const emit = defineEmits<{
  (e: 'save'): void;
}>();

const addCategory = () => {
  categories.value = [...categories.value, ''];
};

const removeCategory = (index: number) => {
  categories.value = categories.value.filter((_, i) => i !== index);
};

const handleSubmit = () => {
  // Filter out empty categories before saving
  categories.value = categories.value.filter(Boolean);
  emit('save');
};
</script> 