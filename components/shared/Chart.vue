<template>
  <div class="relative" :style="{ height: height }">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- No Data State -->
    <div
      v-else-if="!hasData"
      class="absolute inset-0 flex items-center justify-center"
    >
      <p class="text-gray-500 dark:text-gray-400">No data available</p>
    </div>

    <!-- Chart -->
    <component
      :is="chartComponent"
      v-else
      :data="data"
      :options="mergedOptions"
    />
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Props
interface Props {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data: ChartData<any>;
  options?: ChartOptions<any>;
  loading?: boolean;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  height: '300px',
  options: () => ({})
});

// Chart component mapping
const chartComponents = {
  line: Line,
  bar: Bar,
  pie: Pie,
  doughnut: Doughnut
};

// Default chart options based on type
const defaultOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: isDark.value ? '#D1D5DB' : '#374151',
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: isDark.value ? '#374151' : '#FFFFFF',
      titleColor: isDark.value ? '#F3F4F6' : '#111827',
      bodyColor: isDark.value ? '#D1D5DB' : '#374151',
      borderColor: isDark.value ? '#4B5563' : '#E5E7EB',
      borderWidth: 1,
      padding: 12,
      boxPadding: 4,
      usePointStyle: true,
    }
  },
  scales: props.type === 'line' || props.type === 'bar' ? {
    x: {
      grid: {
        color: isDark.value ? '#374151' : '#E5E7EB'
      },
      ticks: {
        color: isDark.value ? '#D1D5DB' : '#374151'
      }
    },
    y: {
      grid: {
        color: isDark.value ? '#374151' : '#E5E7EB'
      },
      ticks: {
        color: isDark.value ? '#D1D5DB' : '#374151'
      },
      beginAtZero: true
    }
  } : undefined
}));

// Computed
const isDark = computed(() => useColorMode().value === 'dark');

const chartComponent = computed(() => chartComponents[props.type]);

const mergedOptions = computed(() => ({
  ...defaultOptions.value,
  ...props.options
}));

const hasData = computed(() => {
  if (!props.data.datasets) return false;
  return props.data.datasets.some(dataset => 
    dataset.data && dataset.data.length > 0
  );
});
</script> 