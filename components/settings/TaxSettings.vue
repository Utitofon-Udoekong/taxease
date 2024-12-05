<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Default Currency -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Default Currency
      </label>
      <select
        v-model="localSettings.defaultCurrency"
        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 
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
        v-model="localSettings.reportingPeriod"
        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 
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
          v-for="(category, index) in localCategories"
          :key="index"
          class="flex items-center gap-2"
        >
          <input
            type="text"
            v-model="localCategories[index]"
            class="flex-1 rounded-md border border-gray-300 dark:border-gray-700 
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
interface TaxSettings {
  defaultCurrency: string;
  reportingPeriod: string;
  categories: string[];
}

const props = defineProps<{
  modelValue: TaxSettings;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: TaxSettings): void;
  (e: 'save', value: TaxSettings): void;
}>();

const localSettings = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const localCategories = ref(props.modelValue.categories);

const addCategory = () => {
  localCategories.value.push('');
};

const removeCategory = (index: number) => {
  localCategories.value.splice(index, 1);
};

const handleSubmit = () => {
  const settings = {
    ...localSettings.value,
    categories: localCategories.value.filter(Boolean)
  };
  emit('save', settings);
};
</script> 