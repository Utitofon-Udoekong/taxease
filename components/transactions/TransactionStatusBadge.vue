<template>
  <Badge
    :variant="statusVariant"
    class="whitespace-nowrap"
  >
    <Icon
      :name="statusIcon"
      class="w-3 h-3 mr-1"
    />
    {{ formatStatus(status) }}
  </Badge>
</template>

<script setup lang="ts">
import type { TransactionStatus } from '@/utils/transaction';

interface Props {
  status: TransactionStatus;
}

const props = defineProps<Props>();

const statusVariant = computed(() => {
  const variants: Record<TransactionStatus, 'warning' | 'success' | 'error' | 'default'> = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'error',
    canceled: 'default'
  };
  return variants[props.status];
});

const statusIcon = computed(() => {
  const icons: Record<TransactionStatus, string> = {
    pending: 'heroicons:clock',
    accepted: 'heroicons:check-circle',
    rejected: 'heroicons:x-circle',
    canceled: 'heroicons:no-symbol'
  };
  return icons[props.status];
});

const formatStatus = (status: TransactionStatus) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
</script> 