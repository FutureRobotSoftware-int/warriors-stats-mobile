<template>
    <div class="overflow-hidden" ref="emblaRef">
      <div class="flex">
        <div
          v-for="video in driveVideoUrls"
          :key="video"
          class="min-w-full px-2"
        >
          <video
            class="rounded-lg w-full h-auto"
            controls
            preload="metadata"
          >
            <source :src="video" type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, computed } from 'vue'
import { useVideoStore } from '../../../services/stores/video'  
import { getGoogleDriveVideoUrl } from '../../../services/utils/getDriveURL'
import useEmblaCarousel from 'embla-carousel-vue'

  const videoStore = useVideoStore()
  
  const googleDriveIds: Record<string, string> = {
  video1: '1YIxtEQ0V4mcX1bvgLweu6c2JNWsVspxL',
  video2: '1kH2jk10a6TaVHJD0r1lFsiek5GCByvAn'
}

const driveVideoUrls = computed(() =>
  videoStore.videoIds
    .filter(id => googleDriveIds[id]) 
    .map(id => getGoogleDriveVideoUrl(googleDriveIds[id])) 
)
  
  console.log(driveVideoUrls)

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  
  onMounted(() => {
    if (emblaApi.value) {
      console.log('Carousel initialized with', emblaApi.value.slideNodes().length, 'slides')
    }
  })
  </script>
  

  