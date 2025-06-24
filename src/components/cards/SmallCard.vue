<template>
    <div class="card card-border bg-base-100 w-dvw text-center mx-2">
        <div class="card-body py-4 px-6">
            <h2 class="font-medium text-sm">{{ title }}</h2>
            <p class="text-lg font-bold">{{ stat }}</p>
        </div>
    </div>
</template>

<script setup>

defineProps({
    title: String,
    stat: String,
});

</script>