<template>
        <div 
        class="">
          <h2 class="text-xl font-semibold mb-3">Totals</h2>
      
          <p class="text-base">
            <strong class="">Active Entries: </strong>
            <span class="font-mono">{{ filteredCount }}/{{ totalCount }}</span>
          </p>
      
          <div v-if="hasFilters" class="mb-4">
            <p class="font-semibold">Current Filters:</p>
            <ul class="list-disc list-inside text-sm mt-1">
              <li v-for="(valueSet, key) in selectedFilters" :key="key">
                {{ key }}:
                <span class="font-mono">
                  {{ Array.from(valueSet).join(', ') }}
                </span>
              </li>
            </ul>
          </div>
      
          <div class="">
            <button
                @click="clearFilters"
                class="mt-4 mx-1 btn btn-error text-error-content"
            >
                Clear
            </button>

            <button @click="$emit('expand')" class="mt-4 mx-1 btn btn-info text-info-content">
                See Footage
            </button>
          </div>
        </div>
</template>
    
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useShotData } from '../../../services/stores/shotData'
  import { useGraphFilters } from '../../../services/stores/graphFilters'
  
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