<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import useEmblaCarousel from 'embla-carousel-vue';
import { useShotData } from '../../../services/stores/shotData';
import { fetchDriveIdByVideoName, getGoogleDriveVideoUrl } from '../../../services/utils/getDriveURL';

const isLoading = ref(false);
const showWarning = ref(false); 
const showMissingFootageWarning = ref(false);

const shotData = useShotData();
const mode = ref<'all' | 'random'>('all');
const videoElements = ref<HTMLVideoElement[]>([]);
const videoItems = ref<{ id: string, videoUrl: string | null }[]>([]);

const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

function getIdsByMode(): string[] {
  const ids = shotData.getActiveIds.map(id => String(id));

  showWarning.value = ids.length > 25;
  showMissingFootageWarning.value = shotData.getActiveIds.some(id => Number(id) > 196);

  if (mode.value === 'random') {
    return ids.sort(() => Math.random() - 0.5).slice(0, 10);
  }
  return ids;
}

async function loadDriveVideos() {
  isLoading.value = true;
  const idsToShow = getIdsByMode();
  const results: { id: string, videoUrl: string | null }[] = [];

  for (const id of idsToShow) {
    const driveId = await fetchDriveIdByVideoName(id);
    results.push({
      id,
      videoUrl: driveId ? getGoogleDriveVideoUrl(driveId) : null
    });
  }

  videoItems.value = results;
  videoElements.value = [];
  isLoading.value = false;
}

watch(() => shotData.getActiveIds, loadDriveVideos, { immediate: true });
watch(mode, loadDriveVideos);

onMounted(() => {
  if (emblaApi.value) {
    emblaApi.value.on('select', () => {
      videoElements.value.forEach((video) => {
        if (!video.paused) video.pause();
      });
    });
  }
});

function handleVideoMounted(el: HTMLVideoElement) {
  videoElements.value.push(el);
}
</script>

<template>
  <div class="space-y-4">
    <!-- Warning Message -->
    <div v-if="showWarning" class="alert alert-warning shadow-sm text-sm">
      <span>⚠️ Too many entries. Please apply more filters to narrow down the footage.</span>
    </div>

    <!-- Missing Footage Warning -->
    <div v-if="showMissingFootageWarning" class="alert alert-info shadow-sm text-sm">
      <span>ℹ️ Some entries have an ID greater than 196 and may not have available footage.</span>
    </div>

    <div class="flex gap-2">
      <button class="btn btn-sm btn-primary" @click="mode = 'all'">All</button>
      <button class="btn btn-sm btn-secondary" @click="mode = 'random'">Star Plays</button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    <div class="overflow-hidden" ref="emblaRef">
      <div class="flex">
        <div
          v-for="item in videoItems"
          :key="item.id"
          class="min-w-full px-2 space-y-2"
        >
          <div v-if="item.videoUrl">
            <video
              class="rounded-lg w-full h-auto"
              controls
              preload="metadata"
              :ref="(el) => el && handleVideoMounted(el as HTMLVideoElement)"
            >
              <source :src="item.videoUrl" type="video/mp4" />
            </video>
          </div>
          <div v-else class="bg-base-200 border border-base-300 p-4 text-center rounded-md text-sm text-gray-600">
            <strong>No footage found</strong> for ID <code>{{ item.id }}</code>.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
