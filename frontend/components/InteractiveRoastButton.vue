<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { ArrowRight } from 'lucide-vue-next';
import { cn } from '~/lib/utils';

interface InteractiveRoastButtonProps {
  disabled?: boolean;
  loading?: boolean;
  text?: string;
  className?: string;
}

const props = withDefaults(defineProps<InteractiveRoastButtonProps>(), {
  disabled: false,
  loading: false,
  text: 'Roast It! 🔥',
  className: '',
});

const emit = defineEmits<{
  click: [];
}>();

// Malaysian loading phrases
const malaysianLoadingPhrases = [
  'Sabar sikit...',
  'Tunggu jap...',
  'Loading lah...',
  'Jangan rush...',
  'Chill dulu...',
  'Proses tengah jalan...',
  'Kejap je lagi...',
  'Buat kerja ni...',
  'Tengah masak...',
  'Almost ready...',
];

const completionMessage = 'Ok dah pls cau! ✨';

const currentLoadingPhrase = ref('');
const showCompletion = ref(false);
const loadingInterval = ref<NodeJS.Timeout | null>(null);

// Randomly select loading phrase
const getRandomLoadingPhrase = () => {
  const randomIndex = Math.floor(Math.random() * malaysianLoadingPhrases.length);
  return malaysianLoadingPhrases[randomIndex];
};

// Computed display text
const displayText = computed(() => {
  if (showCompletion.value) return completionMessage;
  if (props.loading) return currentLoadingPhrase.value;
  return props.text;
});

// Watch for loading state changes
watch(
  () => props.loading,
  (newLoading, oldLoading) => {
    if (newLoading && !loadingInterval.value) {
      // Set initial phrase
      currentLoadingPhrase.value = getRandomLoadingPhrase();

      // Change phrase every 2 seconds
      loadingInterval.value = setInterval(() => {
        currentLoadingPhrase.value = getRandomLoadingPhrase();
      }, 2000);
    } else if (!newLoading && loadingInterval.value) {
      clearInterval(loadingInterval.value);
      loadingInterval.value = null;

      // Show completion message briefly
      if (!props.disabled) {
        showCompletion.value = true;
        setTimeout(() => {
          showCompletion.value = false;
        }, 3000);
      }
    }
  },
  { immediate: true }
);

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click');
  }
};

// Cleanup on unmount
onUnmounted(() => {
  if (loadingInterval.value) {
    clearInterval(loadingInterval.value);
  }
});
</script>

<template>
  <button
    @click="handleClick"
    :disabled="disabled || loading"
    :class="
      cn(
        'group relative h-14 px-8 cursor-pointer overflow-hidden rounded-xl border-2 bg-primary text-primary-foreground font-semibold text-lg transition-all duration-300 transform disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed',
        !disabled && !loading && 'hover:scale-105',
        className
      )
    "
  >
    <!-- Loading State -->
    <div
      v-if="loading"
      class="absolute inset-0 flex h-full w-full items-center justify-center gap-2 text-primary-foreground z-20"
    >
      <svg
        class="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>{{ currentLoadingPhrase }}</span>
    </div>

    <!-- Default Text (when not loading) -->
    <span
      v-if="!loading"
      :class="
        cn(
          'inline-block transition-all duration-300 z-10',
          !disabled && 'group-hover:translate-x-12 group-hover:opacity-0'
        )
      "
    >
      {{ displayText }}
    </span>

    <!-- Hover State (when not loading and not disabled) -->
    <div
      v-if="!loading && !disabled"
      :class="
        cn(
          'absolute inset-0 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 z-10',
          'group-hover:translate-x-0 group-hover:opacity-100'
        )
      "
    >
      <span>{{ displayText }}</span>
      <ArrowRight :size="20" />
    </div>

    <!-- Animated Background -->
    <div
      :class="
        cn(
          'absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-primary-foreground/20 transition-all duration-300',
          !disabled &&
            !loading &&
            'group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-primary-foreground/10'
        )
      "
    ></div>
  </button>
</template>

<style scoped>
/* Additional Malaysian-themed animations */
@keyframes malaysian-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(204, 0, 0, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(204, 0, 0, 0);
  }
}

.group:not(:disabled):hover {
  animation: malaysian-pulse 2s infinite;
}

/* Loading state enhancements */
.loading-text {
  background: linear-gradient(
    135deg,
    var(--malaysia-red) 0%,
    var(--malaysia-blue) 50%,
    var(--malaysia-yellow) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
