<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { usePlayers } from '../services/stores/players'
import { loadPlayers } from '../services/data/dataLoader'
import { usePeriod } from '../services/stores/year'
import { watch } from 'vue'
import { useGraphFilters } from '../services/stores/graphFilters'

const graphFiltersStore = useGraphFilters()

const periodStore = usePeriod()
const selectedPeriodId = ref<number | ''>('')

const selectedPlayerId = ref<number | ''>('')
const playersStore = usePlayers()

const selectedMode = ref<string>('')

watch(selectedMode, (newMode) => {
  console.log('Mode changed to:', newMode)
  graphFiltersStore.setMode(newMode as 'general' | 'inefficiencies')

  if (newMode === 'general') {
    graphFiltersStore.clearAllGeneral()
  }
})



onMounted(async () => {
    await loadPlayers()
    if (playersStore.players.length > 0) {
        selectedPlayerId.value = playersStore.players[0].id
    }

    if (periodStore.periods.length > 0) {
        selectedPeriodId.value = periodStore.periods[0].id
        periodStore.selectPeriod(periodStore.periods[0])
    }
})

function handlePeriodChange() {
  const selected = periodStore.periods.find(p => p.id === selectedPeriodId.value)
  if (selected) {
    periodStore.selectPeriod(selected)
  }
}

function handlePlayerChange() {
  const selected = playersStore.players.find(p => p.id === selectedPlayerId.value);
  if (selected) {
    playersStore.selectPlayer(selected);
  }
}

</script>

<template>
    <header class="bg-primary p-0 text-white font-medium">
        <p class="absolute">v.0.1.5</p>
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
                    <option value="inefficiencies" class="lg:text-sm">Inefficiencies</option>
                </select>
            </div>
        </div>
    </header>
</template>