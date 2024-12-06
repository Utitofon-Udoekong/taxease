<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ subtitle }}
        </p>
      </div>
      <Icon
        :name="icon"
        class="w-8 h-8 text-gray-400 dark:text-gray-500"
      />
    </div>

    <div class="space-y-4">
      <!-- Main Value -->
      <div class="text-3xl font-semibold "
        :class="[
          title === 'Net Income' ? (parseFloat(mainValue) > 0) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
        ]"
      >
        {{ mainValue }}
        </div>

    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle: string;
  mainValue: string;
  icon: string;
}

defineProps<Props>();

</script> 