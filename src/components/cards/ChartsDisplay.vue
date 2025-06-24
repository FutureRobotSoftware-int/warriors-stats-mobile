<script setup>

import FlippableCard from './chartCard/FlippableCard.vue';
import BaseChart from './chartCard/BaseChart.vue'
import { loadShotData } from '../../services/data/dataLoader';
import { onMounted, ref, computed } from 'vue';
import { useShotData } from '../../services/stores/shotData';

const shotDataStore = useShotData()

const metrics = [
    { title: 'Area', col: 'getFGByColumn', data: 'getGroupedData', args: ['Area'] },
    { title: 'Player Direction', col: 'getFGByColumn', data: 'getGroupedData', args: ['Player Direction'] },
    { title: 'Offensive Action', col: 'getFGByColumn', data: 'getGroupedData', args: ['Offensive Action'] },
    { title: 'Hop/1-2', col: 'getFGByColumn', data: 'getGroupedData', args: ['Hop/1-2'] },
    { title: 'Off Dribble Hand', col: 'getFGByColumn', data: 'getGroupedData', args: ['Off Dribble Hand'] },
    { title: 'Defender Distance', col: 'getFGByColumn', data: 'getGroupedData', args: ['Defender Distance'] },

]

const statCharts = computed(() =>
    metrics.map(({ title, col = '', data, args = [] }) => {
        const values = shotDataStore[data](...args);

        const fg = shotDataStore[col](...args);
        return {
            // title,
            // stat: value + suffix,
            title: { text: title, left: 'center', show: false },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)',
            },
            // legend: {
            //     orient: 'vertical',
            //     left: 'left',
            //     data: columns,
            // },
            series: [
                {
                    name: 'Frequency',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],
                    label: {
                        position: 'inner',
                        fontSize: 14
                    },
                    labelLine: {
                        show: false
                    },
                    data: values
                },
                {
                    name: 'FG%',
                    type: 'pie',
                    radius: ['45%', '60%'],
                    labelLine: {
                        length: 30
                    },
                    label: {
                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}% ',
                        backgroundColor: '#F6F8FC',
                        borderColor: '#8C8D8E',
                        borderWidth: 1,
                        borderRadius: 4,

                        rich: {
                            a: {
                                color: '#6E7079',
                                lineHeight: 22,
                                align: 'center'
                            },
                            hr: {
                                borderColor: '#8C8D8E',
                                width: '100%',
                                borderWidth: 1,
                                height: 0
                            },
                            b: {
                                color: '#4C5058',
                                fontSize: 14,
                                fontWeight: 'bold',
                                lineHeight: 33
                            },
                            per: {
                                color: '#fff',
                                backgroundColor: '#4C5058',
                                padding: [3, 4],
                                borderRadius: 4
                            }
                        }
                    },
                    data: fg
                }
            ],
        }
    })
)

</script>

<template>
    <FlippableCard v-for="(chartOptions, index) in statCharts" :key="index" :data="chartOptions"
        :title="chartOptions.title.text" class="mb-4 basis-128" />
</template>