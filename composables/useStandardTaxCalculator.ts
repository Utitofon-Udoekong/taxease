import { formatUnits } from 'viem';


interface TaxSummary {
  totalIncome: string;
  totalExpenses: string;
  netIncome: string;
  totalDeductible: string;
}

export const useStandardTaxCalculator = () => {
  const transactions = ref<Transaction[]>([]);
  const selectedPeriod = ref<{ start: Date; end: Date }>({
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date(new Date().getFullYear(), 11, 31)
  });

  const calculateTaxSummary = (year: number): TaxSummary => {
    const yearStart = new Date(year, 0, 1).getTime() / 1000;
    const yearEnd = new Date(year, 11, 31).getTime() / 1000;
    
    const yearTransactions = transactions.value.filter(tx => 
      tx.timestamp >= yearStart && tx.timestamp <= yearEnd
    );

    const income = yearTransactions
      .filter(tx => tx.category === 'income')
      .reduce((sum, tx) => sum + Number(formatUnits(BigInt(tx.amount), 18)), 0);

    const expenses = yearTransactions
      .filter(tx => tx.category === 'expense')
      .reduce((sum, tx) => sum + Number(formatUnits(BigInt(tx.amount), 18)), 0);

    const deductible = yearTransactions
      .filter(tx => tx.deductible)
      .reduce((sum, tx) => sum + Number(formatUnits(BigInt(tx.amount), 18)), 0);

    return {
      totalIncome: income.toFixed(2),
      totalExpenses: expenses.toFixed(2),
      netIncome: (income - expenses).toFixed(2),
      totalDeductible: deductible.toFixed(2)
    };
  };

  const generateStandardReport = (): StandardTaxReport => {
    const { start, end } = selectedPeriod.value;
    const startTime = start.getTime() / 1000;
    const endTime = end.getTime() / 1000;

    const periodTransactions = transactions.value.filter(tx => 
      tx.timestamp >= startTime && tx.timestamp <= endTime
    );

    // Calculate monthly totals
    const monthlyTotals = new Array(12).fill(null).map((_, month) => {
      const monthTransactions = periodTransactions.filter(tx => 
        new Date(tx.timestamp * 1000).getMonth() === month
      );

      const income = monthTransactions
        .filter(tx => tx.category === 'income')
        .reduce((sum, tx) => sum + Number(formatUnits(BigInt(tx.amount), 18)), 0);

      const expenses = monthTransactions
        .filter(tx => tx.category === 'expense')
        .reduce((sum, tx) => sum + Number(formatUnits(BigInt(tx.amount), 18)), 0);

      return {
        month,
        year: start.getFullYear(),
        income: income.toFixed(2),
        expenses: expenses.toFixed(2),
        net: (income - expenses).toFixed(2)
      };
    });

    // Calculate category totals
    const categoryTotals = periodTransactions.reduce((acc, tx) => {
      const amount = Number(formatUnits(BigInt(tx.amount), 18));
      acc[tx.category] = (acc[tx.category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert transactions to standard format
    const standardTransactions: StandardTaxTransaction[] = periodTransactions.map(tx => ({
      date: new Date(tx.timestamp * 1000),
      transactionId: tx.requestId,
      category: tx.category,
      description: tx.metadata?.notes || '',
      amount: formatUnits(BigInt(tx.amount), 18),
      currency: tx.currency,
      isDeductible: tx.deductible || false,
      payerAddress: tx.from,
      payeeAddress: tx.to,
      status: tx.status
    }));

    const summary = calculateTaxSummary(start.getFullYear());

    return {
      periodStart: start,
      periodEnd: end,
      summary,
      transactions: standardTransactions,
      categoryTotals: Object.fromEntries(
        Object.entries(categoryTotals).map(([k, v]) => [k, v.toFixed(2)])
      ),
      monthlyTotals
    };
  };

  return {
    transactions,
    selectedPeriod,
    calculateTaxSummary,
    generateStandardReport
  };
}; 