import { Types } from "@requestnetwork/request-client.js";

export type ServerTransactionStatus = 'pending' | 'accepted' | 'canceled' | 'created';
export interface ServerTransaction {
    requestId: string;
    transactionHash?: string;
    timestamp: number;
    amount: string;
    currency: string;
    status: ServerTransactionStatus;
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
        currency: rawTx.currency || 'ETH',
        status: mapServerRequestStatus(rawTx.state),
        from: rawTx.payer?.value || '',
        to: rawTx.payee?.value || '',
        contentData: rawTx.contentData,
        taxYear: new Date(rawTx.timestamp * 1000).getFullYear(),
    };
}
 
function mapServerRequestStatus(status: Types.RequestLogic.STATE): ServerTransactionStatus {
    switch (status) {
        case Types.RequestLogic.STATE.PENDING: return 'pending';
        case Types.RequestLogic.STATE.ACCEPTED: return 'accepted';
        case Types.RequestLogic.STATE.CANCELED: return 'canceled';
        case Types.RequestLogic.STATE.CREATED: return 'created';
        default: return 'pending';
    }
}