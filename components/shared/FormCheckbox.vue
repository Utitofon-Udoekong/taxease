<template>
  <div class="flex items-start">
    <div class="flex items-center h-5">
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        :required="required"
        :disabled="disabled"
        class="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-indigo-600 focus:ring-indigo-500"
        :class="{
          'cursor-not-allowed': disabled
        }"
      />
    </div>
    <div class="ml-3 text-sm">
      <label
        :for="id"
        class="font-medium text-gray-700 dark:text-gray-300"
        :class="{
          'cursor-not-allowed': disabled
        }"
      >
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <p
        v-if="description"
        class="text-gray-500 dark:text-gray-400"
      >
        {{ description }}
      </p>
      <div
        v-if="error"
        class="mt-1 text-sm text-red-600 dark:text-red-400"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  id?: string;
}

withDefaults(defineProps<Props>(), {
  id: () => `checkbox-${Math.random().toString(36).substring(2, 9)}`
});

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script> 