<template>
  <div class="space-y-6">
    <DataTable
      :columns="columns"
      :data="transactions"
      :loading="loading"
    >
      <!-- Custom cell renderers -->
      <template #cell-date="{ value }">
        {{ new Date(value * 1000).toLocaleDateString() }}
      </template>

      <template #cell-category="{ value }">
        <TransactionCategoryBadge :category="value" />
      </template>

      <template #cell-status="{ value }">
        <TransactionStatusBadge :status="value" />
      </template>

      <template #cell-amount="{ item }">
        <TransactionAmountDisplay
          :amount="item.amount"
          :currency="item.currency"
        />
      </template>

      <!-- Actions slot -->
      <template #actions>
        <button
          @click="exportData"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Export
        </button>
      </template>

      <!-- Row actions -->
      <template #rowActions="{ item }">
        <button
          @click="openTransactionDetails(item)"
          class="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400"
        >
          <Icon name="heroicons:eye" class="w-5 h-5" />
        </button>
      </template>
    </DataTable>

    <!-- Transaction Details Modal -->
    <Modal
      v-if="selectedTransaction"
      @close="selectedTransaction = null"
    >
      <template #title>
        Transaction Details
      </template>
      <template #content>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <FormSelect
              v-model="selectedTransaction.category"
              :options="categoryOptions"
              class="mt-1"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes
            </label>
            <FormTextArea
              v-model="selectedTransaction?.metadata?.notes"
              class="mt-1"
            />
          </div>
          <div>
            <FormCheckbox
              v-model="selectedTransaction.deductible"
              label="Tax Deductible"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="selectedTransaction = null"
            class="px-4 py-2 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            @click="saveTransaction"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </template>
    </Modal>

    <ExportFormatModal
      v-if="showExportModal"
      @close="showExportModal = false"
      @select="handleFormatSelect"
    />
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'dashboard'
});

const { generateStandardReport } = useStandardTaxCalculator();

// Table configuration
const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
];

// Category options for select
const categoryOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'investment', label: 'Investment' },
  { value: 'uncategorized', label: 'Uncategorized' }
];

// Data fetching
const { fetchTransaction } = useRequestNetwork();
const transactions = ref<Transaction[]>([]);
const loading = ref(true);
const selectedTransaction = ref<Transaction | null>(null);

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

// Actions
const openTransactionDetails = (transaction: Transaction) => {
  selectedTransaction.value = {
    ...transaction,
    metadata: {
      ...transaction.metadata,
      notes: transaction.metadata?.notes || ''
    }
  };
};

const saveTransaction = () => {
  if (!selectedTransaction.value) return;
  
  const index = transactions.value.findIndex(
    tx => tx.requestId === selectedTransaction.value?.requestId
  );
  
  if (index !== -1) {
    transactions.value[index] = {
      ...selectedTransaction.value,
      metadata: {
        ...selectedTransaction.value.metadata,
        notes: selectedTransaction.value.metadata?.notes || ''
      }
    };
  }
  
  selectedTransaction.value = null;
};

const showExportModal = ref(false);
let resolveFormat: ((format: string | null) => void) | null = null;

const selectExportFormat = () => {
  return new Promise<string | null>((resolve) => {
    showExportModal.value = true;
    resolveFormat = resolve;
  });
};

const handleFormatSelect = (format: string) => {
  showExportModal.value = false;
  resolveFormat?.(format);
};

const exportData = async () => {
  try {
    const format = await selectExportFormat();
    if (!format) return;
    
    const report = generateStandardReport();
    const exporter = exportFormats.find(f => f.id === format);
    if (!exporter) throw new Error('Export format not found');
    
    const output = exporter.generate(report);
    downloadFile(output, `tax-report${exporter.extension}`, format);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};

// Helper functions
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
</script> 