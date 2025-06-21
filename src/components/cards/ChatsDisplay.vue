<script setup>

import FlippableCard from './chartCard/FlippableCard.vue';
import { loadShotData } from '../../services/data/dataLoader';
import { onMounted, ref } from 'vue';
import { useShotData } from '../../services/stores/shotData';

</script>

<template>
    <FlippableCard title="3-PTS Shot Data" class="mb-4 basis-128" />
    <FlippableCard title="Stats" class="mb-4 basis-72 xl:basis-96" />
    <FlippableCard title="Stats" class="mb-4 basis-72 xl:basis-72" />
    <FlippableCard title="Stats" class="mb-4 basis-96 xl:basis-72" />
    <FlippableCard title="Stats" class="mb-4 basis-96 xl:basis-72" />
    <FlippableCard title="Stats" class="mb-4 basis-80 xl:basis-72" />
</template>