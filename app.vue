<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
const walletStore = useWalletStore();
const transactionStore = useTransactionStore();
const { fetchTransactions } = transactionStore;

onMounted(async () => {
  if (walletStore.address) {
    await fetchTransactions();
  }
});
</script>
