import type { IChartOptions } from "../../types/chartOptions"
import { getColor, getAbbreviation } from "./dataProcessor";

export function buildChartOption({ title, values, fg, col }: IChartOptions, showLabels = true) {

    let legends = {};

    let labels = {};

    if (!showLabels) {
        legends = {
            type: 'plain',
            orient: 'horizontal',
            top: 'bottom',
            itemGap: 12,
            itemWidth: 18,
            textStyle: {
                fontSize: 12
            }
        };
        labels = {
            show: true,
            position: 'inner',
            fontSize: 10,
            formatter: (params: any) => {
                const abbrev = getAbbreviation(params.name);
                return `${abbrev}`;
            },
        }
    } else {
        legends = {
            orient: 'vertical',
            type: "scroll",
            left: 'left',
            data: Array.isArray(col) ? col : [],
            show: true,
        }
        labels = {
            show: showLabels,
            formatter: (params: any) => {
                const fgValue = params.value;
                const freq = params.data.frequencyValue;

                return `{a|${params.name}}{abg|}\n{hr|}\n {b|Field Goal}: ${fgValue}%\n {b|Frequency}: ${freq}`;
            },
            backgroundColor: '#F6F8FC',
            borderColor: '#8C8D8E',
            borderWidth: 1,
            borderRadius: 4,

            rich: {
                a: {
                    color: '#4C5058',
                    lineHeight: 22,
                    fontWeight: 'bold',
                    align: 'center',
                },
                hr: {
                    borderColor: '#8C8D8E',
                    width: '100%',
                    borderWidth: 1,
                    height: 0
                },
                b: {
                    color: '#6E7079',
                    fontSize: 14,
                    fontWeight: 'bold',
                    lineHeight: 33,
                    align: 'left'
                },
                per: {
                    color: '#fff',
                    backgroundColor: '#6E7079',
                    padding: [3, 4],
                    borderRadius: 4,
                    align: 'left'
                }
            }
        }
    }

    return {
        title: { text: title, left: 'center', show: false },
        tooltip: {
            trigger: 'item',
            appendToBody: true,
            alwaysShowContent: false,
            formatter: (params: any) => {
                const { seriesName, name, value, percent } = params;
                if (seriesName === 'Frequency') {
                    return `${name}: ${value} (${percent}%)`;
                } else if (seriesName === 'FG%') {
                    return `${seriesName}<br/>${name}: ${value}%`;
                }
                return `${name}: ${value}`;
            }
        },
        legend: legends,
        series: [
            {
                name: 'Frequency',
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '40%'],
                center: ['50%', '40%'],
                label: {
                    show: false,
                    position: 'inner',
                    fontSize: 10,
                    formatter: (params: any) => {
                        const abbrev = getAbbreviation(params.name);
                        return `${abbrev}`;
                    },
                },
                labelLine: {
                    show: true
                },
                data: (values as { name: string; value: number }[]).map(v => ({
                    ...v,
                    itemStyle: { color: getColor(v.name) }
                }))
            },
            {
                name: 'FG%',
                type: 'pie',
                radius: ['50%', '65%'],
                center: ['50%', '40%'],
                labelLine: {
                    length: 30
                },
                label: labels,
                data: (fg as { name: string; value: number }[]).map(v => {
                    const freq = (values as { name: string; value: number }[]).find(f => f.name === v.name)?.value || 0;
                    return {
                        ...v,
                        frequencyValue: freq,
                        itemStyle: { color: getColor(v.name) }
                    }
                })
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
) {

    const names = series.map((entry) => entry.name);

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: [...names, "PPP"],
            location: 'center',
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
                    formatter: (val: number) => val.toFixed(2)
                }
            }
        ],
        series: [
            ...series.map(s => ({
                ...s,
                itemStyle: { color: getColor(s.name) }
            })),
        ]
    };
}

// export function buildZoneChartOption(entries: IShotData[]) {
//     const courtZones = [
//         { name: 'Left Corner', x: 50, y: 240, color: '#4fc3f7' },
//         { name: 'Left Wing', x: 100, y: 160, color: '#81c784' },
//         { name: 'Center', x: 200, y: 120, color: '#fff176' },
//         { name: 'Right Wing', x: 300, y: 160, color: '#ffb74d' },
//         { name: 'Right Corner', x: 350, y: 240, color: '#e57373' },
//     ];

//     const totalEntries = entries.length;
//     const areaMap = new Map<
//         string,
//         { [action: string]: { makes: number; total: number } }
//     >();

//     for (const entry of entries) {
//         const area = entry.Area;
//         const action = entry['Offensive Action'];
//         const result = entry['Make/Miss'];

//         if (!area || !action) continue;

//         if (!areaMap.has(area)) areaMap.set(area, {});
//         const actions = areaMap.get(area)!;

//         if (!actions[action]) actions[action] = { makes: 0, total: 0 };

//         actions[action].total += 1;
//         if (result.trim() === 'Make') actions[action].makes += 1;
//     }

//     const labels = [];

//     for (const zone of courtZones) {
//         const areaData = areaMap.get(zone.name);

//         if (!areaData) continue;

//         const topAction = Object.entries(areaData).reduce((a, b) =>
//             a[1].total >= b[1].total ? a : b
//         );

//         const [actionName, { makes, total }] = topAction;
//         const fg = total > 0 ? Math.round((makes / total) * 100) : 0;
//         const freq = total > 0 ? Math.round((total / totalEntries) * 100) : 0;

//         labels.push({
//             ...zone,
//             action: actionName,
//             fg,
//             freq,
//         });
//     }

//     return {
//         graphic: [
//             {
//                 type: 'image',
//                 style: {
//                     image: '/half-court.svg',
//                     width: 400,
//                     height: 250,
//                 },
//                 left: 'center',
//                 top: 'middle',
//             },
//             ...labels.map((zone) => ({
//                 type: 'rect',
//                 left: zone.x,
//                 top: zone.y,
//                 shape: { width: 80, height: 60 },
//                 style: {
//                     fill: zone.color,
//                     opacity: 0.3,
//                 },
//             })),
//             ...labels.map((zone) => ({
//                 type: 'text',
//                 left: zone.x + 5,
//                 top: zone.y + 5,
//                 style: {
//                     text: `${zone.action}\nFG: ${zone.fg}%\nFreq: ${zone.freq}%`,
//                     font: '13px sans-serif',
//                     fill: '#000',
//                     backgroundColor: '#fff',
//                     borderRadius: 4,
//                     padding: 6,
//                     shadowBlur: 5,
//                     shadowColor: '#aaa',
//                 },
//             })),
//         ],
//     };
// }
