<template>
    <div class="p-6 rounded-box border border-base-300 shadow-md bg-base-100 text-base-content fixed z-50">
      <h2 class="text-xl font-bold mb-3">Resume</h2>
  
      <p class="mb-3 text-base">
        <strong class="">Active Entries: </strong>
        <span class="font-mono">{{ filteredCount }}/{{ totalCount }}</span>
      </p>
  
      <div v-if="hasFilters" class="mb-4">
        <p class="font-semibold">Current Filters:</p>
        <ul class="list-disc list-inside text-sm mt-1">
          <li v-for="(value, key) in selectedFilters" :key="key">
            {{ key }}: <span class="font-mono">{{ value }}</span>
          </li>
        </ul>
  
        <!-- <div v-if="hiddenList.length" class="mt-3">
          <p class="font-semibold text-secondary">Categorías ocultas:</p>
          <ul class="list-disc list-inside text-sm mt-1">
            <li v-for="(items, key) in hiddenCategories" :key="key">
              {{ key }}:
              <span class="font-mono">{{ items.add(', ') }}</span>
            </li>
          </ul>
        </div> -->
      </div>
  
      <button
        @click="clearFilters"
        class="mt-4 btn btn-error text-error-content"
      >
        Clear
      </button>
    </div>
  </template>
  

<script setup lang="ts">
import { computed } from 'vue'
import { useShotData } from '../services/stores/shotData'
import { useGraphFilters } from '../services/stores/graphFilters'

const shotDataStore = useShotData()
const filters = useGraphFilters()

const selectedFilters = computed(() => filters.selectedFilters)
const hiddenCategories = computed(() => filters.hiddenCategories)

const hasFilters = computed(() => {
    return Object.keys(selectedFilters.value).length > 0 || Object.keys(hiddenCategories.value).length > 0
})

// const hiddenList = computed(() =>
//     Object.entries(hiddenCategories.value).filter(([_, v]) => v.size > 0)
// )

const filteredEntries = computed(() =>
    shotDataStore.getFilteredEntries(filters.selectedFilters, filters.hiddenCategories)
)

const totalCount = computed(() => shotDataStore.getAll.length)
const filteredCount = computed(() => filteredEntries.value.length)

function clearFilters() {
    filters.clearAll()
}
</script>