<template>
  <div class="space-y-6">
    <!-- Header with Refresh -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h2>
      <RefreshButton 
        :loading="loading" 
        @refresh="fetchData"
      />
    </div>

    <LoadingOverlay v-if="loading" message="Fetching transactions..." />
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ReportSummaryCard v-for="stat in quickStats" :key="stat.title" v-bind="stat" />
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Transactions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h3>
          <NuxtLink to="/transactions" class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">View All</NuxtLink>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="tx in recentTransactions" :key="tx.requestId" class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <TransactionCategoryBadge :category="tx.category" />
                <div class="mt-1 text-sm text-gray-500">
                  {{ new Date(tx.timestamp * 1000).toLocaleDateString() }}
                </div>
              </div>
              <TransactionAmountDisplay :amount="tx.amount" :currency="tx.currency" :category="tx.category" />
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Overview -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Overview</h3>
        <TrendChart title="Income vs Expenses" :data="monthlyData" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

const transactionStore = useTransactionStore();
const { transactions, loading } = storeToRefs(transactionStore);

const { calculateTaxSummary, generateStandardReport } = useStandardTaxCalculator();

const fetchData = async () => {
  await transactionStore.fetchTransactions();
};

// Chart data computations
const monthlyData = computed(() => {
  const report = generateStandardReport();
  if (!report?.monthlyTotals) return { labels: [], values: [] };

  return {
    labels: report.monthlyTotals.map(m => `${m.month + 1}/${report.periodStart?.getFullYear() || new Date().getFullYear()}`),
    values: report.monthlyTotals.map(m => Number(m.net || 0))
  };
});

// Computed stats and data
const quickStats = computed(() => {
  const summary = calculateTaxSummary(new Date().getFullYear()) || {
    totalIncome: '0',
    totalExpenses: '0',
    netIncome: '0'
  };

  return [
    {
      title: 'Total Income',
      subtitle: 'Current Period',
      mainValue: summary.totalIncome,
      icon: 'heroicons:banknotes'
    },
    {
      title: 'Total Expenses',
      subtitle: 'Current Period',
      mainValue: summary.totalExpenses,
      icon: 'heroicons:credit-card'
    },
    {
      title: 'Net Income',
      subtitle: 'Current Period',
      mainValue: summary.netIncome,
      icon: 'heroicons:calculator'
    },
    {
      title: 'Pending Transactions',
      subtitle: 'Awaiting Confirmation',
      mainValue: String(transactions.value.filter(tx => tx.status === 'pending').length),
      icon: 'heroicons:clock'
    }
  ];
});

const recentTransactions = computed(() =>
  (transactions.value || []).sort((a, b) => b.timestamp - a.timestamp).slice(0, 5)
);
</script>