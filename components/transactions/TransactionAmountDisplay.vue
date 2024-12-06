<template>
  <span
    :class="[
      'font-mono',
      amountClass
    ]"
  >
    {{ formattedAmount }}
  </span>
</template>

<script setup lang="ts">
import { formatUnits } from 'viem';
import { cleanCurrencyName } from '@/utils/currency';

interface Props {
  amount: string;
  currency?: string;
  showSign?: boolean;
  category?: TransactionCategory;
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'ETH',
  showSign: true
});

const formattedAmount = computed(() => {
  const value = formatUnits(BigInt(props.amount), 18);
  const numValue = parseFloat(value);
  const formatted = Math.abs(numValue).toFixed(4);
  const sign = props.showSign && numValue > 0 && props.category !== 'expense' ? '+' : '';
  return `${sign}${formatted} ${cleanCurrencyName(props.currency)}`;
});

const amountClass = computed(() => {
  // const value = parseFloat(formatUnits(BigInt(props.amount), 18));
  if (props.category === 'income') return 'text-green-600 dark:text-green-400';
  if (props.category === 'expense') return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-400';
});
</script> 