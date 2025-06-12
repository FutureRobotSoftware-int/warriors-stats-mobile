<template>
    <main class="m-1 mr-0">
        <div class="flex justify-between m-4">
            <SmallCard />
            <SmallCard />
            <SmallCard />
            <SmallCard />
            <SmallCard />
        </div>
        <div class="divider divider-neutral"></div>
        <div class="flex flex-wrap justify-between m-4">
            <ChartCard title="3-PTS Shot Data" class="mb-4 basis-128" />
            <ChartCard title="Stats" class="mb-4 basis-72" />
            <ChartCard title="Stats" class="mb-4 basis-64" />
            <ChartCard title="Stats" class="mb-4 basis-64" />
            <ChartCard title="Stats" class="mb-4 basis-64" />
        </div>
    </main>
</template>

<script setup>
import SmallCard from '../elements/SmallCard.vue';
import ChartCard from '../elements/ChartCard.vue';
</script>