
export const categorizeTransaction = (to?: string | null): TransactionCategory => {
    if (!to) {
        return 'uncategorized';
    }
    const walletStore = useWalletStore();
    if (to === walletStore.address?.toLowerCase()) {
      return 'income';
    }
    return 'expense';
  };