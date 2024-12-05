<template>
  <div class="space-y-6">
    <LoadingOverlay
      v-if="loading"
      message="Fetching transactions..."
    />
    <!-- Header with Refresh -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h2>
      <button @click="fetchData" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
               text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" :disabled="loading">
        <Icon name="heroicons:arrow-path" class="w-5 h-5" :class="{ 'animate-spin': loading }" />
        Refresh
      </button>
    </div>
    <DataTable
      :data="transactions"
      :loading="loading"
    >
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
              class="mt-1 text-gray-700 dark:text-gray-300"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes
            </label>
            <FormTextArea
              v-if="selectedTransaction"
              v-model="notes"
              class="mt-1 text-gray-700 dark:text-gray-300"
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


// Category options for select
const categoryOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
  { value: 'investment', label: 'Investment' },
  { value: 'uncategorized', label: 'Uncategorized' }
];

// Data fetching
const transactionStore = useTransactionStore();
const { transactions, loading } = storeToRefs(transactionStore);
const selectedTransaction = ref<ClientTransaction | null>(null);

const { generateStandardReport } = useStandardTaxCalculator();
// Actions
const openTransactionDetails = (transaction: ClientTransaction) => {
  selectedTransaction.value = {
    ...transaction,
    contentData: {
      ...transaction.contentData,
      notes: transaction.contentData?.notes || ''
    }
  };
};

const fetchData = async () => {
  await transactionStore.fetchTransactions();
};

const saveTransaction = () => {
  if (!selectedTransaction.value) return;
  
  const index = transactions.value.findIndex(
    tx => tx.requestId === selectedTransaction.value?.requestId
  );
  
  if (index !== -1) {
    transactions.value[index] = {
      ...selectedTransaction.value,
      contentData: {
        ...selectedTransaction.value.contentData,
        notes: selectedTransaction.value.contentData?.notes || ''
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

// Create a ref for notes
const notes = ref('');

// Update notes when transaction changes
watch(selectedTransaction, (transaction) => {
  notes.value = transaction?.contentData?.notes || '';
}, { immediate: true });

// Update transaction when notes change
watch(notes, (value) => {
  if (selectedTransaction.value) {
    selectedTransaction.value = {
      ...selectedTransaction.value,
      contentData: {
        ...selectedTransaction.value.contentData,
        notes: value
      }
    };
  }
});
</script> 