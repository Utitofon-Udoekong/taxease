<template>
  <button
    @click="toggleColorMode"
    class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    :title="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <SunIcon v-if="colorMode.value === 'dark'" class="size-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
    <MoonIcon v-else class="size-5 text-gray-600 hover:text-gray-800 dark:hover:text-gray-400" />
  </button>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline';

const colorMode = useColorMode();
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script> 