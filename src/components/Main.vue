<template>
    <main class="m-1 mr-0">
        <Carousel />
        <div class="divider divider-neutral"></div>
        <div class="flex flex-wrap justify-between m-4">
            <FlippableCard title="3-PTS Shot Data" class="mb-4 basis-128" />
            <FlippableCard title="Stats" class="mb-4 basis-72 xl:basis-96" />
            <FlippableCard title="Stats" class="mb-4 basis-72 xl:basis-72" />
            <FlippableCard title="Stats" class="mb-4 basis-96 xl:basis-72" />
            <FlippableCard title="Stats" class="mb-4 basis-96 xl:basis-72" />
            <FlippableCard title="Stats" class="mb-4 basis-80 xl:basis-72" />
        </div>
    </main>
</template>

<script setup>
import Carousel from './cards/Carousel.vue';
import FlippableCard from './cards/ChartCard/FlippableCard.vue';
</script>