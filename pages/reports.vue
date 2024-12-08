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
        v-model:startDate="startDate"
        v-model:endDate="endDate"
        v-model:format="format"
        @preview="handlePreview"
        @generate="generateReport"
      />
    </div>

    <!-- Report Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ReportSummaryCard
        title="Total Income"
        subtitle="Current Period"
        :main-value="summary.totalIncome + ' ETH'"
        trend-value="+15.3%"
        trend-direction="up"
        icon="heroicons:banknotes"
      />
      <ReportSummaryCard
        title="Total Expenses"
        subtitle="Current Period"
        :main-value="summary.totalExpenses + ' ETH'"
        trend-value="-8.4%"
        trend-direction="down"
        icon="heroicons:credit-card"
        :breakdown="{
          'Income': summary.totalIncome + ' ETH',
          'Expenses': summary.totalExpenses + ' ETH',
          'Net': summary.netIncome + ' ETH'
        }"
      />
      <ReportSummaryCard
        title="Net Income"
        subtitle="Current Period"
        :main-value="summary.netIncome + ' ETH'"
        trend-value="+23.7%"
        trend-direction="up"
        icon="heroicons:calculator"
        :breakdown="{
          'Taxable Income': summary.totalIncome + ' ETH',
          'Deductions': summary.totalDeductible + ' ETH',
          'Tax Estimate': calculateTaxEstimate() + ' ETH'
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


    <!-- Preview Modal -->
    <ReportPreviewModal
      v-if="showPreview"
      :start-date="new Date(startDate)"
      :end-date="new Date(endDate)"
      :transactions="filteredTransactions"
      :summary="summary"
      @close="showPreview = false"
      @generate="generateReport"
    />
  </div>
</template>

<script setup lang="ts">

const startDate = ref(new Date(new Date().getFullYear(), 0, 1));
const endDate = ref(new Date(new Date().getFullYear(), 11, 31));
const format = ref('csv');
const showPreview = ref(false);

const { transactions, loading } = storeToRefs(useTransactionStore());

const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'deductible', label: 'Deductible', sortable: true }
];

const { generateStandardReport } = useStandardTaxCalculator();

const report = computed(() => generateStandardReport(new Date(startDate.value), new Date(endDate.value)));
const summary = computed(() => report.value.summary);

const monthlyChartData = computed(() => ({
  labels: report.value.monthlyTotals.map(m => `${m.month}/${m.year}`),
  values: report.value.monthlyTotals.map(m => Number(m.net))
}));

const categoryChartData = computed(() => 
  Object.entries(report.value.categoryTotals).map(([label, value]) => ({
    label,
    value: formatEthers(Number(value))
  }))
);

const filteredTransactions = computed(() => 
  transactions.value.filter(tx => 
    new Date(tx.timestamp * 1000).getTime() >= new Date(startDate.value).getTime() &&
    new Date(tx.timestamp * 1000).getTime() <= new Date(endDate.value).getTime()
  )
);

// Actions
const generateReport = async () => {
  try {
    const report = generateStandardReport(new Date(startDate.value), new Date(endDate.value));
    const exporter = exportFormats.find(f => f.id === format.value);
    if (!exporter) throw new Error('Export format not found');
    
    const output = exporter.generate(report);
    downloadFile(output, `tax-report${exporter.extension}`, format.value);
  } catch (error) {
    console.error('Error generating report:', error);
  }
};

const handlePreview = () => {
  if (!startDate.value || !endDate.value) {
    console.error('Start and end date are required');
    return;
  }
  showPreview.value = true;
};

watch(startDate, (newVal) => {
  console.log('startDate changed:', newVal);
});

watch(endDate, (newVal) => {
  console.log('endDate changed:', newVal);
});

const downloadFile = (data: string | Blob, filename: string, format: string) => {
  const blob = data instanceof Blob ? data : new Blob([data], {
    type: format === 'csv' 
      ? 'text/csv' 
      : format === 'xlsx'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/pdf'
  });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
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