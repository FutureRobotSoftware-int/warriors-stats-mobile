<script setup lang="ts">
import { useShotData } from '../../services/stores/shotData';

const shotDataStore = useShotData()

const entries = shotDataStore.getActiveEntries

console.log(entries)

</script>

<template>
  <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
    <table class="table table-zebra table-xs w-full">
      <thead class="sticky top-0 bg-base-200 z-10">
        <tr>
          <th
            v-for="key in Object.keys(entries[0] || {})"
            :key="key"
            class="text-xs"
          >
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
