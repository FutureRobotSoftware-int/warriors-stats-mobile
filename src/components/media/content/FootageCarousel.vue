<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import useEmblaCarousel from 'embla-carousel-vue';
import { useShotData } from '../../../services/stores/shotData';
import { fetchDriveIdByVideoName, getGoogleDriveVideoUrl } from '../../../services/utils/getDriveURL';

const shotData = useShotData();
const driveVideoUrls = ref<string[]>([]);

const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

async function loadDriveVideos() {
  const activeIds = shotData.getActiveIds.map(id => String(id));
  const videoUrls: string[] = [];

  for (const id of activeIds) {
    const driveId = await fetchDriveIdByVideoName(id);
    if (driveId) {
      videoUrls.push(getGoogleDriveVideoUrl(driveId));
    }
  }

  driveVideoUrls.value = videoUrls;
}

watch(() => shotData.getActiveIds, loadDriveVideos, { immediate: true });

onMounted(() => {
  if (emblaApi.value) {
    console.log('Carousel initialized with', emblaApi.value.slideNodes().length, 'slides');
  }
});
</script>

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
