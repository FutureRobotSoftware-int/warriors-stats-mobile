<template>
    <div class="relative">
        <!-- Contenedor con efecto de perspectiva -->
        <div class="card bg-base-100 shadow-sm w-full h-80 perspective overflow-hidden">
            <div class="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d"
                :class="{ 'rotate-y-180': isFlipped }">
                <CardFront :title="title" @flip="toggleFlip" @expand="isExpanded = true" />
                <CardBack :title="title" @flip="toggleFlip" />
            </div>
        </div>

        <ExpandedView v-if="isExpanded" :title="title" @close="isExpanded = false" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ExpandedView from './ExpandedView.vue';
import CardFront from './CardFront.vue';
import CardBack from './CardBack.vue';

const isExpanded = ref(false);
const isFlipped = ref(false);

const toggleFlip = () => {
    isFlipped.value = !isFlipped.value;
};

defineProps({
    title: String,
    data: Array
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
