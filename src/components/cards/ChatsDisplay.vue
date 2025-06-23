<script setup>
import FlippableCard from './chartCard/FlippableCard.vue';
import { useShotData } from '../../services/stores/shotData';
import { computed } from 'vue';

const shotDataStore = useShotData();

const chartCards = computed(() => [
    {
        title: "3-PTS Shot Data",
        type: "bar",
        data: shotDataStore.getColumnValues("PTS"),
    },
    {
        title: "Off. Dribble Hand",
        type: "pie",
        data: shotDataStore.getColumnValues("Off Dribble Hand"),
    },
    {
        title: "Footwork",
        type: "pie",
        data: shotDataStore.getColumnValues("Hop/1-2"),
    },
    {
        title: "Make/Miss",
        type: "bar",
        data: shotDataStore.getColumnValues("Make/Miss"),
    },
    {
        title: "Offensive Actions",
        type: "pie",
        data: shotDataStore.getColumnValues("Offensive Action"),
    },
    {
        title: "Defender Distance",
        type: "bar",
        data: shotDataStore.getColumnValues("Defender Distance"),
    },
])
</script>

<template>
    <FlippableCard v-for="(card, i) in chartCards" :key="i" :title="card.title" :type="card.type" :data="card.data"
        class="mb-4 basis-80 xl:basis-72" />
</template>
