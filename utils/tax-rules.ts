export interface CountryTaxRule {
    countryCode: string;
    countryName: string;
    currency: string;
    taxYearStart: number; // Month (1-12)
    taxYearEnd: number; // Month (1-12)
    categories: TaxCategory[];
    deductibles: DeductibleCategory[];
    taxBrackets: TaxBracket[];
    reportFormat: ReportFormat;
}

interface TaxCategory {
    id: string;
    name: string;
    description: string;
    type: 'income' | 'expense' | 'investment';
    taxRate?: number;
}

interface DeductibleCategory {
    id: string;
    name: string;
    description: string;
    maxAmount?: string;
    percentage?: number;
}

interface TaxBracket {
    min: string;
    max: string;
    rate: number;
    deduction?: string;
}

interface ReportFormat {
    id: string;
    name: string;
    fields: ReportField[];
    sections: ReportSection[];
}

interface ReportField {
    id: string;
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    required: boolean;
}

interface ReportSection {
    id: string;
    name: string;
    fields: string[]; // References to ReportField ids
}

// Example tax rules for different countries
export const countryTaxRules: Record<string, CountryTaxRule> = {
    US: {
        countryCode: 'US',
        countryName: 'United States',
        currency: 'USD',
        taxYearStart: 1, // January
        taxYearEnd: 12,  // December
        categories: [
            {
                id: 'w2_income',
                name: 'W2 Income',
                description: 'Employment income reported on W2',
                type: 'income'
            },
            {
                id: 'crypto_trading',
                name: 'Cryptocurrency Trading',
                description: 'Gains/losses from crypto trading',
                type: 'investment'
            },
            // Add more US-specific categories
        ],
        deductibles: [
            {
                id: 'business_expenses',
                name: 'Business Expenses',
                description: 'Expenses related to business operations'
            }
            // Add more US-specific deductibles
        ],
        taxBrackets: [
            { min: '0', max: '11000', rate: 0.10 },
            { min: '11001', max: '44725', rate: 0.12 },
            // Add more brackets
        ],
        reportFormat: {
            id: 'form_1040',
            name: 'Form 1040',
            fields: [
                { id: 'ssn', name: 'Social Security Number', type: 'string', required: true },
                // Add more fields
            ],
            sections: [
                {
                    id: 'income',
                    name: 'Income',
                    fields: ['w2_income', 'crypto_trading']
                }
                // Add more sections
            ]
        }
    },
    UK: {
        countryCode: 'UK',
        countryName: 'United Kingdom',
        currency: 'GBP',
        taxYearStart: 4, // April
        taxYearEnd: 3,   // March
        categories: [
            {
                id: 'paye_income',
                name: 'PAYE Income',
                description: 'Employment income under PAYE',
                type: 'income'
            }
            // Add UK-specific categories
        ],
        deductibles: [
            {
                id: 'pension_contributions',
                name: 'Pension Contributions',
                description: 'Contributions to registered pension schemes'
            }
            // Add UK-specific deductibles
        ],
        taxBrackets: [
            { min: '0', max: '12570', rate: 0 },
            { min: '12571', max: '50270', rate: 0.20 }
            // Add more brackets
        ],
        reportFormat: {
            id: 'self_assessment',
            name: 'Self Assessment Tax Return',
            fields: [
                { id: 'utr', name: 'Unique Taxpayer Reference', type: 'string', required: true }
                // Add more fields
            ],
            sections: [
                {
                    id: 'income_sources',
                    name: 'Income Sources',
                    fields: ['paye_income']
                }
                // Add more sections
            ]
        }
    }
    // Add more countries
}; 