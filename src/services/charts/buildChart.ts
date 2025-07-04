import type { IChartOptions } from "../../types/chartOptions"
import type { IShotData } from "../../types/shotData";

function getColor(name: string): string {
    const COLOR_MAP: Record<string, string> = {
        //Offensive moves
        'DHO': '#66c5cc',
        'Drive Kick': '#f6cf71',
        'Flare': '#f89c74',
        'Iso': '#dcb0f2',
        'Lift': '#87c55f',
        'Pin Down': '#9eb9f3',
        'PnPop': '#fe88b1',
        'PnR': '#c9db74',
        'Post Kick Out': '#8be0a4',
        'Spot Up': '#b497e7',
        //Area
        'Left Corner': '#66c5cc',
        'Left Wing': '#f6cf71',
        'Top': '#f89c74',
        'Right Wing': '#dcb0f2',
        'Right Corner': '#87c55f',
        //Player Direction
        'Left': '#66c5cc',
        'Right': '#f6cf71',
        'To Hoop': '#dcb0f2',
        'Away From Hoop': '#87c55f',
        'Stationary': '#9eb9f3',
        //Pass Direction
        'From Hoop': '#f89c74',
        'N/A Off Dribble': '#2c9ec5',
        //Off Dribble hand
        'Left to RightPickUp': '#87c55f',
        'Right to LeftPickup': '#9eb9f3',
        'N/A': '#2c9ec5',
        //Hop/1-2
        'Hop  ': '#66c5cc',
        '1-2 Right/Left': '#f6cf71',
        '1-2 Left/Right': '#f89c74',
        //Defender Distance
        'Tight': '#66c5cc',
        'Close': '#f6cf71',
        'Open': '#f89c74',
        'Wide Open': '#87c55f',
    };
    return COLOR_MAP[name] || '#b3b3b3';
}

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
                    show: true,
                    position: 'inner',
                    fontSize: 14
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
                data: (fg as { name: string; value: number }[]).map(v => ({
                    ...v,
                    itemStyle: { color: getColor(v.name) }
                }))
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

export function buildZoneChartOption(entries: IShotData[]) {
    const courtZones = [
        { name: 'Left Corner', x: 50, y: 240, color: '#4fc3f7' },
        { name: 'Left Wing', x: 100, y: 160, color: '#81c784' },
        { name: 'Center', x: 200, y: 120, color: '#fff176' },
        { name: 'Right Wing', x: 300, y: 160, color: '#ffb74d' },
        { name: 'Right Corner', x: 350, y: 240, color: '#e57373' },
    ];

    const totalEntries = entries.length;
    const areaMap = new Map<
        string,
        { [action: string]: { makes: number; total: number } }
    >();

    for (const entry of entries) {
        const area = entry.Area;
        const action = entry['Offensive Action'];
        const result = entry['Make/Miss'];

        if (!area || !action) continue;

        if (!areaMap.has(area)) areaMap.set(area, {});
        const actions = areaMap.get(area)!;

        if (!actions[action]) actions[action] = { makes: 0, total: 0 };

        actions[action].total += 1;
        if (result.trim() === 'Make') actions[action].makes += 1;
    }

    const labels = [];

    for (const zone of courtZones) {
        const areaData = areaMap.get(zone.name);

        if (!areaData) continue;

        const topAction = Object.entries(areaData).reduce((a, b) =>
            a[1].total >= b[1].total ? a : b
        );

        const [actionName, { makes, total }] = topAction;
        const fg = total > 0 ? Math.round((makes / total) * 100) : 0;
        const freq = total > 0 ? Math.round((total / totalEntries) * 100) : 0;

        labels.push({
            ...zone,
            action: actionName,
            fg,
            freq,
        });
    }

    return {
        graphic: [
            {
                type: 'image',
                style: {
                    image: '/half-court.svg',
                    width: 400,
                    height: 250,
                },
                left: 'center',
                top: 'middle',
            },
            ...labels.map((zone) => ({
                type: 'rect',
                left: zone.x,
                top: zone.y,
                shape: { width: 80, height: 60 },
                style: {
                    fill: zone.color,
                    opacity: 0.3,
                },
            })),
            ...labels.map((zone) => ({
                type: 'text',
                left: zone.x + 5,
                top: zone.y + 5,
                style: {
                    text: `${zone.action}\nFG: ${zone.fg}%\nFreq: ${zone.freq}%`,
                    font: '13px sans-serif',
                    fill: '#000',
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    padding: 6,
                    shadowBlur: 5,
                    shadowColor: '#aaa',
                },
            })),
        ],
    };
}
