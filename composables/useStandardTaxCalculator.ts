import { formatUnits } from 'viem';
import { storeToRefs } from 'pinia';

interface TaxSummary {
    totalIncome: string;
    totalExpenses: string;
    netIncome: string;
    totalDeductible: string;
}
const formattedAmount = (amount: number) => {
    const value = formatUnits(BigInt(amount), 18);
    const numValue = parseFloat(value);
    // const formatted = Math.abs(numValue).toFixed(4);
    return numValue.toFixed(2);
};

export const useStandardTaxCalculator = () => {
    const transactionStore = useTransactionStore();
    const { transactions } = storeToRefs(transactionStore);
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
            .reduce((sum, tx) => sum + Number(tx.amount), 0);
        console.log('income', formattedAmount(income));

        const expenses = yearTransactions
            .filter(tx => tx.category === 'expense')
            .reduce((sum, tx) => sum + Number(tx.amount), 0);
        console.log('expenses', formattedAmount(expenses));

        const deductible = yearTransactions
            .filter(tx => tx.deductible)
            .reduce((sum, tx) => sum + Number(tx.amount), 0);

        return {
            totalIncome: formattedAmount(income),
            totalExpenses: formattedAmount(expenses),
            netIncome: formattedAmount(income - expenses),
            totalDeductible: formattedAmount(deductible)
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
                .reduce((sum, tx) => sum + Number(tx.amount), 0);

            const expenses = monthTransactions
                .filter(tx => tx.category === 'expense')
                .reduce((sum, tx) => sum + Number(tx.amount), 0);

            return {
                month,
                year: start.getFullYear(),
                income: formattedAmount(income),
                expenses: formattedAmount(expenses),
                net: formattedAmount(income - expenses)
            };
        });

        // Calculate category totals
        const categoryTotals = periodTransactions.reduce((acc, tx) => {
            const amount = Number(tx.amount);
            acc[tx.category] = (acc[tx.category] || 0) + amount;
            return acc;
        }, {} as Record<string, number>);

        const summary = calculateTaxSummary(start.getFullYear());

        return {
            periodStart: start,
            periodEnd: end,
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