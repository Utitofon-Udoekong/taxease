export const cleanCurrencyName = (currency: string): string => {
  // Handle null/undefined
  if (!currency) return 'ETH';
  
  // Remove network tags and clean up
  return currency
    .split('-')[0]  // Take first part before any dash
    .split('_')[0]  // Take first part before any underscore
    .replace(/[^a-zA-Z]/g, ''); // Remove any non-letter characters
}; 