export interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    sections: ReportSection[];
    charts: ChartConfig[];
    filters: ReportFilter[];
}

interface ReportSection {
    id: string;
    type: 'summary' | 'transactions' | 'chart' | 'analysis';
    title: string;
    config: any;
}

interface ChartConfig {
    type: 'line' | 'bar' | 'pie';
    title: string;
    dataSource: string;
    options: any;
}

interface ReportFilter {
    field: string;
    operator: 'equals' | 'contains' | 'greater' | 'less';
    value: any;
}

export const reportTemplates: ReportTemplate[] = [
    {
        id: 'quarterly_summary',
        name: 'Quarterly Summary',
        description: 'Detailed quarterly financial report',
        sections: [
            {
                id: 'financial_summary',
                type: 'summary',
                title: 'Financial Overview',
                config: {
                    showTotals: true,
                    showComparison: true,
                    showProjections: true
                }
            },
            {
                id: 'transaction_list',
                type: 'transactions',
                title: 'Transaction Details',
                config: {
                    groupBy: 'category',
                    showDeductible: true
                }
            },
            {
                id: 'category_analysis',
                type: 'analysis',
                title: 'Category Analysis',
                config: {
                    showPercentages: true,
                    includeCharts: true
                }
            }
        ],
        charts: [
            {
                type: 'line',
                title: 'Income vs Expenses',
                dataSource: 'monthlyTotals',
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Amount'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            },
            {
                type: 'pie',
                title: 'Expense Distribution',
                dataSource: 'categoryTotals',
                options: {
                    plugins: {
                        legend: {
                            position: 'right'
                        }
                    }
                }
            }
        ],
        filters: [
            {
                field: 'amount',
                operator: 'greater',
                value: 0
            },
            {
                field: 'status',
                operator: 'equals',
                value: 'completed'
            }
        ]
    }
]; 