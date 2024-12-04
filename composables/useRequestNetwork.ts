import { RequestNetwork, Types } from '@requestnetwork/request-client.js';

export const useRequestNetwork = () => {
    const fetchTransaction = async () => {
        // Only execute on client side
        if (import.meta.server) return [];
        
        try {
            const response = await $fetch('/api/transactions');
            console.log(response)
            return response;
            
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    };

    return { fetchTransaction };
};
