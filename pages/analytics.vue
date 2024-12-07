<template>
  <div class="space-y-6">
    <LoadingOverlay v-if="loading" message="Fetching transactions..." />

    <div class="flex justify-end">
      <RefreshButton 
        :loading="loading" 
        @refresh="refreshData"
      />
    </div>

    <!-- Analytics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ReportSummaryCard v-for="metric in metrics" :key="metric.id" :title="metric.name" :subtitle="metric.description"
        :main-value="metric.value" :icon="metric.icon" />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Transaction Volume</h3>
        <TrendChart title="Daily Transaction Volume" :data="volumeChartData" :loading="loading" />
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Category Analysis</h3>
        <DistributionChart title="Transaction Categories" :data="categoryChartData" :loading="loading" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">


// Data fetching
const transactionStore = useTransactionStore();
const { transactions, loading } = storeToRefs(transactionStore);
const { generateStandardReport } = useStandardTaxCalculator();


async function refreshData() {
  await transactionStore.fetchTransactions();
}

// Computed metrics
const metrics = computed(() => {
  return [
    {
      id: 'volume',
      name: 'Transaction Volume',
      description: 'Total number of transactions',
      value: transactions.value.length.toString(),
      icon: 'heroicons:chart-bar'
    },
    {
      id: 'average',
      name: 'Average Transaction',
      description: 'Average transaction value',
      value: calculateAverageTransaction(),
      icon: 'heroicons:calculator'
    },
    {
      id: 'success_rate',
      name: 'Success Rate',
      description: 'Transaction success rate',
      value: calculateSuccessRate(),
      icon: 'heroicons:check-circle'
    }
  ];
});

// Chart data
const volumeChartData = computed(() => {
  const report = generateStandardReport();
  return {
    labels: report.monthlyTotals.map(m => `${m.month}/${m.year}`),
    values: report.monthlyTotals.map(m => Number(m.net))
  }
});

const categoryChartData = computed(() => {
  const report = generateStandardReport();
  return Object.entries(report.categoryTotals).map(([label, value]) => ({
    label,
    value: formatEthers(Number(value))
  }));
});


// Helpers
function calculateAverageTransaction(): string {
  if (transactions.value.length === 0) return '0';
  const total = transactions.value.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const average = total / transactions.value.length;
  return formatEthers(average);
}

function calculateSuccessRate(): string {
  if (transactions.value.length === 0) return '0%';
  const successful = transactions.value.filter(tx => tx.status === 'accepted').length;
  return ((successful / transactions.value.length) * 100).toFixed(1) + '%';
}

</script>