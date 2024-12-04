const isDark = ref(true); // Default to dark mode

export function useDarkMode() {
  // Initialize on mount
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    isDark.value = savedTheme ? savedTheme === 'dark' : true;
    updateTheme();
  });

  function updateTheme() {
    // Update document class
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  }

  function toggleDarkMode() {
    isDark.value = !isDark.value;
    updateTheme();
  }

  // Watch for changes
  watch(isDark, updateTheme);

  return {
    isDark,
    toggleDarkMode
  };
} 