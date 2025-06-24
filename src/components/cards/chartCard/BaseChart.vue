<template>
    <v-chart
      class="chart"
      :option="option"
      autoresize
      :style="{ width, height }"
    />
  </template>
  
  <script setup>
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { PieChart, BarChart, LineChart } from 'echarts/charts';
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
  } from 'echarts/components';
  import VChart, { THEME_KEY } from 'vue-echarts';
  import { provide } from 'vue';
  
  use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    BarChart,
    LineChart,
  ]);
  
  provide(THEME_KEY, 'light');
  
  const props = defineProps({
    option: {
      type: Object,
      required: true,
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
  });
  </script>
  
  <style scoped>
  .chart {
    display: block;
  }
  </style>
  