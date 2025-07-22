<script setup lang="ts">
// Vue and external dependencies
import { onMounted, ref, watch } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import { useShotData } from '../../../services/stores/shotData'
import { fetchDriveIdByVideoName, getGoogleDriveVideoUrl } from '../../../services/utils/getDriveURL'
import { usePlayers } from '../../../services/stores/players'
import 'video.js/dist/video-js.css'
import VideoPlayer from '../videoPlayer/VideoPlayer.vue'

// Reactive state variables
const isLoading = ref(false) // Loading state for videos
const showWarning = ref(false) // Show too many entries warning
const showMissingFootageWarning = ref(false) // Show missing footage warning
const videoPlayers = ref<InstanceType<typeof VideoPlayer>[]>([]) // Array of video player instances

// Store references and mode selection
const playerStore = usePlayers() // Player data store
const shotData = useShotData() // Shot data store
const mode = ref<'all' | 'random'>('all') // Display mode ('all' or 'random')
const videoItems = ref<{ id: string, videoUrl: string | null }[]>([]) // Video items array

// Navigation button refs
const prevBtn = ref<HTMLButtonElement | null>(null) // Previous button ref
const nextBtn = ref<HTMLButtonElement | null>(null) // Next button ref

// Initialize Embla carousel with configuration
const [emblaRef, emblaApi] = useEmblaCarousel({ 
  loop: false, // Disable infinite looping
  align: 'start', // Align slides to start
  skipSnaps: false // Don't skip snap points
})

// Get IDs based on current mode (all or random)
function getIdsByMode(): string[] {
  const ids = shotData.getActiveIds.map(id => String(id)) // Convert all active IDs to strings

  showWarning.value = ids.length > 25 // Show warning if too many entries
  showMissingFootageWarning.value = shotData.getActiveIds.some(id => Number(id) > 196) // Show warning for high IDs

  if (mode.value === 'random') {
    return ids.sort(() => Math.random() - 0.5).slice(0, 10) // Return 10 random IDs
  }
  return ids // Return all IDs
}

// Load videos from Google Drive
async function loadDriveVideos() {
  isLoading.value = true // Set loading state
  const idsToShow = getIdsByMode() // Get IDs to display
  const selectedFolder = playerStore.selectedPlayer?.folder // Get selected player's folder

  if (!selectedFolder) { // If no folder selected, reset and return
    videoItems.value = []
    isLoading.value = false
    return
  }

  videoItems.value = [] // Reset video items

  // Load first 3 videos immediately
  const initialBatch = idsToShow.slice(0, 3)
  const remainingBatch = idsToShow.slice(3)

  // Fetch initial batch in parallel
  const initialResults = await Promise.all(
    initialBatch.map(async (id) => {
      const driveId = await fetchDriveIdByVideoName(id, selectedFolder)
      return {
        id,
        videoUrl: driveId ? getGoogleDriveVideoUrl(driveId) : null,
      }
    })
  )

  videoItems.value = initialResults // Set initial results

  // Load remaining videos with small delay between each
  for (const id of remainingBatch) {
    const driveId = await fetchDriveIdByVideoName(id, selectedFolder)
    videoItems.value.push({
      id,
      videoUrl: driveId ? getGoogleDriveVideoUrl(driveId) : null,
    })
    await new Promise((resolve) => setTimeout(resolve, 100)) // Small delay to avoid rate limiting
  }

  isLoading.value = false // Clear loading state
}

// Pause all video players except the one at given index
const pauseAllPlayersExcept = (index: number) => {
  videoPlayers.value.forEach((player, i) => {
    if (player && i !== index) {
      player.pause() // Pause all other players
    }
  })
}

// Update navigation buttons state based on scroll position
const updateNavButtons = () => {
  if (!emblaApi.value) return // Exit if carousel not initialized
  
  const prevEnable = emblaApi.value.canScrollPrev() // Can scroll back?
  const nextEnable = emblaApi.value.canScrollNext() // Can scroll forward?
  
  // Update previous button state
  if (prevBtn.value) {
    prevBtn.value.disabled = !prevEnable
    prevBtn.value.style.opacity = prevEnable ? '1' : '0.5'
    prevBtn.value.style.cursor = prevEnable ? 'pointer' : 'not-allowed'
  }
  
  // Update next button state
  if (nextBtn.value) {
    nextBtn.value.disabled = !nextEnable
    nextBtn.value.style.opacity = nextEnable ? '1' : '0.5'
    nextBtn.value.style.cursor = nextEnable ? 'pointer' : 'not-allowed'
  }
}

// Setup carousel event listeners when mounted
onMounted(() => {
  if (emblaApi.value) {
    emblaApi.value.on('select', () => { // When slide changes
      const selectedIndex = emblaApi.value?.selectedScrollSnap() || 0
      pauseAllPlayersExcept(selectedIndex) // Pause other videos
      updateNavButtons() // Update button states
    })
    
    emblaApi.value.on('init', updateNavButtons) // Initialize buttons on carousel init
  }
})

// Watch for changes to active IDs or mode
watch(() => shotData.getActiveIds, loadDriveVideos, { immediate: true })
watch(mode, loadDriveVideos)
</script>

<template>
  <div class="space-y-4 relative">
    <!-- Warning when too many entries -->
    <div v-if="showWarning" class="alert alert-warning shadow-sm text-sm">
      <span>⚠️ Too many entries. Please apply more filters to narrow down the footage.</span>
    </div>

    <!-- Warning for potentially missing footage -->
    <div v-if="showMissingFootageWarning" class="alert alert-info shadow-sm text-sm">
      <span>ℹ️ Some entries have an ID greater than 196 and may not have available footage.</span>
    </div>

    <!-- Mode selection buttons -->
    <div class="flex gap-2">
      <button class="btn btn-sm btn-primary" @click="mode = 'all'">All</button>
      <button class="btn btn-sm btn-secondary" @click="mode = 'random'">Star Plays</button>
    </div>

    <!-- Carousel container -->
    <div class="relative">
      <!-- Previous slide button -->
      <button
        ref="prevBtn"
        class="embla__button embla__button--prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-all"
        :disabled="!emblaApi?.canScrollPrev()"
        @click="emblaApi?.scrollPrev()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      <!-- Carousel viewport -->
      <div class="overflow-hidden" ref="emblaRef">
        <div class="flex">
          <!-- Slide items -->
          <div
            v-for="(item, index) in videoItems"
            :key="item.id"
            class="min-w-full px-2 space-y-2"
          >
            <!-- Video player or missing footage message -->
            <div v-if="item.videoUrl" class="flex justify-center">
              <VideoPlayer 
                :src="item.videoUrl" 
                :autoplay="index === 0"
                ref="videoPlayers"
              />
            </div>
            <div v-else class="bg-base-200 border border-base-300 p-4 text-center rounded-md text-sm text-gray-600">
              <strong>No footage found</strong> for ID <code>{{ item.id }}</code>.
            </div>
          </div>
        </div>
      </div>

      <!-- Next slide button -->
      <button
        ref="nextBtn"
        class="embla__button embla__button--next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-all"
        :disabled="!emblaApi?.canScrollNext()"
        @click="emblaApi?.scrollNext()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Carousel button base styles */
.embla__button {
  outline: 0;
  cursor: pointer;
  touch-action: manipulation;
}

/* Disabled button styles */
.embla__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Ensure carousel has space for navigation buttons */
.embla__container {
  padding: 0 40px;
}
</style>