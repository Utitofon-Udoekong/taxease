
export type TransactionCategory = 'income' | 'expense' | 'investment' | 'uncategorized';
export type TransactionStatus = 'pending' | 'accepted' | 'canceled' | 'created';

export interface ClientTransaction {
    requestId: string;
    transactionHash?: string;
    timestamp: number;
    amount: string;
    currency: string;
    status: TransactionStatus;
    nonce: number;
    creator: string;
    category: TransactionCategory;
    from: string;
    to: string;
    contentData?: any;
    taxYear?: number;
    taxableAmount?: string;
    deductible?: boolean;
    taxCategory?: string;
}

export interface ServerResponseTransaction {
    requestId: string;
    transactionHash?: string;
    timestamp: number;
    amount: string;
    currency: string;
    status: string;
    from: string;
    to: string;
    nonce: number;
    contentData?: any;
    taxYear?: number;
    creator?: string;
}

export interface TaxSummary {
    year: number;
    totalIncome: string;
    totalExpenses: string;
    netIncome: string;
    totalDeductible: string;
    categorizedExpenses: Record<TransactionCategory, string>;
    monthlyBreakdown: Array<{
        month: number;
        income: string;
        expenses: string;
        net: string;
    }>;
}

// Helper function to convert Request Network transaction to our format
export function normalizeTransaction(serverTx: any): ClientTransaction {
    return {
        requestId: serverTx.requestId || '',
        transactionHash: serverTx.transactionHash,
        timestamp: serverTx.timestamp || Date.now(),
        amount: serverTx.amount,
        currency: serverTx.currency || 'ETH',
        status: serverTx.status,
        category: determineCategory(serverTx.to),
        from: serverTx.from || '',
        to: serverTx.to || '',
        contentData: serverTx.contentData,
        nonce: serverTx.nonce || 0,
        creator: serverTx.creator || '',
        taxYear: serverTx.taxYear,
        deductible: false
    };
}

export function determineCategory(to: string): TransactionCategory {
    if (!to) {
        return 'uncategorized';
    }
    const walletStore = useWalletStore();
    if (to === walletStore.address?.toLowerCase()) {
      return 'income';
    }
    return 'expense';
} 

export function truncateAddress(address: string): string {
    return address.slice(0, 6) + '...' + address.slice(-4);
}