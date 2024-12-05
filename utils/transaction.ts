import { Types } from "@requestnetwork/request-client.js";

export type TransactionCategory = 'income' | 'expense' | 'investment' | 'uncategorized';
export type TransactionStatus = 'pending' | 'accepted' | 'canceled' | 'rejected';

export interface Transaction {
    requestId: string;
    transactionHash?: string;
    timestamp: number;
    amount: string;
    currency: string;
    status: TransactionStatus;
    category: TransactionCategory;
    from: string;
    to: string;
    metadata?: {
        reason?: string;
        dueDate?: Date;
        tags?: string[];
        notes?: string;
    };
    taxYear: number;
    taxableAmount?: string;
    deductible?: boolean;
    taxCategory?: string;
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
export function normalizeTransaction(rawTx: any): Transaction {
    return {
        requestId: rawTx.requestId || '',
        transactionHash: rawTx.meta?.transactionManagerMeta?.dataAccessMeta?.storageMeta?.[0]?.ethereum?.transactionHash,
        timestamp: rawTx.timestamp || Date.now(),
        amount: rawTx.expectedAmount || '0',
        currency: rawTx.currency || 'ETH',
        status: mapRequestStatus(rawTx.state),
        category: determineCategory(rawTx),
        from: rawTx.payer?.value || '',
        to: rawTx.payee?.value || '',
        metadata: {
            reason: rawTx.contentData?.values?.content?.reason,
            dueDate: rawTx.contentData?.values?.content?.dueDate,
            tags: [],
            notes: ''
        },
        taxYear: new Date(rawTx.timestamp * 1000).getFullYear(),
        deductible: false
    };
}

function mapRequestStatus(status: string): TransactionStatus {
    switch (status) {
        case 'PENDING': return 'pending';
        case 'ACCEPTED': return 'accepted';
        case 'CANCELED': return 'canceled';
        case 'REJECTED': return 'rejected';
        default: return 'pending';
    }
}

function determineCategory(tx: any): TransactionCategory {
    // Basic category determination logic
    if (tx.contentData?.values?.content?.reason?.toLowerCase().includes('income')) {
        return 'income';
    }
    if (tx.contentData?.values?.content?.reason?.toLowerCase().includes('investment')) {
        return 'investment';
    }
    return tx.expectedAmount?.startsWith('-') ? 'expense' : 'income';
} 