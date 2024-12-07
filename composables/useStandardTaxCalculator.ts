
interface TaxSummary {
    totalIncome: string;
    totalExpenses: string;
    netIncome: string;
    totalDeductible: string;
}

export const useStandardTaxCalculator = () => {
    const transactionStore = useTransactionStore();
    const { transactions } = storeToRefs(transactionStore);
    const calculateTaxSummary = (year: number): TaxSummary => {
        const yearStart = new Date(year, 0, 1).getTime() / 1000;
        const yearEnd = new Date(year, 11, 31).getTime() / 1000;

        const yearTransactions = transactions.value.filter(tx =>
            tx.timestamp >= yearStart && tx.timestamp <= yearEnd
        );

        const income = yearTransactions
            .filter(tx => tx.category === 'income')
            .reduce((sum, tx) => sum + Number(tx.amount), 0);

        const expenses = yearTransactions
            .filter(tx => tx.category === 'expense')
            .reduce((sum, tx) => sum + Number(tx.amount), 0);

        const deductible = yearTransactions
            .filter(tx => tx.deductible)
            .reduce((sum, tx) => sum + Number(tx.amount), 0);

        return {
            totalIncome: formatEthers(income),
            totalExpenses: formatEthers(expenses),
            netIncome: formatEthers(income - expenses),
            totalDeductible: formatEthers(deductible)
        };
    };

    const defaultStartDate = ref(new Date(new Date().getFullYear(), 0, 1));
    const defaultEndDate = ref(new Date(new Date().getFullYear(), 11, 31));

    const generateStandardReport = (startDate: Date = defaultStartDate.value, endDate: Date = defaultEndDate.value): StandardTaxReport => {
        const startTime = startDate.getTime() / 1000;
        const endTime = endDate.getTime() / 1000;

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
                .reduce((sum, tx) => sum + Number(tx.amount), 0);

            const expenses = monthTransactions
                .filter(tx => tx.category === 'expense')
                .reduce((sum, tx) => sum + Number(tx.amount), 0);

            return {
                month,
                year: startDate.getFullYear(),
                income: formatEthers(income),
                expenses: formatEthers(expenses),
                net: formatEthers(income - expenses)
            };
        });

        // Calculate category totals
        const categoryTotals = periodTransactions.reduce((acc, tx) => {
            const amount = Number(tx.amount);
            acc[tx.category] = (acc[tx.category] || 0) + amount;
            return acc;
        }, {} as Record<string, number>);

        const summary = calculateTaxSummary(startDate.getFullYear());

        return {
            periodStart: startDate,
            periodEnd: endDate,
            summary,
            transactions: periodTransactions,
            categoryTotals: Object.fromEntries(
                Object.entries(categoryTotals).map(([k, v]) => [k, v.toFixed(2)])
            ),
            monthlyTotals
        };
    };

    return {
        calculateTaxSummary,
        generateStandardReport
    };
}; 