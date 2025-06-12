<template>
    <main class="m-1 mr-0">
        <Carousel />
        <div class="divider divider-neutral"></div>
        <div class="flex flex-wrap justify-between m-4">
            <ChartCard title="3-PTS Shot Data" class="mb-4 basis-128" />
            <ChartCard title="Stats" class="mb-4 basis-72 xl:basis-96" />
            <ChartCard title="Stats" class="mb-4 basis-64 xl:basis-72" />
            <ChartCard title="Stats" class="mb-4 basis-64 xl:basis-72" />
            <ChartCard title="Stats" class="mb-4 basis-64 xl:basis-72" />
        </div>
    </main>
</template>

<script setup>
import Carousel from '../elements/Carousel.vue';
import ChartCard from '../elements/ChartCard.vue';
</script>