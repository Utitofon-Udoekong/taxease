import { defineStore } from 'pinia';

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<ClientTransaction[]>([]);
  const loading = ref(false);
  const walletStore = useWalletStore();

  const fetchTransactions = async () => {
    if (import.meta.server) return;
    if (!walletStore.address) return;
    
    try {
      loading.value = true;
      const response = await $fetch('/api/transactions', {
        params: {
          address: walletStore.address
        }
      });
      transactions.value = (response as ServerResponseTransaction[]).map(normalizeTransaction);
      console.log(transactions.value);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Watch for wallet changes
  watch(() => walletStore.address, (newAddress) => {
    if (newAddress) {
      fetchTransactions();
    } else {
      transactions.value = [];
    }
  });

  return {
    transactions,
    loading,
    fetchTransactions
  };
}); 