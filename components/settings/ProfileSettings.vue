<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6">
      <!-- Profile Picture -->
      <div class="flex items-center space-x-4">
        <div class="relative">
          <img
            :src="profileImage || 'https://robohash.org/L2F.png?set=set1'"
            alt="Profile"
            class="h-16 w-16 rounded-full object-cover"
          />
          <button
            type="button"
            class="absolute bottom-0 right-0 rounded-full bg-white dark:bg-gray-800 p-1 shadow-sm border border-gray-300 dark:border-gray-700"
            @click="triggerImageUpload"
          >
            <Icon name="heroicons:pencil" class="w-4 h-4 text-gray-500" />
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">Profile Picture</h4>
          <p class="text-sm text-gray-500">JPG or PNG. Max size of 1MB</p>
        </div>
      </div>

      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <input
          type="text"
          v-model="localSettings.name"
          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 
                 bg-white dark:bg-gray-800 px-3 py-2"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          v-model="localSettings.email"
          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 
                 bg-white dark:bg-gray-800 px-3 py-2"
        />
      </div>

      <!-- Notification Preferences -->
      <div>
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
          Notification Preferences
        </h4>
        <div class="space-y-4">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="localSettings.notifications.email"
              class="rounded border-gray-300 dark:border-gray-700 text-indigo-600"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Email Notifications
            </span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="localSettings.notifications.push"
              class="rounded border-gray-300 dark:border-gray-700 text-indigo-600"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Push Notifications
            </span>
          </label>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Save Changes
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
interface ProfileSettings {
  name: string;
  email: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

const props = defineProps<{
  modelValue: ProfileSettings;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ProfileSettings): void;
  (e: 'save', value: ProfileSettings): void;
}>();

const localSettings = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const fileInput = ref<HTMLInputElement | null>(null);
const profileImage = ref<string | null>(null);

const triggerImageUpload = () => {
  fileInput.value?.click();
};

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = () => {
  emit('save', localSettings.value);
};
</script> 