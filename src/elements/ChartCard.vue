<template>
    <div class="relative">
        <!-- Contenedor con efecto de perspectiva -->
        <div class="card bg-base-100 shadow-sm w-full h-80 perspective overflow-hidden">
            <div class="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d"
                :class="{ 'rotate-y-180': isFlipped }">
                <!-- Lado Frontal (Gráfico) -->
                <div class="absolute inset-0 backface-hidden">
                    <div class="card-body text-center pt-3">
                        <div class="flex items-center justify-between">
                            <button class="btn btn-neutral" @click="toggleFlip">⇄</button>
                            <h2 class="text-xl font-semibold">{{ title }}</h2>
                            <button @click="isExpanded = true" class="">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                </svg>
                            </button>
                        </div>
                        <div class="w-full h-48 bg-info content-center">Sample Chart</div>
                    </div>
                </div>

                <!-- Lado Posterior (Tabla) -->
                <div class="absolute inset-0 backface-hidden transform rotate-y-180">
                    <div class="card-body text-center pt-3">
                        <div class="flex items-center justify-between">
                            <button class="btn btn-neutral" @click="toggleFlip">⇄</button>
                            <h2 class="text-xl font-semibold">{{ title }} - Tabla</h2>
                            <div class="w-6"></div>
                        </div>
                        <div class="w-full h-48 bg-warning content-center">Sample Table</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Vista expandida -->
        <div v-if="isExpanded" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
            <div class="bg-base-100 p-6 rounded-2xl shadow-lg w-[90%] max-w-5xl relative">
                <button @click="isExpanded = false"
                    class="absolute top-2 right-4 text-2xl font-bold hover:text-error">×</button>
                <h2 class="text-2xl font-bold mb-4">{{ title }} (Expandido)</h2>
                <div class="w-full h-96 bg-info content-center text-center">Sample Chart Expandido</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const isExpanded = ref(false);
const isFlipped = ref(false);

const toggleFlip = () => {
    isFlipped.value = !isFlipped.value;
};

defineProps({
    title: String
});
</script>

<style scoped>
.perspective {
    perspective: 1000px;
}

.transform-style-preserve-3d {
    transform-style: preserve-3d;
}

.backface-hidden {
    backface-visibility: hidden;
}

.rotate-y-180 {
    transform: rotateY(180deg);
}
</style>
