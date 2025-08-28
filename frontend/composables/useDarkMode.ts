import { ref, computed, onMounted, readonly } from 'vue';

export const useDarkMode = () => {
  // Always force light mode
  const isDark = ref(false);
  const isInitialized = ref(true);

  // Computed property for theme class - always returns empty string for light mode
  const themeClass = computed(() => '');

  // Ensure light mode is applied
  const applyLightMode = () => {
    if (process.client) {
      const html = document.documentElement;
      html.classList.remove('dark');
      // Clear any dark mode preference from localStorage
      localStorage.removeItem('darkMode');
    }
  };

  // Disabled toggle function - does nothing
  const toggleDarkMode = () => {
    // Dark mode is disabled - do nothing
  };

  // Disabled set function - always keeps light mode
  const setDarkMode = (value: boolean) => {
    // Dark mode is disabled - do nothing
  };

  // Apply light mode on mount
  onMounted(() => {
    applyLightMode();
  });

  return {
    is readonly(isDark),
    themeClass,
    isInitialized: readonly(isInitialized),
    toggleDarkMode,
    setDarkMode,
  };
};
