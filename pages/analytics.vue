<template>
  <div class="space-y-6">
    <LoadingOverlay
      v-if="loading"
      message="Fetching transactions..."
    />
    <!-- Time Period and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex flex-col sm:flex-row justify-between gap-4">
        <DateRangePicker v-model="dateRange" />
        <div class="flex items-center gap-2">
          <button 
            @click="refreshData"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            <Icon 
              name="heroicons:arrow-path" 
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              :class="{ 'animate-spin': loading }"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Analytics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ReportSummaryCard
        v-for="metric in metrics"
        :key="metric.id"
        :title="metric.name"
        :subtitle="metric.description"
        :main-value="formatValue(metric.value)"
        :trend-value="metric.trend"
        :trend-direction="metric.trendDirection"
        :icon="metric.icon"
      />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Transaction Volume</h3>
        <TrendChart
          title="Daily Transaction Volume"
          :data="volumeChartData"
          :loading="loading"
        />
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Category Analysis</h3>
        <DistributionChart
          title="Transaction Categories"
          :data="categoryChartData"
          :loading="loading"
          :value-formatter="formatCurrency"
        />
      </div>
    </div>

    <!-- Detailed Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Transactions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Top Transactions</h3>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="tx in topTransactions"
            :key="tx.requestId"
            class="p-4 flex items-center justify-between"
          >
            <div>
              <TransactionCategoryBadge :category="tx.category" />
              <div class="mt-1 text-sm text-gray-500">
                {{ formatDate(tx.timestamp) }}
              </div>
            </div>
            <TransactionAmountDisplay
              :amount="tx.amount"
              :currency="tx.currency"
            />
          </div>
        </div>
      </div>

      <!-- Trends -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Trends</h3>
        <div class="space-y-4">
          <div
            v-for="trend in trends"
            :key="trend.id"
            class="flex items-center justify-between"
          >
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ trend.name }}
              </div>
              <div class="text-sm text-gray-500">
                {{ trend.description }}
              </div>
            </div>
            <div class="flex items-center">
              <Icon
                :name="getTrendIcon(trend.direction)"
                class="w-5 h-5 mr-2"
                :class="getTrendColorClass(trend.direction)"
              />
              <span :class="getTrendColorClass(trend.direction)">
                {{ trend.value }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


// State
const dateRange = ref({
  start: new Date(new Date().getFullYear(), 0, 1),
  end: new Date()
});


// Data fetching
const transactionStore = useTransactionStore();
const { transactions, loading } = storeToRefs(transactionStore);
const { generateStandardReport } = useStandardTaxCalculator();


async function refreshData() {
  await transactionStore.fetchTransactions();
}

// Computed metrics
const metrics = computed(() => {
  const report = generateStandardReport();
  return [
    {
      id: 'volume',
      name: 'Transaction Volume',
      description: 'Total number of transactions',
      value: transactions.value.length.toString(),
      trend: '+12.5%',
      trendDirection: 'up' as const,
      icon: 'heroicons:chart-bar'
    },
    {
      id: 'average',
      name: 'Average Transaction',
      description: 'Average transaction value',
      value: calculateAverageTransaction(),
      trend: '-5.2%',
      trendDirection: 'down' as const,
      icon: 'heroicons:calculator'
    },
    {
      id: 'success_rate',
      name: 'Success Rate',
      description: 'Transaction success rate',
      value: calculateSuccessRate(),
      trend: '+2.3%',
      trendDirection: 'up' as const,
      icon: 'heroicons:check-circle'
    }
  ];
});

// Chart data
const volumeChartData = computed(() => {
  // Implementation
  return {
    labels: [],
    values: []
  };
});

const categoryChartData = computed(() => {
  // Implementation
  return [];
});

// Top transactions
const topTransactions = computed(() => 
  [...transactions.value]
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 5)
);

// Trends analysis
const trends = computed(() => [
  {
    id: 'growth',
    name: 'Growth Rate',
    description: 'Month over month growth',
    value: '+15.3%',
    direction: 'up' as const
  },
  // Add more trends
]);

// Helpers
function calculateAverageTransaction(): string {
  if (transactions.value.length === 0) return '0';
  const total = transactions.value.reduce((sum, tx) => sum + Number(tx.amount), 0);
  return (total / transactions.value.length).toFixed(2);
}

function calculateSuccessRate(): string {
  if (transactions.value.length === 0) return '0%';
  const successful = transactions.value.filter(tx => tx.status === 'accepted').length;
  return ((successful / transactions.value.length) * 100).toFixed(1) + '%';
}

function formatValue(value: string): string {
  if (value.includes('%')) return value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(value));
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function getTrendIcon(direction: 'up' | 'down' | 'neutral'): string {
  switch (direction) {
    case 'up': return 'heroicons:arrow-trending-up';
    case 'down': return 'heroicons:arrow-trending-down';
    default: return 'heroicons:minus';
  }
}

function getTrendColorClass(direction: 'up' | 'down' | 'neutral'): string {
  switch (direction) {
    case 'up': return 'text-green-600 dark:text-green-400';
    case 'down': return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
}
</script> 