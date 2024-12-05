<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Date Range -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
        <input
          type="date"
          v-model="localConfig.startDate"
          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 
                 bg-white dark:bg-gray-800 px-3 py-2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
        <input
          type="date"
          v-model="localConfig.endDate"
          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 
                 bg-white dark:bg-gray-800 px-3 py-2"
        />
      </div>

      <!-- Report Format -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Format</label>
        <select
          v-model="localConfig.format"
          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 
                 bg-white dark:bg-gray-800 px-3 py-2"
        >
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          <option value="xlsx">Excel</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
               text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        Preview
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Generate Report
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: {
    startDate: Date;
    endDate: Date;
    format: string;
  }
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'generate'): void;
}>();

const localConfig = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const handleSubmit = () => {
  emit('generate');
};
</script> 