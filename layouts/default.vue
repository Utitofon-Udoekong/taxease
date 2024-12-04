<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <header class="border-b border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold">TaxEase</h1>
        <div class="flex items-center gap-4">
          <ThemeSwitch />
          <WalletConnect />
        </div>
      </div>
    </header>
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>
