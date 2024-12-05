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
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
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
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  id: () => `input-${Math.random().toString(36).substr(2, 9)}`
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script> 