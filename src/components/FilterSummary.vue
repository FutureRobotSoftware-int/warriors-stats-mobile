<template>
    <div class="p-4 rounded-lg border shadow bg-white dark:bg-zinc-900 dark:text-white">
        <h2 class="text-lg font-semibold mb-2">Resumen de Filtros</h2>

        <p class="mb-2">
            <strong>Active entries:</strong> {{ filteredCount }} / {{ totalCount }}
        </p>

        <div v-if="hasFilters" class="mb-4">
            <p class="font-semibold">Active Filters:</p>
            <ul class="list-disc list-inside">
                <li v-for="(value, key) in selectedFilters" :key="key">
                {{ key }}: <span class="font-mono">{{ value }}</span>
                </li>
            </ul>

            <div v-if="hiddenList.length" class="mt-2">
                <p class="font-semibold">Hidden Categories:</p>
                <ul class="list-disc list-inside">
                    <li v-for="(items, key) in hiddenCategories" :key="key">
                        {{ key }}: 
                        <span class="font-mono">{{ items.add(', ') }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <button
            @click="clearFilters"
            class="mt-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
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

const hiddenList = computed(() =>
    Object.entries(hiddenCategories.value).filter(([_, v]) => v.size > 0)
)

const filteredEntries = computed(() =>
    shotDataStore.getFilteredEntries(filters.selectedFilters, filters.hiddenCategories)
)

const totalCount = computed(() => shotDataStore.getAll.length)
const filteredCount = computed(() => filteredEntries.value.length)

function clearFilters() {
    filters.clearAll()
}
</script>