<template>
  <div class="flex items-center gap-4">
    <div class="flex items-center gap-2">
      <input
        type="date"
        v-model="localStart"
        class="rounded-md border border-gray-300 dark:border-gray-700 
               bg-white dark:bg-gray-800 px-3 py-2"
      />
      <span class="text-gray-500 dark:text-gray-400">to</span>
      <input
        type="date"
        v-model="localEnd"
        class="rounded-md border border-gray-300 dark:border-gray-700 
               bg-white dark:bg-gray-800 px-3 py-2"
      />
    </div>
    <div class="flex items-center gap-2">
      <button
        v-for="preset in presets"
        :key="preset.label"
        @click="applyPreset(preset)"
        class="px-3 py-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="currentPreset === preset.label ? 'bg-gray-100 dark:bg-gray-700' : ''"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: {
    start: Date;
    end: Date;
  };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: { start: Date; end: Date }): void;
}>();

const presets = [
  { label: 'This Month', days: 30 },
  { label: 'Quarter', days: 90 },
  { label: 'Year', days: 365 }
];

const currentPreset = ref('');

const localStart = computed({
  get: () => props.modelValue.start.toISOString().split('T')[0],
  set: (value) => emit('update:modelValue', {
    start: new Date(value),
    end: props.modelValue.end
  })
});

const localEnd = computed({
  get: () => props.modelValue.end.toISOString().split('T')[0],
  set: (value) => emit('update:modelValue', {
    start: props.modelValue.start,
    end: new Date(value)
  })
});

const applyPreset = (preset: { label: string; days: number }) => {
  currentPreset.value = preset.label;
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - preset.days);
  
  emit('update:modelValue', { start, end });
};
</script> 