export interface PriceData {
    timestamp: number;
    currency: string;
    priceUSD: number;
}

export interface CurrencyConversion {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    timestamp: number;
} 