<template>
  <div 
    class="fixed z-50 inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
  >
    <div class="flex flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      <p class="text-gray-600 dark:text-gray-300">{{ message || 'Loading...' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script> 