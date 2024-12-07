<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <!-- Top Navbar -->
    <nav class="fixed top-0 z-30 w-full bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-900/50">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo and Mobile Menu Button -->
          <div class="flex items-center">
            <button
              @click="isSidebarOpen = !isSidebarOpen"
              class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            >
              <Icon 
                :name="isSidebarOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" 
                class="h-6 w-6"
              />
            </button>
            <div class="flex items-center lg:hidden ml-2">
              <Logo />
            </div>
          </div>

          <div class="hidden lg:flex lg:items-center lg:space-x-6">
            <Logo />
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex lg:items-center lg:space-x-6">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg dark:text-white"
              :exact-active-class="'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'"
            >
              <Icon :name="item.icon" class="h-5 w-5 mr-2" />
              {{ item.name }}
            </NuxtLink>
          </div>

          <!-- Right side actions -->
          <div class="flex items-center space-x-4">
            <WalletConnect />
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Sidebar -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-20 lg:hidden"
      @click="isSidebarOpen = false"
    >
      <div class="fixed inset-0 bg-black/50"></div>
      <div class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-lg overflow-y-auto">
        <div class="flex flex-col h-full">
          <!-- Logo -->
          <div class="flex items-center justify-center h-16 px-4 bg-indigo-600 dark:bg-indigo-700">
            <h1 class="text-xl font-bold text-white">TaxEase</h1>
          </div>

          <!-- Mobile Navigation -->
          <nav class="flex-1 px-4 py-6 space-y-1">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              class="flex items-center px-4 py-2 text-sm font-medium rounded-lg dark:text-white"
              :exact-active-class="'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'"
              @click="isSidebarOpen = false"
            >
              <Icon :name="item.icon" class="h-5 w-5 mr-3" />
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="pt-16">
      <!-- Page Content -->
      <main class="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <!-- Page Title -->
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {{ pageTitle }}
            </h2>
          </div>

          <slot />
        </div>
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
// Add mobile menu state
const isSidebarOpen = ref(false);

interface NavigationItem {
    name: string;
    to: string;
    icon: string;
    description?: string;
}

const navigation: NavigationItem[] = [
    {
        name: 'Dashboard',
        to: '/',
        icon: 'heroicons:home',
        description: 'Overview of your financial activity'
    },
    {
        name: 'Transactions',
        to: '/transactions',
        icon: 'heroicons:credit-card',
        description: 'Manage and categorize your transactions'
    },
    {
        name: 'Tax Reports',
        to: '/reports',
        icon: 'heroicons:document-text',
        description: 'Generate and view tax reports'
    },
    {
        name: 'Analytics',
        to: '/analytics',
        icon: 'heroicons:chart-bar',
        description: 'Detailed financial analytics and insights'
    },
    // {
    //     name: 'Settings',
    //     to: '/settings',
    //     icon: 'heroicons:cog-6-tooth',
    //     description: 'Configure your account and preferences'
    // }
]; 

const route = useRoute();
const pageTitle = computed(() => {
  const currentRoute = navigation.find(item => item.to === route.path);
  return currentRoute?.name || 'Dashboard';
});

</script> 