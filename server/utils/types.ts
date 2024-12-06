import { Types } from "@requestnetwork/request-client.js";

export type ServerTransactionStatus = 'pending' | 'accepted' | 'canceled' | 'created';
export interface ServerTransaction {
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

// Helper function to convert Request Network transaction to our format
export function normalizeServerTransaction(rawTx: Types.IRequestDataWithEvents): ServerTransaction {
    return {
        nonce: rawTx.nonce || 0,
        creator: rawTx.creator.value,
        requestId: rawTx.requestId || '',
        transactionHash: rawTx.meta?.transactionManagerMeta?.dataAccessMeta?.storageMeta?.[0]?.ethereum?.transactionHash,
        timestamp: rawTx.timestamp || Date.now(),
        amount: rawTx.expectedAmount.valueOf().toString(),
        currency: cleanCurrencyName(rawTx.currency),
        status: rawTx.state,
        from: rawTx.payer?.value || '',
        to: rawTx.payee?.value || '',
        contentData: rawTx.contentData,
        taxYear: new Date(rawTx.timestamp * 1000).getFullYear(),
    };
}

const cleanCurrencyName = (currency: string): string => {
    // Handle null/undefined
    if (!currency) return 'ETH';
    
    // Remove network tags and clean up
    return currency
      .split('-')[0]  // Take first part before any dash
      .split('_')[0]  // Take first part before any underscore
      .replace(/[^a-zA-Z]/g, ''); // Remove any non-letter characters
  };
