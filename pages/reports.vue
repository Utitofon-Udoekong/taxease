<template>
  <div class="space-y-6">
    <LoadingOverlay
      v-if="loading"
      message="Fetching transactions..."
    />
    <!-- Report Generation Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Generate Tax Report</h3>
      <ReportGenerationForm
        v-model="reportConfig"
        @generate="generateReport"
      />
    </div>

    <!-- Report Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ReportSummaryCard
        title="Total Income"
        subtitle="Current Period"
        :main-value="formatCurrency(summary.totalIncome)"
        trend-value="+15.3%"
        trend-direction="up"
        icon="heroicons:banknotes"
      />
      <ReportSummaryCard
        title="Total Expenses"
        subtitle="Current Period"
        :main-value="formatCurrency(summary.totalExpenses)"
        trend-value="-8.4%"
        trend-direction="down"
        icon="heroicons:credit-card"
      />
      <ReportSummaryCard
        title="Net Income"
        subtitle="Current Period"
        :main-value="formatCurrency(summary.netIncome)"
        trend-value="+23.7%"
        trend-direction="up"
        icon="heroicons:calculator"
        :breakdown="{
          'Taxable Income': formatCurrency(summary.totalIncome),
          'Deductions': formatCurrency(summary.totalDeductible),
          'Tax Estimate': formatCurrency(calculateTaxEstimate())
        }"
      />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Breakdown</h3>
        <TrendChart
          title="Income vs Expenses"
          :data="monthlyChartData"
          :loading="loading"
        />
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Category Distribution</h3>
        <DistributionChart
          title="Expenses by Category"
          :data="categoryChartData"
          :loading="loading"
        />
      </div>
    </div>

    <!-- Transaction List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Transactions</h3>
      </div>
      <DataTable
        :columns="columns"
        :data="filteredTransactions"
        :loading="loading"
      >
        <template #cell-date="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell-category="{ value }">
          <TransactionCategoryBadge :category="value" />
        </template>
        <template #cell-amount="{ item }">
          <TransactionAmountDisplay
            :amount="item.amount"
            :currency="item.currency"
          />
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">

// State
const reportConfig = ref({
  startDate: new Date(new Date().getFullYear(), 0, 1),
  endDate: new Date(),
  format: 'csv'
});

// Data fetching
const { transactions, loading } = storeToRefs(useTransactionStore());

// onMounted(async () => {
//   try {
//     const data = await fetchTransaction();
//     console.log(data);
//     transactions.value = data as ClientTransaction[];
//   } catch (error) {
//     console.error('Error fetching transactions:', error);
//   } finally {
//     loading.value = false;
//   }
// });

// Table configuration
const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'deductible', label: 'Deductible', sortable: true }
];

// Data fetching and processing
const { generateStandardReport } = useStandardTaxCalculator();

const report = computed(() => generateStandardReport());
const summary = computed(() => report.value.summary);

const monthlyChartData = computed(() => ({
  labels: report.value.monthlyTotals.map(m => `${m.month}/${m.year}`),
  values: report.value.monthlyTotals.map(m => Number(m.net))
}));

const categoryChartData = computed(() => 
  Object.entries(report.value.categoryTotals).map(([label, value]) => ({
    label,
    value: Number(value)
  }))
);

const filteredTransactions = computed(() => 
  report.value.transactions.filter(tx => 
    new Date(tx.timestamp).getTime() >= reportConfig.value.startDate.getTime() &&
    new Date(tx.timestamp).getTime() <= reportConfig.value.endDate.getTime()
  )
);

// Actions
const generateReport = async () => {
  // Implementation
};

// Helpers
const formatCurrency = (value: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(value));
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

const calculateTaxEstimate = () => {
  // Implement basic tax calculation
  const taxableIncome = Number(summary.value.totalIncome) - Number(summary.value.totalDeductible);
  return (taxableIncome * 0.3).toString(); // Simple 30% tax rate for example
};
</script> 