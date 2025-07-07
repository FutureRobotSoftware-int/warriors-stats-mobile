<template>
  <div class="drawer drawer-end relative">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content fixed right-5 bottom-5">
      <!-- Page content here -->
      <label for="my-drawer" class="btn btn-primary drawer-button"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>
      </label>
    </div>
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <div 
      class="p-6 h-full border border-base-300 shadow-md bg-base-100 text-base-content">
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
        </div>
    
        <button
          @click="clearFilters"
          class="mt-4 btn btn-error text-error-content"
        >
          Clear
        </button>
      </div>
    </div>
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

const filteredEntries = computed(() =>
    shotDataStore.getFilteredEntries(filters.selectedFilters, filters.hiddenCategories)
)

const totalCount = computed(() => shotDataStore.getAll.length)
const filteredCount = computed(() => filteredEntries.value.length)

function clearFilters() {
    filters.clearAll()
}
</script>