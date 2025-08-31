<script setup lang="ts">
import { ref, computed } from 'vue';
import { Input } from '@/components/ui/input';
import InteractiveRoastButton from '@/components/InteractiveRoastButton.vue';
import type { PlaylistSubmission } from '~/types/playlist';

// Props and emits
const emit = defineEmits<{
  'playlist-submitted': [submission: PlaylistSubmission];
}>();

// Reactive state
const playlistUrl = ref('');
const isSubmitting = ref(false);
const validationError = ref<string | null>(null);

// Computed properties
const isValidUrl = computed(() => {
  if (!playlistUrl.value) return false;
  const spotifyPlaylistRegex = /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+(\?.*)?$/;
  return spotifyPlaylistRegex.test(playlistUrl.value);
});

const canSubmit = computed(() => {
  return isValidUrl.value && !isSubmitting.value;
});

const statusText = computed(() => {
  if (isSubmitting.value) return 'Sabar... generating roast...';
  if (validationError.value) return validationError.value;
  if (playlistUrl.value && !isValidUrl.value) return 'Please enter a valid Spotify playlist URL';
  if (isValidUrl.value) return 'Ready to submit!';
  return 'Paste your Spotify playlist URL here';
});

const statusClass = computed(() => {
  if (isSubmitting.value) return 'text-primary';
  if (validationError.value) return 'text-destructive';
  if (playlistUrl.value && !isValidUrl.value) return 'text-orange-600 text-orange-400';
  if (isValidUrl.value) return 'text-green-600 text-green-400';
  return 'text-muted-foreground';
});

// Methods
const clearValidationError = () => {
  validationError.value = null;
};

const handleSubmit = async () => {
  if (!canSubmit.value) return;

  clearValidationError();
  isSubmitting.value = true;

  try {
    const submission: PlaylistSubmission = {
      url: playlistUrl.value.trim(),
      timestamp: new Date(),
    };

    emit('playlist-submitted', submission);

    // Clear the input after successful submission
    playlistUrl.value = '';
  } catch (error: any) {
    validationError.value = error.message || 'Failed to submit playlist';
  } finally {
    isSubmitting.value = false;
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && canSubmit.value) {
    handleSubmit();
  }
};

// Clear validation error when user starts typing
const handleInput = () => {
  clearValidationError();
};
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Input Container -->
    <div class="relative">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Input Field -->
        <div class="flex-1">
          <Input
            v-model="playlistUrl"
            type="url"
            placeholder="Put Spotify URL here..."
            class="input-enhanced h-14 text-lg px-6 rounded-xl"
            :class="{
              'border-green-500 focus:border-green-600 focus:ring-green-500/20': isValidUrl,
              'border-red-500 focus:border-red-600 focus:ring-red-500/20':
                playlistUrl && !isValidUrl,
            }"
            @input="handleInput"
            @keypress="handleKeyPress"
            :disabled="isSubmitting"
          />
        </div>

        <!-- Submit Button -->
        <InteractiveRoastButton
          @click="handleSubmit"
          :disabled="!canSubmit"
          :loading="isSubmitting"
          text="Roast It! 🔥"
        />
      </div>

      <!-- Status Text -->
      <div class="mt-4 text-center">
        <p :class="statusClass" class="text-sm font-medium transition-colors duration-300">
          {{ statusText }}
        </p>
      </div>
    </div>

    <!-- Help Text -->
    <div class="mt-6 text-center">
      <p class="text-sm text-muted-foreground">
        Share a your Spotify (public) playlist and get roasted by AI created by my (unemployed)
        master!
        <br class="hidden sm:block" />
        Example:
        <code class="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
          >https://open.spotify.com/playlist/...</code
        >
      </p>
      <mark class="text-xs mt-2 text-muted-foreground">
        ⚠️ Disclaimer: This AI-generated content is for entertainment purposes only and may not be
        accurate (well whatever your playlist is, you are cool). This project is just for fun and is
        not affiliated with or representative of Malaysia's National Day celebrations. No judgment
        or reflection of Malaysian culture is intended.
      </mark>
    </div>
  </div>
</template>

<style scoped>
/* Custom Malaysian colors for borders and gradients */
.border-malaysia-blue {
  border-color: #010066;
}

.focus\:border-malaysia-blue:focus {
  border-color: #010066;
}

.focus\:ring-malaysia-blue\/20:focus {
  --tw-ring-color: rgb(1 0 102 / 0.2);
}

.from-malaysia-red {
  --tw-gradient-from: #cc0000;
}

.via-malaysia-blue {
  --tw-gradient-via: #010066;
}

.to-malaysia-yellow {
  --tw-gradient-to: #ffcc00;
}

/* Smooth input transitions */
input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Button hover effects */
button:not(:disabled):hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Loading animation enhancement */
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(1, 0, 102, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(1, 0, 102, 0.8);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}
</style>
