export interface TransactionTag {
    id: string;
    name: string;
    color: string;
    description?: string;
}

export const defaultTags: TransactionTag[] = [
    { id: 'client_payment', name: 'Client Payment', color: '#34D399' },
    { id: 'contractor_payment', name: 'Contractor Payment', color: '#F87171' },
    { id: 'subscription', name: 'Subscription', color: '#60A5FA' },
    { id: 'service_fee', name: 'Service Fee', color: '#FBBF24' }
]; 