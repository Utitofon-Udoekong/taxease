import { formatUnits, parseUnits } from 'viem';

export const useTaxCalculator = () => {
    const transactions = ref<Transaction[]>([]);

    // Calculate tax summary for a specific year
    const calculateTaxSummary = (year: number): TaxSummary => {
        const yearTransactions = transactions.value.filter(tx => tx.taxYear === year);
        
        const summary: TaxSummary = {
            year,
            totalIncome: '0',
            totalExpenses: '0',
            netIncome: '0',
            totalDeductible: '0',
            categorizedExpenses: {
                income: '0',
                expense: '0',
                investment: '0',
                uncategorized: '0'
            },
            monthlyBreakdown: Array(12).fill(null).map((_, i) => ({
                month: i + 1,
                income: '0',
                expenses: '0',
                net: '0'
            }))
        };

        yearTransactions.forEach(tx => {
            const amount = parseUnits(tx.amount, 18);
            const month = new Date(tx.timestamp * 1000).getMonth();

            if (tx.category === 'income') {
                summary.totalIncome = (BigInt(summary.totalIncome) + amount).toString();
                summary.monthlyBreakdown[month].income = (
                    BigInt(summary.monthlyBreakdown[month].income) + amount
                ).toString();
            } else if (tx.category === 'expense') {
                summary.totalExpenses = (BigInt(summary.totalExpenses) + amount).toString();
                summary.monthlyBreakdown[month].expenses = (
                    BigInt(summary.monthlyBreakdown[month].expenses) + amount
                ).toString();
                
                if (tx.deductible) {
                    summary.totalDeductible = (BigInt(summary.totalDeductible) + amount).toString();
                }
            }

            summary.categorizedExpenses[tx.category] = (
                BigInt(summary.categorizedExpenses[tx.category]) + amount
            ).toString();
        });

        // Calculate net income and monthly nets
        summary.netIncome = (BigInt(summary.totalIncome) - BigInt(summary.totalExpenses)).toString();
        summary.monthlyBreakdown.forEach(month => {
            month.net = (BigInt(month.income) - BigInt(month.expenses)).toString();
        });

        return summary;
    };

    // Generate tax report in CSV format
    const generateTaxReport = (year: number): string => {
        const yearTransactions = transactions.value.filter(tx => tx.taxYear === year);
        
        const headers = [
            'Date',
            'Category',
            'Amount',
            'Currency',
            'Status',
            'From',
            'To',
            'Deductible',
            'Notes'
        ].join(',');

        const rows = yearTransactions.map(tx => [
            new Date(tx.timestamp * 1000).toISOString().split('T')[0],
            tx.category,
            formatUnits(BigInt(tx.amount), 18),
            tx.currency,
            tx.status,
            tx.from,
            tx.to,
            tx.deductible ? 'Yes' : 'No',
            tx.metadata?.notes || ''
        ].join(','));

        return [headers, ...rows].join('\n');
    };

    // Categorize a transaction
    const categorizeTransaction = (
        transactionId: string,
        category: TransactionCategory,
        deductible: boolean = false,
        notes?: string
    ) => {
        const index = transactions.value.findIndex(tx => tx.requestId === transactionId);
        if (index !== -1) {
            transactions.value[index] = {
                ...transactions.value[index],
                category,
                deductible,
                metadata: {
                    ...transactions.value[index].metadata,
                    notes: notes || transactions.value[index].metadata?.notes
                }
            };
        }
    };

    return {
        transactions,
        calculateTaxSummary,
        generateTaxReport,
        categorizeTransaction
    };
}; 