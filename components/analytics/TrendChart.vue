<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      {{ trend.title }}
    </h3>
    <div class="h-64">
      <Line
        v-if="trend.type === 'line'"
        :data="chartData"
        :options="chartOptions"
      />
      <Pie
        v-else-if="trend.type === 'pie'"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line, Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TrendConfig {
  id: string;
  title: string;
  type: 'line' | 'pie';
}

const props = defineProps<{
  trend: TrendConfig;
  data: any;
}>();

const chartData = computed(() => {
  // Transform data based on chart type
  if (props.trend.type === 'line') {
    return {
      labels: props.data?.labels || [],
      datasets: [
        {
          label: props.trend.title,
          data: props.data?.values || [],
          borderColor: '#6366F1',
          tension: 0.1
        }
      ]
    };
  }
  
  return {
    labels: props.data?.labels || [],
    datasets: [{
      data: props.data?.values || [],
      backgroundColor: [
        '#6366F1',
        '#F59E0B',
        '#10B981',
        '#EF4444',
        '#8B5CF6'
      ]
    }]
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: props.trend.type === 'pie',
      position: 'bottom' as const
    }
  },
  scales: props.trend.type === 'line' ? {
    y: {
      beginAtZero: true,
      grid: {
        color: '#374151'
      }
    }
  } : undefined
}));
</script> 