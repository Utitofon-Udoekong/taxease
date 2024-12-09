<template>
  <div class="overflow-hidden bg-white dark:bg-gray-800 shadow ring-1 ring-black ring-opacity-5 rounded-lg">
    <!-- Table Header Actions -->
    <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-3">
      <div class="flex items-center justify-between">
        <!-- Search -->
        <div class="flex-1 max-w-sm">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search transactions..."
            class="block w-full rounded-md border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th
              v-for="column in transactionColumns"
              :key="column.key"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              <div class="flex items-center gap-1">
                {{ column.label }}
                <button
                  v-if="column.sortable"
                  @click="toggleSort(column.key as keyof ClientTransaction)"
                  class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <Icon
                    :name="getSortIcon(column.key)"
                    class="w-4 h-4"
                  />
                </button>
              </div>
            </th>
            <th v-if="$slots.rowActions" scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 dark:text-white">
          <tr
            v-for="transaction in paginatedData"
            :key="transaction.requestId"
            class="hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              {{ new Date(transaction.timestamp * 1000).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <TransactionCategoryBadge :category="transaction.category" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <TransactionAmountDisplay 
                :amount="transaction.amount"
                :currency="transaction.currency"
                :category="transaction.category"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <TransactionStatusBadge :status="transaction.status" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ truncateAddress(transaction.from) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ truncateAddress(transaction.to) }}
            </td>
            <td
              v-if="$slots.rowActions"
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <slot name="rowActions" :item="transaction" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="bg-white dark:bg-gray-800 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 
                 border border-gray-300 dark:border-gray-700"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 
                 border border-gray-300 dark:border-gray-700"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Showing
            <span class="font-medium">{{ startIndex + 1 }}</span>
            to
            <span class="font-medium">{{ endIndex }}</span>
            of
            <span class="font-medium">{{ filteredData.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              v-for="(page, index) in displayedPages"
              :key="index"
              @click="currentPage = Number(page)"
              :class="[
                currentPage === page
                  ? 'z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
              ]"
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const transactionColumns = [
  { key: 'timestamp', label: 'Date', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'from', label: 'From', sortable: true },
  { key: 'to', label: 'To', sortable: true }
] as const;

const props = defineProps<{
  data: ClientTransaction[];
}>();

// State
const searchQuery = ref('');
const currentPage = ref(1);
const sortKey = ref<keyof ClientTransaction>('timestamp');
const sortDirection = ref<'asc' | 'desc'>('desc');
const itemsPerPage = ref(10);

// Computed
const filteredData = computed(() => {
  let result = [...props.data];
  
  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(transaction => 
      transaction.requestId.toLowerCase().includes(query) ||
      transaction.from.toLowerCase().includes(query) ||
      transaction.to.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query) ||
      transaction.status.toLowerCase().includes(query)
    );
  }
  
  // Sort
  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = a[sortKey.value];
      const bVal = b[sortKey.value];
      const modifier = sortDirection.value === 'asc' ? 1 : -1;
      
      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });
  }
  
  return result;
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

const totalPages = computed(() => 
  Math.ceil(filteredData.value.length / itemsPerPage.value)
);

const startIndex = computed(() => 
  (currentPage.value - 1) * itemsPerPage.value
);

const endIndex = computed(() => 
  Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length)
);

const displayedPages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...', total);
    } else if (current >= total - 3) {
      pages.push(1, '...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1, '...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...', total);
    }
  }
  
  return pages;
});

// Methods
const toggleSort = (key: keyof ClientTransaction) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'desc';
  }
};

const getSortIcon = (key: string) => {
  if (sortKey.value !== key) return 'heroicons:arrows-up-down';
  return sortDirection.value === 'asc' 
    ? 'heroicons:chevron-up' 
    : 'heroicons:chevron-down';
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
</script> 