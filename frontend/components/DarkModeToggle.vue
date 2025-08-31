<script setup lang="ts">
import { useDarkMode } from '../composables/useDarkMode';

const { isDark, toggleDarkMode } = useDarkMode();
</script>

<template>
  <button
    @click="toggleDarkMode"
    class="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    aria-label="Toggle dark mode"
  >
    <!-- Sun icon for light mode -->
    <svg
      v-if="!isDark"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="transition-all duration-300 rotate-0 scale-100"
    >
      <circle cx="12" cy="12" r="5" />
      <path
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      />
    </svg>

    <!-- Moon icon for dark mode -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="transition-all duration-300 rotate-0 scale-100"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<style scoped>
/* Enhanced hover effects */
.group:hover .sun-icon {
  transform: rotate(180deg);
}

.group:hover .moon-icon {
  transform: rotate(-90deg);
}

/* Smooth icon transitions */
svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
