<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { usePlayers } from '../services/stores/players'
import { usePeriod } from '../services/stores/year'
import { useGraphFilters } from '../services/stores/graphFilters'
import { useShotData } from '../services/stores/shotData'
import { loadPlayers } from '../services/data/dataLoader'

const selectedPlayerId = ref<number | ''>('')
const selectedPeriodId = ref<number | ''>('')
const selectedMode = ref<'general' | 'most-common'>('general') // tipado desde el inicio

const playersStore = usePlayers()
const periodStore = usePeriod()
const graphFiltersStore = useGraphFilters()
const shotDataStore = useShotData()

watch(selectedMode, (mode) => {
  console.log('Mode changed to:', mode)
  graphFiltersStore.setMode(mode)

  if (mode === 'general') {
    graphFiltersStore.clearAllGeneral()
  }

  if (mode === 'most-common') {
    graphFiltersStore.clearAll()

    const commonOffensive = shotDataStore.getMostCommonColumnValue('Offensive Action')
    const defaultAreas = ['Left Wing', 'Right Wing']

    if (commonOffensive) {
        graphFiltersStore.setFilter('Offensive Action', commonOffensive)
    }

    defaultAreas.forEach(area => {
        graphFiltersStore.setFilter('Area', area)
    })
    }
})

onMounted(async () => {
  await loadPlayers()

  const firstPlayer = playersStore.players[0]
  if (firstPlayer) selectedPlayerId.value = firstPlayer.id

  const firstPeriod = periodStore.periods[0]
  if (firstPeriod) {
    selectedPeriodId.value = firstPeriod.id
    periodStore.selectPeriod(firstPeriod)
  }
})

function handlePeriodChange() {
  const selected = periodStore.periods.find(p => p.id === selectedPeriodId.value)
  if (selected) periodStore.selectPeriod(selected)
}

function handlePlayerChange() {
  const selected = playersStore.players.find(p => p.id === selectedPlayerId.value)
  if (selected) playersStore.selectPlayer(selected)
}
</script>

<template>
    <header class="bg-primary p-0 text-white font-medium">
        <p class="absolute">v.0.2.0</p>
        <div class="flex items-center justify-between mx-24">
            <div class="mx-4">
                <img src="../assets/i-1193632972.png" class="size-12">
            </div>
            <div class="grow mx-4">
                <select name="" id="player-select" v-model="selectedPlayerId" @change="handlePlayerChange"
                    class="select select-md rounded-full border-base-100 bg-primary border-2 focus:outline-base-100">
                    <option value="" class="lg:text-sm">-- Select a player --</option>
                    <option class="lg:text-sm" v-for="player in playersStore.players" :key="player.id"
                        :value="player.id">
                        {{ player.player }} #{{ player.number }}
                    </option>
                </select>
            </div>
            <div class="mx-4">
                <select
                    v-model="selectedPeriodId"
                    @change="handlePeriodChange"
                    class="select select-md rounded-full border-base-100 bg-primary w-fit border-2 focus:outline-base-100"
                >
                    <option value="">-- Select a season --</option>
                    <option
                        v-for="period in periodStore.periods"
                        :key="period.id"
                        :value="period.id"
                        class="lg:text-sm"
                    >
                        {{ period.period }}
                    </option>
                </select>
            </div>
            <div class="mx-4">
                <select
                    v-model="selectedMode"
                    class="select select-md rounded-full border-base-100 bg-primary w-fit border-2 focus:outline-base-100"
                >
                    <option value="">-- Select a mode --</option>
                    <option value="general" class="lg:text-sm">General</option>
                    <option value="most-common" class="lg:text-sm">Most Common</option>
                </select>
            </div>
        </div>
    </header>
</template>