<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-700">
    <div v-for="report in reports" :key="report.id" class="p-6">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ report.name }}
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Generated on {{ formatDate(report.generatedAt) }}
          </p>
        </div>
        <div class="flex space-x-2">
          <button
            @click="downloadReport(report)"
            class="px-3 py-1 text-sm rounded-md bg-indigo-50 dark:bg-indigo-900 
                   text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800"
          >
            Download
          </button>
          <button
            @click="deleteReport(report)"
            class="px-3 py-1 text-sm rounded-md bg-red-50 dark:bg-red-900 
                   text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      </div>
      <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                     bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
          {{ report.format.toUpperCase() }}
        </span>
        <span class="ml-2">{{ report.periodStart }} - {{ report.periodEnd }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Report {
  id: string;
  name: string;
  generatedAt: Date;
  format: string;
  periodStart: string;
  periodEnd: string;
}

const props = defineProps<{
  reports: Report[];
}>();

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const downloadReport = (report: Report) => {
  // Implementation
};

const deleteReport = (report: Report) => {
  // Implementation
};
</script> 