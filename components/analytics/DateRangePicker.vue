<template>
  <div class="flex items-center gap-4">
    <div class="flex items-center gap-2">
      <input
        type="date"
        v-model="start"
        class="rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
               bg-white dark:bg-gray-800 px-3 py-2"
      />
      <span class="text-gray-500 dark:text-gray-400">to</span>
      <input
        type="date"
        v-model="end"
        class="rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
               bg-white dark:bg-gray-800 px-3 py-2"
      />
    </div>
    <!-- <div class="flex items-center gap-2">
      <button
        v-for="preset in presets"
        :key="preset.label"
        @click="applyPreset(preset)"
        class="px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        :class="currentPreset === preset.label ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : ''"
      >
        {{ preset.label }}
      </button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
const start = defineModel<Date>('start');
const end = defineModel<Date>('end');

const presets = [
  { label: 'This Month', days: 30 },
  { label: 'Quarter', days: 90 },
  { label: 'Year', days: 365 }
];

const currentPreset = ref('');

const applyPreset = (preset: { label: string; days: number }) => {
  currentPreset.value = preset.label;
  end.value = new Date();
  const newStart = new Date();
  newStart.setDate(end.value.getDate() - preset.days);
  start.value = newStart;
};
</script> 