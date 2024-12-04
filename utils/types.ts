// import type { Types } from "@requestnetwork/request-client.js";

export type TransactionCategory = 'income' | 'expense' | 'investment' | 'uncategorized';
export interface ClientTransaction {
    transactionHash: string;
    timestamp: number;
    // amount: Types.RequestLogic.Amount;
    currency: string;
    // status: Types.RequestLogic.STATE;
    from: string | null;
    to: string | null
    metadata: any;
    category: TransactionCategory;
}

