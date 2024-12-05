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

interface Props {
  amount: string;
  currency?: string;
  showSign?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'ETH',
  showSign: true
});

const formattedAmount = computed(() => {
  const value = formatUnits(BigInt(props.amount), 18);
  const numValue = parseFloat(value);
  const formatted = Math.abs(numValue).toFixed(4);
  const sign = props.showSign && numValue > 0 ? '+' : '';
  return `${sign}${formatted} ${props.currency}`;
});

const amountClass = computed(() => {
  const value = parseFloat(formatUnits(BigInt(props.amount), 18));
  if (value > 0) return 'text-green-600 dark:text-green-400';
  if (value < 0) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-400';
});
</script> 