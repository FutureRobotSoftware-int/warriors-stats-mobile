<template>
    <main class="m-1 mr-0">
        <Carousel />
        <hr>
        <div>
            <div class="flex flex-wrap justify-between m-4">
                <ChatsDisplay />
                <FilterSummary />
            </div>
        </div>
    </main>
</template>

<script setup>
import Carousel from './cards/Carousel.vue';
import ChatsDisplay from './cards/ChartsDisplay.vue';
import { useShotData } from '../services/stores/shotData';
import { onMounted } from 'vue';
import { loadShotData } from '../services/data/dataLoader';
import FilterSummary from './FilterSummary.vue';
import { usePeriod } from '../services/stores/year';

const shotDataStore = useShotData()

onMounted(async () => {
    const result = await loadShotData("Moses Moody")

    const periodStore = usePeriod()

    periodStore.addPeriods()
})

</script>