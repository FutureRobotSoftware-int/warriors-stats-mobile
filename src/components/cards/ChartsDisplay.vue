<script setup>
import FlippableCard from './chartCard/FlippableCard.vue'
import { computed } from 'vue'
import { useShotData } from '../../services/stores/shotData'
import { useGraphFilters } from '../../services/stores/graphFilters'
import { buildChartOption, buildBarChartOption } from '../../services/charts/buildChart'
import CardFront from './chartCard/CardFront.vue'
import BaseChart from './chartCard/BaseChart.vue'
import ExpandedView from './chartCard/ExpandedView.vue'
import { ref } from 'vue';
import FilterCard from '../media/FilterCard.vue'

defineProps({
    title: String,
    data: Object,
    altData: Object,
    fieldKey: String,
});

const shotDataStore = useShotData()
const filters = useGraphFilters()

const mode = computed(() => filters.mode)

const metrics = [
  { title: 'Area', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Area'] },
  { title: 'Player Direction', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Player Direction'] },
  { title: 'Offensive Action', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Offensive Action'] },
  { title: 'Footwork', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Hop/1-2'] },
  { title: 'Off Dribble Hand', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Off Dribble Hand'] },
  { title: 'Defender Distance', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Defender Distance'] },
  { title: 'Pass from Direction', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Pass Direction'] },
]

const filteredEntries = (fieldKey) =>
  shotDataStore.getFilteredEntries(filters.selectedFilters, filters.hiddenCategories, fieldKey, false)


  const enrichedData = computed(() =>
  metrics.map((metric) => {
    const fieldKey = metric.args[0]
    const dataset = filteredEntries(fieldKey)

    const values = shotDataStore[metric.data](...metric.args, dataset)
    const fg =
      mode.value === 'inefficiencies'
        ? shotDataStore.getInefficiencyByColumn(...metric.args, dataset)
        : shotDataStore.getFGByColumn(...metric.args, dataset)

    const col = shotDataStore[metric.legend](...metric.args, dataset)

    const option = buildChartOption({ title: metric.title, values, fg, col }, false)
    const altOption = buildChartOption({ title: metric.title, values, fg, col }, true)

    

    return {
      ...metric,
      option,
      altOption,
    }
  })
)

</script>

<template>

  <div class="flex flex-wrap">
    <FlippableCard
      v-for="(chart, index) in enrichedData"
      :key="index"
      :data="chart.option"
      :altData="chart.altOption"
      :title="chart.title"
      :fieldKey="chart.args[0]"
      class="m-1"
    />
    <FilterCard />
  </div>
</template>