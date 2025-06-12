<template>
  <div class="bg-base-300 overflow-hidden no-scrollbar w-full">
    <Header />
    <div class="flex w-full">
      <Main class="w-auto" />
      <Filters class="w-1/4 mx-2" />
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Main from './components/Main.vue';
import Filters from './components/Filters.vue';
</script>