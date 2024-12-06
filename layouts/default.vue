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
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">TaxEase</h1>
            </div>
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
            <ThemeSwitch />
            <button
              @click="toggleNotifications"
              class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon name="heroicons:bell" class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
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

    <!-- Notifications Panel -->
    <div
      v-if="showNotifications"
      class="fixed inset-0 z-40 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity"
      @click="toggleNotifications"
    >
      <div
        class="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl"
        @click.stop
      >
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
          <div class="mt-4 space-y-4">
            <div v-for="notification in notifications" :key="notification.id" class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <span :class="getNotificationIcon(notification.type)" class="p-2 rounded-full">
                  <!-- Icon based on notification type -->
                </span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ notification.title }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ notification.message }}</p>
                <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">{{ notification.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    {
        name: 'Settings',
        to: '/settings',
        icon: 'heroicons:cog-6-tooth',
        description: 'Configure your account and preferences'
    }
]; 

const route = useRoute();
const pageTitle = computed(() => {
  const currentRoute = navigation.find(item => item.to === route.path);
  return currentRoute?.name || 'Dashboard';
});

const showNotifications = ref(false);
const notifications = ref([
  {
    id: 1,
    type: 'info',
    title: 'New Transaction Imported',
    message: 'Successfully imported 5 new transactions',
    time: '5 minutes ago'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Tax Report Due',
    message: 'Quarterly tax report due in 5 days',
    time: '1 hour ago'
  }
]);

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const getNotificationIcon = (type: string) => {
  const classes = {
    base: 'p-2 rounded-full',
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',
    error: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
    success: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
  };
  return `${classes.base} ${classes[type as keyof typeof classes]}`;
};
</script> 