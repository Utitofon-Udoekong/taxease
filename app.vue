<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
const transactionStore = useTransactionStore();
const { fetchTransactions } = transactionStore;

onMounted(async () => {
  await fetchTransactions();
});
</script>
