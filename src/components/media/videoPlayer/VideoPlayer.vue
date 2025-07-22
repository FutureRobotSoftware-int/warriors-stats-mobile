<template>
  <div class="video-player-container">
    <video 
      ref="videoPlayer" 
      class="video-js vjs-big-play-centered vjs-16-9" 
      controls 
      preload="auto"
    ></video>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  autoplay: {
    type: Boolean,
    default: false
  }
})

const videoPlayer = ref(null)
const player = ref(null)

onMounted(() => {
  initializePlayer()
})

onBeforeUnmount(() => {
  if (player.value) {
    player.value.dispose()
  }
})

watch(() => props.src, (newSrc) => {
  if (player.value && newSrc) {
    player.value.src({ src: newSrc, type: 'video/mp4' })
  }
})

const initializePlayer = () => {
  player.value = videojs(videoPlayer.value, {
    controls: true,
    autoplay: props.autoplay,
    preload: 'auto',
    fluid: true,
    aspectRatio: '16:9',
    sources: [{
      src: props.src,
      type: 'video/mp4'
    }]
  }, () => {
    console.log('Player is ready')
  })
}

defineExpose({
  play: () => player.value && player.value.play(),
  pause: () => player.value && player.value.pause(),
  isPaused: () => player.value ? player.value.paused() : true
})
</script>

<style scoped>
.video-player-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
</style>