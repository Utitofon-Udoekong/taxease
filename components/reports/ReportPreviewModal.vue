<template>
  <Modal @close="$emit('close')">
    <template #title>
      Report Preview
    </template>
    <template #content>
      <div class="space-y-6">
        <!-- Period -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Period</h4>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {{ formatDate(startDate) }} - {{ formatDate(endDate) }}
          </p>
        </div>

        <!-- Summary -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Summary</h4>
          <dl class="mt-2 grid grid-cols-1 gap-2">
            <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <dt class="text-sm text-gray-600 dark:text-gray-400">Total Income</dt>
              <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(summary.totalIncome) }} ETH</dd>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <dt class="text-sm text-gray-600 dark:text-gray-400">Total Expenses</dt>
              <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(summary.totalExpenses) }} ETH</dd>
            </div>
            <div class="flex justify-between py-2">
              <dt class="text-sm text-gray-600 dark:text-gray-400">Net Income</dt>
              <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(summary.netIncome) }} ETH</dd>
            </div>
          </dl>
        </div>

        <!-- Transactions Preview -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Transactions</h4>
          <div class="max-h-60 overflow-y-auto">
            <div
              v-for="tx in transactions.slice(0, 5)"
              :key="tx.requestId"
              class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <div class="flex items-center space-x-3">
                <TransactionCategoryBadge :category="tx.category" />
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(tx.timestamp) }}
                </span>
              </div>
              <TransactionAmountDisplay
                :amount="tx.amount"
                :currency="tx.currency"
                :category="tx.category"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 dark:text-gray-300"
        >
          Close
        </button>
        <button
          @click="$emit('generate')"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Generate Report
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">

interface Props {
  startDate: Date;
  endDate: Date;
  transactions: ClientTransaction[];
  summary: {
    totalIncome: string;
    totalExpenses: string;
    netIncome: string;
  };
}

defineProps<Props>();

defineEmits<{
  (e: 'close'): void;
  (e: 'generate'): void;
}>();

const formatDate = (timestamp: number | Date) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp * 1000);
  return date.toLocaleDateString();
};

const formatCurrency = (value: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(value));
};
</script> 