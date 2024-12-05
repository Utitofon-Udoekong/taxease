<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        {{ title }}
      </h3>
      <div class="flex items-center gap-2">
        <button
          v-for="period in periods"
          :key="period.value"
          @click="selectedPeriod = period.value"
          :class="[
            'px-3 py-1 text-sm rounded-md',
            selectedPeriod === period.value
              ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <Chart
      type="line"
      :data="chartData"
      :options="chartOptions"
      :loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
interface Period {
  label: string;
  value: string;
}

interface Props {
  title: string;
  data: {
    labels: string[];
    values: number[];
  };
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const periods: Period[] = [
  { label: '7D', value: '7d' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: 'YTD', value: 'ytd' },
  { label: '1Y', value: '1y' }
];

const selectedPeriod = ref('1m');

const chartData = computed(() => ({
  labels: props.data.labels,
  datasets: [
    {
      label: props.title,
      data: props.data.values,
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}));

const chartOptions = {
  plugins: {
    legend: {
      display: false
    }
  }
};
</script> 