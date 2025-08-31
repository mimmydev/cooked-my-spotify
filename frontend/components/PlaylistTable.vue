<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Playlist } from '~/types/playlist';

// Props
interface Props {
  playlists: Playlist[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

// Computed properties
const hasPlaylists = computed(() => props.playlists.length > 0);

// Format date for display
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
</script>

<template>
  <div class="w-full">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Recent Roasts 🔥</h2>
      <p class="mx-auto text-gray-600 max-w-[50rem]">
        Happy National Day, Malaysia 🇲🇾 !<br />68 years of freedom, and now some random people out
        there able to get absolutely free to get roasted by an AI built by some random unemployed
        developer. These brave souls submitted their playlists for public humiliation.... Salute
        their courage! Yessirrr type of shizz
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="i in 6" :key="i" class="animate-pulse">
        <CardHeader>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="h-3 bg-gray-200 rounded"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            <div class="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Cards Grid -->
    <div v-else-if="hasPlaylists" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="playlist in playlists"
        :key="playlist.id"
        class="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary"
      >
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <CardTitle class="text-lg font-semibold text-gray-900 mb-1">
                {{ playlist.name }}
              </CardTitle>
              <CardDescription class="text-sm text-gray-600">
                by {{ playlist.creator }} • {{ playlist.trackCount }} tracks
              </CardDescription>
            </div>
            <a
              :href="playlist.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center w-8 h-8 ml-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-all duration-200 group"
              :aria-label="`Open ${playlist.name} on Spotify`"
              title="Open on Spotify"
            >
              <svg
                class="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
            </a>
          </div>
        </CardHeader>

        <CardContent class="pt-0">
          <!-- Full Roast Text -->
          <div class="mb-4">
            <div class="text-2xl mb-2">💬</div>
            <blockquote
              class="text-base leading-relaxed text-gray-800 italic border-l-2 border-accent pl-4"
            >
              "{{ playlist.roastText || 'No roast available yet...' }}"
            </blockquote>
          </div>

          <!-- Metadata -->
          <div
            class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100"
          >
            <span class="flex items-center gap-1"> 🇲🇾 {{ formatDate(playlist.dateAdded) }} </span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <div
        class="mx-auto w-24 h-24 bg-gray-100 bg-gray-800 rounded-full flex items-center justify-center mb-6"
      >
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          ></path>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No roasts yet</h3>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">
        Be the first to submit a Spotify playlist and get roasted Malaysian-style!
      </p>
      <div class="text-4xl">🎵</div>
    </div>
  </div>
</template>

<style scoped>
/* Custom hover effects */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

/* Smooth animations for table rows */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.table-row-enter-active {
  animation: slideIn 0.3s ease-out;
}

/* Status badge animations */
.status-badge {
  transition: all 0.2s ease;
}

.status-badge:hover {
  transform: scale(1.05);
}

/* Responsive table improvements */
@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }

  .table-cell-mobile {
    min-width: 120px;
  }
}

/* Loading skeleton improvements */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.dark .skeleton {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200% 100%;
}
</style>
