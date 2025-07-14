<template>
    <div class="relative">
        <div class="card bg-base-100 shadow-sm h-78 w-67 perspective overflow-visible">
            <div class="relative h-full w-full transition-transform duration-500 transform-style-preserve-3d"
                :class="{ 'rotate-y-180': isFlipped }">
                <CardFront :title="title" @flip="toggleFlip" @expand="isExpanded = true">
                    <BaseChart :option="data" :fieldKey="fieldKey" :interactive="true" :filterable="true"/>
                </CardFront>
            </div>
        </div>

        <ExpandedView v-if="isExpanded" :title="title" @close="isExpanded = false">
            <BaseChart :option="altData" :fieldKey="fieldKey" :interactive="true" :filterable="true"/>
        </ExpandedView>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ExpandedView from './ExpandedView.vue';
import CardFront from './CardFront.vue';
import CardBack from '../../legacy/CardBack.vue';
import BaseChart from './BaseChart.vue';

const isExpanded = ref(false);
const isFlipped = ref(false);

const toggleFlip = () => {
    isFlipped.value = !isFlipped.value;
};

defineProps({
    title: String,
    data: Object,
    altData: Object,
    fieldKey: String,
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
