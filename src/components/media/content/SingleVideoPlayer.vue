<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { fetchDriveIdByVideoName, getGoogleDriveVideoUrl } from '../../../services/utils/getDriveURL'
import type { IShotData } from '../../../types/shotData'

const props = defineProps<{
  entry: IShotData,
  folderId?: string
}>()

const videoUrl = ref('')
const isLoading = ref(true)
const videoRef = ref<HTMLVideoElement | null>(null)
const player = ref<any>(null)

onMounted(async () => {
  if (!props.folderId) {
    console.warn('No folderId provided')
    isLoading.value = false
    return
  }

  const driveId = await fetchDriveIdByVideoName(String(props.entry.id), props.folderId)
  if (driveId) {
    videoUrl.value = getGoogleDriveVideoUrl(driveId)
  }
  isLoading.value = false

  // Esperar al próximo tick para asegurar que el DOM esté actualizado
  await nextTick()

  if (videoRef.value && videoUrl.value) {
    player.value = videojs(videoRef.value, {
      controls: true,
      preload: 'metadata',
      responsive: true,
      fluid: true
    }, () => {
      console.log('Player is ready')
    })
  }
})

onBeforeUnmount(() => {
  if (player.value) {
    player.value.dispose()
  }
})
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
    </div>
    <div v-else class="rounded-lg">
      <video
        ref="videoRef"
        class="video-js vjs-big-play-centered"
        preload="metadata"
        data-setup="{}"
      >
        <source :src="videoUrl" type="video/mp4" />
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a
          web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video>
    </div>
  </div>
</template>

<style>
/* Opcional: Personaliza los colores del reproductor */
.video-js {
  --vjs-primary-color: #3a86ff;
}

.video-js .vjs-big-play-button {
  background-color: rgba(58, 134, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  line-height: 2.5em;
  margin-left: -1.25em;
  margin-top: -1.25em;
}
</style>