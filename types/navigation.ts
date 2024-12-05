
interface NavigationItem {
    name: string;
    to: string;
    icon: string;
    description?: string;
}

export const navigation: NavigationItem[] = [
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