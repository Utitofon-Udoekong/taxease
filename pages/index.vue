<template>
  <div class="space-y-6">
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <ReportSummaryCard
        v-for="stat in quickStats"
        :key="stat.title"
        v-bind="stat"
      />
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Transactions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="tx in recentTransactions"
            :key="tx.requestId"
            class="p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <TransactionCategoryBadge :category="tx.category" />
                <div class="mt-1 text-sm text-gray-500">
                  {{ new Date(tx.timestamp * 1000).toLocaleDateString() }}
                </div>
              </div>
              <TransactionAmountDisplay
                :amount="tx.amount"
                :currency="tx.currency"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Overview -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Overview</h3>
        <TrendChart
          title="Income vs Expenses"
          :data="monthlyData"
        />
      </div>
    </div>

    <!-- Category Distribution -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Category Distribution</h3>
      <DistributionChart
        title="Expenses by Category"
        :data="categoryData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStandardTaxCalculator } from '@/composables/useStandardTaxCalculator';
import { useRequestNetwork } from '@/composables/useRequestNetwork';
import type { Transaction } from '@/utils/transaction';

definePageMeta({
  layout: 'dashboard'
});

const { fetchTransaction } = useRequestNetwork();
const { calculateTaxSummary, generateStandardReport } = useStandardTaxCalculator();

// Fetch data
const transactions = ref<Transaction[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await fetchTransaction();
    transactions.value = data as Transaction[];
  } catch (error) {
    console.error('Error fetching transactions:', error);
  } finally {
    loading.value = false;
  }
});

// Chart data computations
const monthlyData = computed(() => {
  const report = generateStandardReport();
  return {
    labels: report.monthlyTotals.map(m => `${m.month}/${report.periodStart.getFullYear()}`),
    values: report.monthlyTotals.map(m => Number(m.net))
  };
});

const categoryData = computed(() => {
  const report = generateStandardReport();
  return Object.entries(report.categoryTotals).map(([label, value]) => ({
    label,
    value: Number(value)
  }));
});

// Computed stats and data
const quickStats = computed(() => {
  const summary = calculateTaxSummary(new Date().getFullYear());
  return [
    {
      title: 'Total Income',
      subtitle: 'Current Period',
      mainValue: summary.totalIncome,
      trendValue: '+12.5%',
      trendDirection: 'up' as const,
      icon: 'heroicons:banknotes'
    },
    {
      title: 'Total Expenses',
      subtitle: 'Current Period',
      mainValue: summary.totalExpenses,
      trendValue: '-5.2%',
      trendDirection: 'down' as const,
      icon: 'heroicons:credit-card'
    },
    {
      title: 'Net Income',
      subtitle: 'Current Period',
      mainValue: summary.netIncome,
      trendValue: '+8.3%',
      trendDirection: 'up' as const,
      icon: 'heroicons:calculator'
    },
    {
      title: 'Pending Transactions',
      subtitle: 'Awaiting Confirmation',
      mainValue: String(transactions.value.filter(tx => tx.status === 'pending').length),
      trendValue: '0%',
      trendDirection: 'neutral' as const,
      icon: 'heroicons:clock'
    }
  ];
});

const recentTransactions = computed(() => 
  transactions.value.slice(0, 5)
);
</script> 