<script setup lang="ts">
import { useShotData } from '../../services/stores/shotData';

const shotDataStore = useShotData()

const entries = shotDataStore.getActiveEntries

console.log(entries)

</script>

<template>
  <div class="overflow-x-auto max-h-[500px] overflow-y-auto">
    <table class="table table-zebra table-xs w-full">
      <thead>
        <tr>
          <th v-for="key in Object.keys(entries[0] || {})" :key="key" class="text-xs">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in entries" :key="index">
          <td v-for="(value, key) in entry" :key="key" class="text-xs">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
