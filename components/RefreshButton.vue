<template>
  <button 
    @click="$emit('refresh')" 
    class="p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center" 
    :disabled="loading"
  >
    <Icon 
      name="heroicons:arrow-path" 
      class="text-gray-500 dark:text-gray-400 size-5" 
      :class="{ 'animate-spin': loading }" 
    />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
}>();

defineEmits<{
  refresh: []
}>();
</script> 