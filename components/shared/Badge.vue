<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="[
      variantClasses[variant],
      sizeClasses[size]
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
type Variant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  variant?: Variant;
  size?: Size;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md'
});

const variantClasses: Record<Variant, string> = {
  primary: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
  success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  default: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
};
</script> 