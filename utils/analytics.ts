import type { Transaction } from './transaction';

export interface AnalyticsMetric {
  id: string;
  name: string;
  description?: string;
  calculation: (txs: Transaction[]) => number;
  format: (value: number) => string;
  trend?: (current: number, previous: number) => {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
}

export const metrics: AnalyticsMetric[] = [
  {
    id: 'average_transaction_value',
    name: 'Average Transaction Value',
    description: 'Average value of all transactions',
    calculation: (txs) => {
      const sum = txs.reduce((acc, tx) => acc + Number(tx.amount), 0);
      return txs.length ? sum / txs.length : 0;
    },
    format: (value) => value.toFixed(2),
    trend: (current, previous) => {
      const diff = current - previous;
      return {
        direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
        percentage: previous ? (Math.abs(diff) / previous) * 100 : 0
      };
    }
  },
  {
    id: 'transaction_volume',
    name: 'Transaction Volume',
    description: 'Total number of transactions',
    calculation: (txs) => txs.length,
    format: (value) => value.toString(),
    trend: (current, previous) => ({
      direction: current > previous ? 'up' : current < previous ? 'down' : 'neutral',
      percentage: previous ? ((current - previous) / previous) * 100 : 0
    })
  },
  {
    id: 'success_rate',
    name: 'Success Rate',
    description: 'Percentage of successful transactions',
    calculation: (txs) => {
      const successful = txs.filter(tx => tx.status === 'accepted').length;
      return txs.length ? (successful / txs.length) * 100 : 0;
    },
    format: (value) => `${value.toFixed(1)}%`
  },
  {
    id: 'deductible_ratio',
    name: 'Deductible Ratio',
    description: 'Percentage of deductible expenses',
    calculation: (txs) => {
      const deductible = txs.filter(tx => tx.deductible).length;
      return txs.length ? (deductible / txs.length) * 100 : 0;
    },
    format: (value) => `${value.toFixed(1)}%`
  },
  {
    id: 'income_expense_ratio',
    name: 'Income/Expense Ratio',
    description: 'Ratio of income to expenses',
    calculation: (txs) => {
      const income = txs
        .filter(tx => tx.category === 'income')
        .reduce((sum, tx) => sum + Number(tx.amount), 0);
      const expenses = txs
        .filter(tx => tx.category === 'expense')
        .reduce((sum, tx) => sum + Number(tx.amount), 0);
      return expenses ? income / expenses : 0;
    },
    format: (value) => value.toFixed(2)
  },
  {
    id: 'average_daily_volume',
    name: 'Average Daily Volume',
    description: 'Average number of transactions per day',
    calculation: (txs) => {
      if (!txs.length) return 0;
      const dates = txs.map(tx => new Date(tx.timestamp * 1000).toDateString());
      const uniqueDays = new Set(dates).size;
      return txs.length / uniqueDays;
    },
    format: (value) => value.toFixed(1)
  }
];

export const calculateMetrics = (
  transactions: Transaction[],
  metricIds?: string[]
) => {
  const metricsToCalculate = metricIds 
    ? metrics.filter(m => metricIds.includes(m.id))
    : metrics;

  return metricsToCalculate.map(metric => ({
    id: metric.id,
    name: metric.name,
    description: metric.description,
    value: metric.calculation(transactions),
    formatted: metric.format(metric.calculation(transactions))
  }));
};

export const calculateTrends = (
  current: Transaction[],
  previous: Transaction[],
  metricIds?: string[]
) => {
  const metricsToCalculate = metricIds 
    ? metrics.filter(m => metricIds.includes(m.id))
    : metrics;

  return metricsToCalculate
    .filter(metric => metric.trend)
    .map(metric => {
      const currentValue = metric.calculation(current);
      const previousValue = metric.calculation(previous);
      return {
        id: metric.id,
        name: metric.name,
        current: metric.format(currentValue),
        previous: metric.format(previousValue),
        trend: metric.trend!(currentValue, previousValue)
      };
    });
}; 