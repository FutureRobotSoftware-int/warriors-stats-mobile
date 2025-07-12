<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchDriveIdByVideoName, getGoogleDriveVideoUrl } from '../../../services/utils/getDriveURL'
import type { IShotData } from '../../../types/shotData'

const props = defineProps<{
  entry: IShotData
}>()

const videoUrl = ref('')
const isLoading = ref(true)

onMounted(async () => {
  const driveId = await fetchDriveIdByVideoName(String(props.entry.id))
  if (driveId) {
    videoUrl.value = getGoogleDriveVideoUrl(driveId)
  }
  isLoading.value = false
})
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
    </div>
    <video
      v-else
      class="rounded-lg w-full h-auto"
      controls
      preload="metadata"
    >
      <source :src="videoUrl" type="video/mp4" />
    </video>
  </div>
</template>
