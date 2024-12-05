<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
        {{ metric.name }}
      </h3>
      <Icon 
        :name="metric.icon || 'heroicons:chart-bar'"
        class="w-5 h-5 text-gray-400 dark:text-gray-500"
      />
    </div>
    <div class="mt-2">
      <p class="text-2xl font-semibold text-gray-900 dark:text-white">
        {{ metric.format(data?.value || 0) }}
      </p>
      <p class="mt-2 flex items-center text-sm">
        <span 
          :class="data?.trend === 'up' ? 'text-green-500' : 'text-red-500'"
          class="flex items-center"
        >
          <Icon 
            :name="data?.trend === 'up' ? 'heroicons:arrow-up' : 'heroicons:arrow-down'"
            class="w-4 h-4 mr-1"
          />
          {{ data?.change || '0%' }}
        </span>
        <span class="text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnalyticsMetric } from '@/utils/analytics';

interface AnalyticsData {
  value: number;
  trend: 'up' | 'down';
  change: string;
}

defineProps<{
  metric: AnalyticsMetric;
  data?: AnalyticsData;
}>();
</script> 