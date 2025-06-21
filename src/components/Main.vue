<template>
    <main class="m-1 mr-0">
        <Carousel />
        <div class="divider divider-neutral"></div>
        <div class="flex flex-wrap justify-between m-4">
            <ChatsDisplay />
        </div>
    </main>
</template>

<script setup>
import Carousel from './cards/Carousel.vue';
import ChatsDisplay from './cards/ChatsDisplay.vue';
import { useShotData } from '../services/stores/shotData';
import { onMounted } from 'vue';
import { loadShotData } from '../services/data/dataLoader';

const shotDataStore = useShotData()

onMounted(async () => {
    const result = await loadShotData("Moses Moody")
    console.log("Charged data:", result);
})

</script>