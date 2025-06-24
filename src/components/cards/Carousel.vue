<script setup>
import emblaCarouselVue from 'embla-carousel-vue'
import SmallCard from './SmallCard.vue';
import { useShotData } from '../../services/stores/shotData';
import { computed } from 'vue';

const [emblaRef] = emblaCarouselVue()
const shotDataStore = useShotData()

const metrics = [
    { title: 'Overall FG%', method: 'calcFG', suffix: '%' },
    { title: 'Overall PPP', method: 'calcPPP' },
    { title: 'Preferred Off. Dribble Hand', method: 'getMostCommonColumnValue', args: ['Off Dribble Hand'] },
    { title: 'Preferred Footwork', method: 'getMostCommonColumnValue', args: ['Hop/1-2'] },
    { title: 'Preferred Off.', method: 'getMostCommonColumnValue', args: ['Offensive Action'] },
    { title: 'Most common Defender Distance', method: 'getMostCommonColumnValue', args: ['Defender Distance'] },
]

const statCards = computed(() =>
    metrics.map(({ title, method, suffix = '', args = [] }) => {
        const value = shotDataStore[method](...args)
        return {
            title,
            stat: value + suffix
        }
    })
)
</script>

<template>
    <div class="embla m-4" ref="emblaRef">
        <div class="embla__container">
            <SmallCard v-for="({ title, stat }, index) in statCards" :key="index" :title="title" :stat="stat" />
        </div>
    </div>
</template>


<style scoped>
.embla {
    overflow: hidden;
}

.embla__container {
    display: flex;
}

.embla__slide {
    flex: 0 0 100%;
    min-width: 0;
}
</style>
