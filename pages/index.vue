<template>
  <div>
    <button @click="fetchTransaction" class="bg-blue-500 text-white p-2 rounded">Fetch Transactions</button>
  </div>
</template>

<script lang="ts" setup>
const fetchTransaction = async () => {
  const data = await $fetch('/api/transactions');
  console.log(data)
}
// const { fetchTransaction } = useRequestNetwork();
// onMounted(async () => {
//   const tx = await fetchTransaction();
//   console.log(tx)
// })
</script>

<style>

</style>