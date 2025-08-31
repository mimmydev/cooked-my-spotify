<script setup lang="ts">
import { onMounted } from 'vue';
import AnimatedTagline from '@/components/AnimatedTagline.vue';
import PlaylistInput from '@/components/PlaylistInput.vue';
import PlaylistTable from '@/components/PlaylistTable.vue';
import ParticlesBackground from '@/components/ParticlesBackground.vue';
import { useSpotifyRoast } from '~/composables/useSpotifyRoast';
import type { PlaylistSubmission } from '~/types/playlist';

// Use the Spotify roast composable
const { isLoading, error, playlists, generateRoast, fetchRoasts, clearError } = useSpotifyRoast();

// Handle playlist submission with real API call
const handlePlaylistSubmitted = async (submission: PlaylistSubmission) => {
  try {
    await generateRoast(submission.url);
  } catch (err) {
    console.error('Error handling playlist submission:', err);
  }
};

// Load initial data on mount
onMounted(async () => {
  try {
    await fetchRoasts(1, 10);
  } catch (err) {
    console.error('Error loading initial roasts:', err);
  }
});
</script>

<template>
  <div class="min-h-screen bg-background relative">
    <!-- Animated Particles Background -->
    <ParticlesBackground :quantity="80" :staticity="30" :ease="50" :size="1.2" class="opacity-20" />
    <!-- Header Section -->
    <header class="relative overflow-hidden bg-background z-10">
      <div class="container mx-auto px-4">
        <AnimatedTagline />
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 pb-16 relative z-10">
      <!-- Input Section -->
      <section class="mb-16">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-foreground mb-4">Submit Your Playlist</h2>
        </div>
        <PlaylistInput @playlist-submitted="handlePlaylistSubmitted" />
      </section>

      <!-- Table Section -->
      <section>
        <PlaylistTable :playlists="playlists" :loading="isLoading" />
      </section>

      <!-- Global Error Display -->
      <div v-if="error" class="fixed bottom-4 right-4 max-w-sm">
        <div class="bg-destructive/10 border border-destructive/20 rounded-lg p-4 shadow-lg">
          <div class="flex items-start space-x-3">
            <div class="text-destructive">⚠️</div>
            <div>
              <p class="text-sm font-medium text-destructive">Error</p>
              <p class="text-sm text-destructive/80">{{ error }}</p>
              <button
                @click="clearError"
                class="text-xs text-destructive hover:text-destructive/80 mt-2 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-background border-t border-border relative z-10">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center text-muted-foreground">
          <p class="mb-2">🇲🇾 Celebrating Malaysia's Independence Day 🇲🇾</p>
          <p class="text-sm">Built by Mimmy the racer</p>
          <p class="text-xs mt-4">
            yes so many bugs and no I am not going to fix this bye<br />thx for drop by no complain
            pls else i will cry all text above are just a joke bro
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Custom Malaysian color utilities */
.from-malaysia-red\/5 {
  --tw-gradient-from: rgb(204 0 0 / 0.05);
}

.via-malaysia-blue\/5 {
  --tw-gradient-via: rgb(1 0 102 / 0.05);
}

.to-malaysia-yellow\/5 {
  --tw-gradient-to: rgb(255 204 0 / 0.05);
}
</style>
