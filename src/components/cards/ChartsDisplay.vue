<script setup>

import FlippableCard from './chartCard/FlippableCard.vue';
import BaseChart from './chartCard/BaseChart.vue'
import { loadShotData } from '../../services/data/dataLoader';
import { onMounted, ref, computed } from 'vue';
import { useShotData } from '../../services/stores/shotData';
import { buildChartOption, buildBarChartOption } from '../../services/charts/buildChart';

const shotDataStore = useShotData()

const metrics = [
    { title: 'Area', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Area'] },
    { title: 'Player Direction', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Player Direction'] },
    { title: 'Offensive Action', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Offensive Action'] },
    { title: 'Hop/1-2', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Hop/1-2'] },
    { title: 'Off Dribble Hand', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Off Dribble Hand'] },
    { title: 'Defender Distance', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Defender Distance'] },

];

const barChartData = computed(() => {
    const { actions, series, pppLine } = shotDataStore.getStackedPPPAndFrequencyByActionArea();
    return buildBarChartOption(actions, series, pppLine);
});

const rawChartData = computed(() =>
  metrics.map(({ title, legend, fieldGoal = '', data, args = [] }) => {
    const values = shotDataStore[data](...args);
    const fg = shotDataStore[fieldGoal](...args);
    const col = shotDataStore[legend](...args);

    return {
      title,
      values,
      fg,
      col
    };
  })
);

const statCharts = computed(() =>
  rawChartData.value.map(data => buildChartOption(data, /* showLabels = */ false))
);

const detailedCharts = computed(() =>
  rawChartData.value.map(data => buildChartOption(data, /* showLabels = */ true))
);

</script>

<template>
    <FlippableCard :data="barChartData" :altData='barChartData'
    title="Offensive Action per PPP" class="mb-4 basis-138" />
    <FlippableCard v-for="(chartOptions, index) in statCharts" :key="index" :data="chartOptions" :altData='detailedCharts[index]'
        :title="chartOptions.title.text" class="mb-4 basis-138" />
</template>