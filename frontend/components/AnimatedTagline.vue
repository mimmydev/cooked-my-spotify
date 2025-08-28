<script setup lang="ts">
import { ref, onMounted } from 'vue';

const taglineRef = ref<HTMLElement>();
const isAnimated = ref(false);

onMounted(() => {
  // Trigger animation after component mounts
  setTimeout(() => {
    isAnimated.value = true;
  }, 500);
});
</script>

<template>
  <div class="py-16 text-center">
    <h1
      ref="taglineRef"
      class="relative inline-block text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8"
    >
      Masak Spotify!

      <!-- Decorative wave underline -->
      <svg
        class="absolute -bottom-2 left-0 w-full h-4 transition-opacity duration-1000"
        :class="{
          'opacity-100': isAnimated,
          'opacity-0': !isAnimated,
        }"
        viewBox="0 0 400 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,10 Q100,0 200,10 T400,10"
          stroke="url(#gradient)"
          stroke-width="4"
          fill="none"
          class="animate-draw"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: #cc0000; stop-opacity: 1" />
            <stop offset="50%" style="stop-color: #010066; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #ffcc00; stop-opacity: 1" />
          </linearGradient>
        </defs>
      </svg>
    </h1>

    <p class="text-lg md:text-xl text-gray-600 text-gray-300 max-w-2xl mx-auto leading-relaxed">
      🇲🇾 Celebrating Malaysia's Independence with your Spotify playlists! 🇲🇾
    </p>
  </div>
</template>

<style scoped>
/* Malaysian flag colors */
.from-malaysia-red {
  --tw-gradient-from: #cc0000;
}

.via-malaysia-blue {
  --tw-gradient-via: #010066;
}

.to-malaysia-yellow {
  --tw-gradient-to: #ffcc00;
}

/* SVG path animation */
.animate-draw {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 2s ease-out forwards;
  animation-delay: 0.5s;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

/* Hover effect for the tagline */
h1:hover .absolute {
  transform: scaleY(1.2);
  transition: transform 0.3s ease;
}

/* Responsive text sizing */
@media (max-width: 640px) {
  h1 {
    font-size: 2.5rem;
    line-height: 1.1;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  h1 {
    font-size: 3.5rem;
    line-height: 1.1;
  }
}
</style>
