import type { IChartOptions } from "../../types/chartOptions"

export function buildChartOption({ title, values, fg, col }: IChartOptions, showLabels = true) {
    return {
        title: { text: title, left: 'center', show: false },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: Array.isArray(col) ? col : [],
            show: showLabels,
        },
        series: [
            {
                name: 'Frequency',
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '40%'],
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
                radius: ['50%', '65%'],
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
}

export function buildBarChartOption(
    actions: string[],
    series: {
        name: string;
        type: 'bar';
        stack: string;
        emphasis: object;
        data: { value: number; ppp: number }[];
    }[],
    pppLine: number[]
) {

    const names = series.map((entry) => entry.name);

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: [...names, "PPP"],
        },
        xAxis: {
            type: 'category',
            data: actions,
            axisLabel: {
                rotate: 30,
            }
        },
        yAxis: [
            {
                type: 'value',
                name: 'Total',
                alignTicks: true,
                splitNumber: 6,
                splitLine: { show: true }
            },
            {
                type: 'value',
                name: 'PPP',
                position: 'right',
                min: 0,
                max: 3,
                alignTicks: true,
                splitNumber: 6,
                splitLine: { show: false },
                axisLabel: {
                    formatter: (val: number) => val.toFixed(2)  // 👈 redondea a 2 decimales
                }
            }
        ],
        series: [
            ...series,
            {
                name: 'PPP',
                type: 'line',
                yAxisIndex: 1,
                data: pppLine,
                itemStyle: { color: '#2196F3' },
                lineStyle: { width: 2, type: 'dashed' },
                symbol: 'circle',
                symbolSize: 6,
            }
        ]
    };
}
