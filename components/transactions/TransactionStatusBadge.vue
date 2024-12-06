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

interface Props {
  status: TransactionStatus;
}

const props = defineProps<Props>();

const statusVariant = computed(() => {
  const variants: Record<TransactionStatus, "pending" | "accepted" | "canceled" | "created"> = {
    pending: 'pending',
    accepted: 'accepted',
    canceled: 'canceled',
    created: 'created'
  };
  return variants[props.status];
});

const statusIcon = computed(() => {
  const icons: Record<TransactionStatus, string> = {
    pending: 'heroicons:clock',
    accepted: 'heroicons:check-circle',
    canceled: 'heroicons:no-symbol',
    created: 'heroicons:plus-circle'
  };
  return icons[props.status];
});

const formatStatus = (status: TransactionStatus) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
</script> 