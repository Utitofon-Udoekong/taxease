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
type Variant = "pending" | "accepted" | "canceled" | "created" | "info" | "warning" | "success" | "error";
type Size = 'sm' | 'md' | 'lg';

interface Props {
  variant?: Variant;
  size?: Size;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'pending',
  size: 'md'
});

const variantClasses: Record<Variant, string> = {
  pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  accepted: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  canceled: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  created: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  warning: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
  success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
};
</script> 