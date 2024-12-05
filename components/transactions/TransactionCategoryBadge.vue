<template>
  <Badge
    :variant="categoryVariant"
    class="whitespace-nowrap"
  >
    <Icon
      :name="categoryIcon"
      class="w-3 h-3 mr-1"
    />
    {{ formatCategory(category) }}
  </Badge>
</template>

<script setup lang="ts">
import type { TransactionCategory } from '@/utils/transaction';

interface Props {
  category: TransactionCategory;
}

const props = defineProps<Props>();

const categoryVariant = computed(() => {
  const variants: Record<TransactionCategory, 'success' | 'error' | 'warning' | 'info'> = {
    income: 'success',
    expense: 'error',
    investment: 'info',
    uncategorized: 'warning'
  };
  return variants[props.category];
});

const categoryIcon = computed(() => {
  const icons: Record<TransactionCategory, string> = {
    income: 'heroicons:arrow-trending-up',
    expense: 'heroicons:arrow-trending-down',
    investment: 'heroicons:banknotes',
    uncategorized: 'heroicons:question-mark-circle'
  };
  return icons[props.category];
});

const formatCategory = (category: TransactionCategory) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};
</script> 