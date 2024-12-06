<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      {{ title }}
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Chart -->
      <Chart
        type="doughnut"
        :data="chartData"
        :options="chartOptions"
        :loading="loading"
      />

      <!-- Legend -->
      <div class="flex flex-col justify-center space-y-3">
        <div
          v-for="(item, index) in data"
          :key="item.label"
          class="flex items-center justify-between"
        >
          <div class="flex items-center">
            <span
              class="w-3 h-3 rounded-full mr-2"
              :style="{ backgroundColor: chartColors[index] }"
            ></span>
            <span class="text-sm text-gray-600 dark:text-gray-300">
              {{ item.label }}
            </span>
          </div>
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            ${{ item.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DataItem {
  label: string;
  value: string;
}

interface Props {
  title: string;
  data: DataItem[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const chartColors = [
  '#6366F1', // Indigo
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316'  // Orange
];

const chartData = computed(() => ({
  labels: props.data.map(item => item.label),
  datasets: [{
    data: props.data.map(item => item.value),
    backgroundColor: chartColors.slice(0, props.data.length),
    borderWidth: 0
  }]
}));

const chartOptions = {
  plugins: {
    legend: {
      display: false
    }
  },
  cutout: '70%'
};

</script> 