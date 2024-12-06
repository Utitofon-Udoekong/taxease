import { formatUnits } from 'viem';

export const formatEthers = (amount: number) => {
    const value = formatUnits(BigInt(amount), 18);
    const numValue = parseFloat(value);
    return numValue.toFixed(2);
};

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