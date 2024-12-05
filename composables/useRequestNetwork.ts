
export const useRequestNetwork = () => {
    const fetchTransaction = async () => {
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
