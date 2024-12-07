
export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<ClientTransaction[]>([]);
  const loading = ref(false);
  // const walletStore = useWalletStore();

  const fetchTransactions = async () => {
    if (import.meta.server) return;
    // if (!'0x519145B771a6e450461af89980e5C17Ff6Fd8A92') return;
    
    try {
      loading.value = true;
      const response = await $fetch('/api/transactions', {
        params: {
          address: '0x519145B771a6e450461af89980e5C17Ff6Fd8A92'
        }
      });
      transactions.value = (response as ServerResponseTransaction[]).map(normalizeTransaction);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Watch for wallet changes
  watch(() => '0x519145B771a6e450461af89980e5C17Ff6Fd8A92', (newAddress) => {
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