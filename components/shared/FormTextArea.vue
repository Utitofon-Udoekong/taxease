<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      :id="id"
      v-model="model"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :class="[
        'block w-full rounded-md border px-3 py-2 text-sm transition-colors',
        error
          ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500',
        disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-800',
      ]"
    />
    <div
      v-if="error"
      class="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      {{ error }}
    </div>
    <div
      v-if="hint"
      class="mt-1 text-sm text-gray-500 dark:text-gray-400"
    >
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  id?: string;
  rows?: number;
}

withDefaults(defineProps<Props>(), {
  id: () => `textarea-${Math.random().toString(36).substring(2, 9)}`,
  rows: 4
});

const model = defineModel<string>();
</script> 