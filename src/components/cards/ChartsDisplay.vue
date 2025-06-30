<script setup>
import FlippableCard from './chartCard/FlippableCard.vue'
import { computed } from 'vue'
import { useShotData } from '../../services/stores/shotData'
import { useGraphFilters } from '../../services/stores/graphFilters'
import { buildChartOption, buildBarChartOption } from '../../services/charts/buildChart'

const shotDataStore = useShotData()
const filters = useGraphFilters()

const metrics = [
  { title: 'Area', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Area'] },
  { title: 'Player Direction', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Player Direction'] },
  { title: 'Offensive Action', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Offensive Action'] },
  { title: 'Hop/1-2', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Hop/1-2'] },
  { title: 'Off Dribble Hand', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Off Dribble Hand'] },
  { title: 'Defender Distance', legend: 'getUniqueColumnValues', fieldGoal: 'getFGByColumn', data: 'getGroupedData', args: ['Defender Distance'] },
]

const filteredEntries = (fieldKey) =>
  shotDataStore.getFilteredEntries(filters.selectedFilters, filters.hiddenCategories, fieldKey, false)


const enrichedData = computed(() =>
  metrics.map((metric) => {
    const fieldKey = metric.args[0]
    const values = shotDataStore[metric.data](...metric.args, filteredEntries(fieldKey))
    const fg = shotDataStore[metric.fieldGoal](...metric.args, filteredEntries(fieldKey))
    const col = shotDataStore[metric.legend](...metric.args, filteredEntries(fieldKey))

    const option = buildChartOption({ title: metric.title, values, fg, col }, false)
    const altOption = buildChartOption({ title: metric.title, values, fg, col }, true)

    return {
      ...metric,
      option,
      altOption,
    }
  })
)

const barChartData = computed(() => {
  const { actions, series, pppLine } = shotDataStore.getStackedPPPAndFrequencyByActionArea(filteredEntries.value)
  return buildBarChartOption(actions, series, pppLine)
})

</script>

<template>

  <!-- Bar Chart -->
  <FlippableCard
    :data="barChartData"
    :altData="barChartData"
    title="Offensive Action per PPP"
    class="mb-4 basis-138"
    fieldKey="Offensive Action"
  />

  <!-- Pie Charts -->
  <FlippableCard
    v-for="(chart, index) in enrichedData"
    :key="index"
    :data="chart.option"
    :altData="chart.altOption"
    :title="chart.title"
    :fieldKey="chart.args[0]"
    class="mb-4 basis-138"
  />
</template>
