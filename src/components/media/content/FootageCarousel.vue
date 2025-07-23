<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import { useShotData } from '../../../services/stores/shotData'
import { fetchDriveIdByVideoName, getGoogleDriveVideoUrl } from '../../../services/utils/getDriveURL'
import { usePlayers } from '../../../services/stores/players'
import 'video.js/dist/video-js.css'
import VideoPlayer from '../videoPlayer/VideoPlayer.vue'

// Reactive state variables
const isLoading = ref(false)
const showWarning = ref(false)
const showMissingFootageWarning = ref(false)
const videoPlayers = ref<InstanceType<typeof VideoPlayer>[]>([])
const loadedVideos = ref<Set<string>>(new Set()) // Track loaded videos

// Store references and mode selection
const playerStore = usePlayers()
const shotData = useShotData()
const mode = ref<'all' | 'random'>('all')
const videoItems = ref<{ id: string, videoUrl: string | null }[]>([])

// Navigation button refs
const prevBtn = ref<HTMLButtonElement | null>(null)
const nextBtn = ref<HTMLButtonElement | null>(null)

// Initialize Embla carousel with configuration
const [emblaRef, emblaApi] = useEmblaCarousel({ 
  loop: false,
  align: 'start',
  skipSnaps: false
})

// Get IDs based on current mode (all or random)
function getIdsByMode(): string[] {
  const ids = shotData.getActiveIds.map(id => String(id))

  showWarning.value = ids.length > 25
  showMissingFootageWarning.value = shotData.getActiveIds.some(id => Number(id) > 196)

  if (mode.value === 'random') {
    return ids.sort(() => Math.random() - 0.5).slice(0, 10)
  }
  return ids
}

// Load a batch of videos
async function loadBatch(ids: string[], folderId: string) {
  const batchResults = await Promise.all(
    ids.map(async (id) => {
      if (loadedVideos.value.has(id)) return null

      try {
        const driveId = await fetchDriveIdByVideoName(id, folderId)
        loadedVideos.value.add(id)
        return {
          id,
          videoUrl: driveId ? getGoogleDriveVideoUrl(driveId) : null,
        }
      } catch (error) {
        console.error(`Error loading video ${id}:`, error)
        return {
          id,
          videoUrl: null,
        }
      }
    })
  )

  // Update only the loaded videos in the batch
  batchResults.forEach((result) => {
    if (!result) return
    const index = videoItems.value.findIndex(item => item.id === result.id)
    if (index !== -1) {
      videoItems.value[index] = result
    }
  })
}

// Load videos with lazy loading
async function loadDriveVideos() {
  isLoading.value = true
  const idsToShow = getIdsByMode()
  const selectedFolder = playerStore.selectedPlayer?.folder

  if (!selectedFolder) {
    videoItems.value = []
    isLoading.value = false
    return
  }

  // Initialize all items with null URLs
  videoItems.value = idsToShow.map(id => ({ id, videoUrl: null }))

  // Load only the first 3 videos initially
  const initialBatch = idsToShow.slice(0, 3)
  await loadBatch(initialBatch, selectedFolder)

  isLoading.value = false
}

// Preload adjacent videos when a slide is selected
function preloadAdjacentVideos(centerIndex: number) {
  const selectedFolder = playerStore.selectedPlayer?.folder
  if (!selectedFolder) return

  const preloadThreshold = 2 // Number of adjacent videos to preload
  const start = Math.max(0, centerIndex - preloadThreshold)
  const end = Math.min(videoItems.value.length - 1, centerIndex + preloadThreshold)
  
  const idsToLoad = []
  for (let i = start; i <= end; i++) {
    const item = videoItems.value[i]
    if (item && !loadedVideos.value.has(item.id)) {
      idsToLoad.push(item.id)
    }
  }

  if (idsToLoad.length > 0) {
    loadBatch(idsToLoad, selectedFolder)
  }
}

// Pause all video players except the one at given index
const pauseAllPlayersExcept = (index: number) => {
  videoPlayers.value.forEach((player, i) => {
    if (player && i !== index) {
      player.pause()
    }
  })
}

// Update navigation buttons state based on scroll position
const updateNavButtons = () => {
  if (!emblaApi.value) return
  
  const prevEnable = emblaApi.value.canScrollPrev()
  const nextEnable = emblaApi.value.canScrollNext()
  
  if (prevBtn.value) {
    prevBtn.value.disabled = !prevEnable
    prevBtn.value.style.opacity = prevEnable ? '1' : '0.5'
    prevBtn.value.style.cursor = prevEnable ? 'pointer' : 'not-allowed'
  }
  
  if (nextBtn.value) {
    nextBtn.value.disabled = !nextEnable
    nextBtn.value.style.opacity = nextEnable ? '1' : '0.5'
    nextBtn.value.style.cursor = nextEnable ? 'pointer' : 'not-allowed'
  }
}

// Setup carousel event listeners when mounted
onMounted(() => {
  if (emblaApi.value) {
    emblaApi.value.on('select', () => {
      const selectedIndex = emblaApi.value?.selectedScrollSnap() || 0
      pauseAllPlayersExcept(selectedIndex)
      updateNavButtons()
      preloadAdjacentVideos(selectedIndex)
    })
    
    emblaApi.value.on('init', updateNavButtons)
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
            <!-- Loading state -->
            <div v-if="!item.videoUrl && !loadedVideos.has(item.id)" class="bg-gray-100 w-full aspect-video flex items-center justify-center">
              <span class="loading loading-spinner text-primary"></span>
            </div>
            
            <!-- Video player -->
            <div v-else-if="item.videoUrl" class="flex justify-center">
              <VideoPlayer 
                :src="item.videoUrl" 
                :autoplay="index === 0"
                ref="videoPlayers"
              />
            </div>
            
            <!-- Missing footage message -->
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