<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { usePlayers } from '../services/stores/players'
import { loadPlayers } from '../services/data/dataLoader'

const selectedPlayerId = ref<number | null>(null)
const playersStore = usePlayers()

onMounted(async () => {
    await loadPlayers()
})
</script>

<template>
    <header class="bg-primary p-2 text-white font-medium">
        <div class="flex items-center justify-between mx-24">
            <div class="mx-4">
                <img src="../assets/i-1193632972.png" class="size-16">
            </div>
            <div class="grow mx-4">
                <select name="" id="player-select" v-model="selectedPlayerId"
                    class="select select-lg rounded-full border-base-100 bg-primary border-2 focus:outline-base-100">
                    <option disabled value="">-- Selecciona un jugador --</option>
                    <option class="lg:text-sm" v-for="player in playersStore.players" :key="player.id"
                        :value="player.id">
                        {{ player.player }} #{{ player.number }}
                    </option>
                </select>
            </div>
            <div class="mx-4">
                <select name="" id=""
                    class="select select-lg rounded-full border-base-100 bg-primary w-fit border-2 focus:outline-base-100">
                    <option class="lg:text-sm">2024-2025</option>
                    <option class="lg:text-sm">2023-2025</option>
                    <option class="lg:text-sm">All time</option>
                </select>
            </div>
        </div>
    </header>
</template>