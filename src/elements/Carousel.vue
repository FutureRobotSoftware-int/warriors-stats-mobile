<script setup>
import emblaCarouselVue from 'embla-carousel-vue'
import SmallCard from './SmallCard.vue';

const [emblaRef] = emblaCarouselVue()
</script>

<template>
    <div class="embla m-4" ref="emblaRef">
        <div class="embla__container">
            <SmallCard title="Overall FG%" stat="32%" />
            <SmallCard title="Overall PPP" stat="1.3" />
            <SmallCard title="Preferred Off Dribble Hand" stat="LEFT" />
            <SmallCard title="Preferred Hop/1-2" stat="HOP" />
            <SmallCard title="Most common Defender Distance" stat="CLOSE" />
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
