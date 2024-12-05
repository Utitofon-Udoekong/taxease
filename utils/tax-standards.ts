export interface StandardTaxCategory {
    id: string;
    name: string;
    type: 'income' | 'expense' | 'investment';
    description: string;
    isDeductible: boolean;
}

export const standardCategories: StandardTaxCategory[] = [
    {
        id: 'crypto_payment_received',
        name: 'Cryptocurrency Payments Received',
        type: 'income',
        description: 'Payments received in cryptocurrency',
        isDeductible: false
    },
    {
        id: 'crypto_payment_sent',
        name: 'Cryptocurrency Payments Sent',
        type: 'expense',
        description: 'Payments sent in cryptocurrency',
        isDeductible: true
    },
    {
        id: 'service_income',
        name: 'Service Income',
        type: 'income',
        description: 'Income from services provided',
        isDeductible: false
    },
    {
        id: 'business_expense',
        name: 'Business Expenses',
        type: 'expense',
        description: 'General business expenses',
        isDeductible: true
    },
    {
        id: 'investment_income',
        name: 'Investment Income',
        type: 'investment',
        description: 'Income from investments',
        isDeductible: false
    }
];

export interface StandardTaxReport {
    periodStart: Date;
    periodEnd: Date;
    summary: {
        totalIncome: string;
        totalExpenses: string;
        netIncome: string;
        totalDeductible: string;
    };
    transactions: StandardTaxTransaction[];
    categoryTotals: Record<string, string>;
    monthlyTotals: Array<{
        month: number;
        year: number;
        income: string;
        expenses: string;
        net: string;
    }>;
}

export interface StandardTaxTransaction {
    date: Date;
    transactionId: string;
    category: string;
    description: string;
    amount: string;
    currency: string;
    isDeductible: boolean;
    payerAddress: string;
    payeeAddress: string;
    status: string;
} 