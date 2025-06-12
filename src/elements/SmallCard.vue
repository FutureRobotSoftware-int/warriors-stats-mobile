<template>
    <div class="card card-border bg-base-100 w-fit text-center mx-2">
        <div class="card-body py-5 px-6">
            <h2 class="font-medium text-sm">{{ title }}</h2>
            <p class="text-3xl font-medium">{{ stat }}</p>
        </div>
    </div>
</template>

<script setup>

defineProps({
    title: String,
    stat: String,
});

</script>