<template>
  <Modal @close="$emit('close')">
    <template #title>
      Export Report
    </template>
    <template #content>
      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-4">
          <button
            v-for="format in exportFormats"
            :key="format.id"
            @click="$emit('select', format.id)"
            class="flex items-center justify-between p-4 border rounded-lg hover:border-indigo-500 
                   dark:border-gray-700 dark:hover:border-indigo-500"
          >
            <div class="flex items-center">
              <Icon
                :name="getFormatIcon(format.id)"
                class="w-6 h-6 mr-3 text-gray-400"
              />
              <div class="text-left">
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ format.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ getFormatDescription(format.id) }}
                </div>
              </div>
            </div>
            <Icon
              name="heroicons:arrow-right"
              class="w-5 h-5 text-gray-400"
            />
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { exportFormats } from '@/utils/export-formats';

defineEmits<{
  (e: 'close'): void;
  (e: 'select', format: string): void;
}>();

const getFormatIcon = (format: string) => {
  switch (format) {
    case 'csv': return 'heroicons:document-text';
    case 'xlsx': return 'heroicons:table-cells';
    case 'pdf': return 'heroicons:document';
    default: return 'heroicons:document';
  }
};

const getFormatDescription = (format: string) => {
  switch (format) {
    case 'csv': return 'Simple text format, good for data processing';
    case 'xlsx': return 'Excel spreadsheet with multiple sheets';
    case 'pdf': return 'Professional PDF report with formatting';
    default: return '';
  }
};
</script> 