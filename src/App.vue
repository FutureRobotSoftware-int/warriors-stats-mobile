<template>
  <div class="bg-base-300 overflow-hidden no-scrollbar w-full">
    <Header />
    <div class="flex w-full">
      <Main class="w-full" />
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Main from './components/Main.vue';
</script>