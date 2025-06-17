<template>
    <div class="absolute inset-0 backface-hidden transform rotate-y-180">
        <div class="card-body text-center pt-3">
            <div class="flex items-center justify-between">
                <button class="btn btn-neutral" @click="$emit('flip')">⇄</button>
                <h2 class="text-xl font-semibold">{{ title }} - Table</h2>
                <div class="w-6"></div>
            </div>
            <div class="w-full h-48 bg-warning content-center">Sample Table</div>
        </div>
    </div>
</template>

<script setup>

defineProps({ title: String })

</script>